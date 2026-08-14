import { describe, expect, it } from "vitest";
import { createBillingService } from "./billing.js";

function harness() {
  const subscription = {
    id: "subscription-row-a",
    userId: "user-a",
    status: "trialing",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    pendingCheckoutSessionId: null,
    pendingCheckoutExpiresAt: null,
    currentPeriodEnd: null,
  };
  const checkoutCalls = [];
  const webhookUpdates = [];
  const completedEvents = [];
  let shouldClaimEvent = true;
  const stripeSubscription = {
    id: "sub_stripe_a",
    customer: "cus_a",
    status: "active",
    metadata: { app_subscription_ref: "subscription-row-a" },
    items: { data: [{ price: "price_monthly", current_period_end: 1_800_000_000 }] },
  };
  const repositories = {
    getSubscriptionForUser: async (userId) => userId === "user-a" ? subscription : null,
    setStripeCustomerForUser: async (userId, customerId) => {
      if (userId !== "user-a") return null;
      subscription.stripeCustomerId = customerId;
      return subscription;
    },
    setPendingCheckoutForUser: async (_userId, sessionId, expiresAt) => {
      subscription.pendingCheckoutSessionId = sessionId;
      subscription.pendingCheckoutExpiresAt = expiresAt;
      return subscription;
    },
    updateSubscriptionForUser: async (userId, values) => ({ ...subscription, ...values, userId }),
    getSubscriptionByStripeCustomer: async (customerId) => customerId === subscription.stripeCustomerId ? subscription : null,
    updateSubscriptionByVerifiedStripeCustomer: async (_customerId, values) => {
      webhookUpdates.push(values);
      Object.assign(subscription, values);
      return { ...subscription };
    },
    claimStripeEvent: async () => shouldClaimEvent,
    completeStripeEvent: async (eventId) => { completedEvents.push(eventId); },
    releaseStripeEvent: async () => {},
  };
  const stripeClient = {
    customers: {
      create: async () => ({ id: "cus_a" }),
    },
    checkout: {
      sessions: {
        create: async (input) => {
          checkoutCalls.push(input);
          return { id: "cs_new", url: "https://checkout.stripe.com/c/pay_test", expires_at: 1_800_000_000 };
        },
        retrieve: async (id) => ({
          id,
          mode: "subscription",
          status: "complete",
          customer: id === "cs_wrong_owner" ? "cus_b" : "cus_a",
          subscription: stripeSubscription,
        }),
      },
    },
    subscriptions: { retrieve: async () => stripeSubscription },
    billingPortal: { sessions: { create: async () => ({ url: "https://billing.stripe.com/p/test" }) } },
    webhooks: { constructEvent: () => ({}) },
  };
  const config = {
    publicBaseUrl: "https://food.example",
    stripe: {
      secretKey: "sk_test",
      webhookSecret: "whsec_test",
      priceId: "price_monthly",
    },
  };
  return {
    subscription,
    stripeSubscription,
    checkoutCalls,
    webhookUpdates,
    completedEvents,
    setShouldClaimEvent(value) { shouldClaimEvent = value; },
    service: createBillingService({ config, repositories, stripeClient }),
  };
}

describe("seven-day billing handoff", () => {
  it("creates an immediate paid subscription checkout without adding a second Stripe trial", async () => {
    const { service, checkoutCalls } = harness();
    const url = await service.createCheckout({ id: "user-a", email: "a@example.test", displayName: "A" });
    expect(url).toContain("checkout.stripe.com");
    expect(checkoutCalls).toHaveLength(1);
    expect(checkoutCalls[0]).toMatchObject({
      mode: "subscription",
      customer: "cus_a",
      line_items: [{ price: "price_monthly", quantity: 1 }],
    });
    expect(checkoutCalls[0].subscription_data).not.toHaveProperty("trial_period_days");
    expect(JSON.stringify(checkoutCalls[0])).not.toContain("user-a");
  });

  it("confirms only a checkout owned by the authenticated account", async () => {
    const { service, subscription } = harness();
    subscription.stripeCustomerId = "cus_a";
    await expect(service.completeCheckoutForUser("user-a", "cs_wrong_owner"))
      .rejects.toMatchObject({ statusCode: 404 });
    const updated = await service.completeCheckoutForUser("user-a", "cs_owned");
    expect(updated).toMatchObject({ status: "active", stripeSubscriptionId: "sub_stripe_a" });
    expect(updated.currentPeriodEnd.toISOString()).toBe("2027-01-15T08:00:00.000Z");
  });

  it("synchronizes signed subscription and failed-invoice events through the stored customer boundary", async () => {
    const { service, subscription, webhookUpdates, completedEvents } = harness();
    subscription.stripeCustomerId = "cus_a";

    await service.processWebhook({
      id: "evt_subscription_updated",
      type: "customer.subscription.updated",
      data: { object: {
        id: "sub_stripe_a",
        customer: "cus_a",
        status: "active",
        metadata: { app_subscription_ref: "subscription-row-a" },
        items: { data: [{ price: "price_monthly", current_period_end: 1_800_000_000 }] },
      } },
    });
    expect(webhookUpdates.at(-1)).toMatchObject({
      status: "active",
      stripeSubscriptionId: "sub_stripe_a",
    });

    await service.processWebhook({
      id: "evt_invoice_failed",
      type: "invoice.payment_failed",
      data: { object: {
        customer: "cus_a",
        parent: { subscription_details: { subscription: "sub_stripe_a" } },
      } },
    });
    expect(webhookUpdates.at(-1)).toMatchObject({ status: "past_due", stripeSubscriptionId: "sub_stripe_a" });
    expect(completedEvents).toEqual(["evt_subscription_updated", "evt_invoice_failed"]);
  });

  it("does not reprocess an already claimed Stripe event", async () => {
    const { service, setShouldClaimEvent, webhookUpdates, completedEvents } = harness();
    setShouldClaimEvent(false);
    await expect(service.processWebhook({
      id: "evt_duplicate",
      type: "customer.subscription.deleted",
      data: { object: {} },
    })).resolves.toEqual({ duplicate: true });
    expect(webhookUpdates).toHaveLength(0);
    expect(completedEvents).toHaveLength(0);
  });

  it("prevents a second subscription checkout while existing billing needs resolution", async () => {
    const { service, subscription, checkoutCalls } = harness();
    subscription.status = "past_due";
    subscription.stripeCustomerId = "cus_a";
    subscription.stripeSubscriptionId = "sub_existing";
    await expect(service.createCheckout({ id: "user-a" })).rejects.toMatchObject({ statusCode: 409 });
    expect(checkoutCalls).toHaveLength(0);
  });

  it("rejects a completed checkout that does not contain the configured price", async () => {
    const { service, subscription, stripeSubscription } = harness();
    subscription.stripeCustomerId = "cus_a";
    stripeSubscription.items.data[0].price = "price_unrelated";

    await expect(service.completeCheckoutForUser("user-a", "cs_owned"))
      .rejects.toMatchObject({ statusCode: 404 });
  });

  it("rejects a completed checkout without the server-issued subscription reference", async () => {
    const { service, subscription, stripeSubscription } = harness();
    subscription.stripeCustomerId = "cus_a";
    stripeSubscription.metadata.app_subscription_ref = "subscription-row-b";

    await expect(service.completeCheckoutForUser("user-a", "cs_owned"))
      .rejects.toMatchObject({ statusCode: 404 });
  });

  it("does not replace an active subscription with another completed checkout", async () => {
    const { service, subscription } = harness();
    subscription.stripeCustomerId = "cus_a";
    subscription.stripeSubscriptionId = "sub_already_active";
    subscription.status = "active";

    await expect(service.completeCheckoutForUser("user-a", "cs_owned"))
      .rejects.toMatchObject({ statusCode: 404 });
  });

  it("ignores a webhook for an unrelated subscription under the same customer", async () => {
    const { service, subscription, webhookUpdates, completedEvents } = harness();
    subscription.stripeCustomerId = "cus_a";
    subscription.stripeSubscriptionId = "sub_owned";
    subscription.status = "trialing";

    await service.processWebhook({
      id: "evt_unrelated_subscription",
      type: "customer.subscription.updated",
      data: { object: {
        id: "sub_other",
        customer: "cus_a",
        status: "active",
        metadata: { app_subscription_ref: subscription.id },
        items: { data: [{ price: "price_monthly", current_period_end: 1_800_000_000 }] },
      } },
    });

    expect(webhookUpdates).toHaveLength(0);
    expect(completedEvents).toEqual(["evt_unrelated_subscription"]);
  });
});
