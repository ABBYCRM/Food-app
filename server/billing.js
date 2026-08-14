import Stripe from "stripe";

const supportedStatuses = new Set([
  "trialing", "active", "past_due", "canceled", "unpaid", "incomplete", "incomplete_expired", "paused",
]);
const statusesRequiringExistingBillingResolution = new Set([
  "active", "trialing", "past_due", "unpaid", "incomplete", "paused",
]);
const statusesAllowingReplacementSubscription = new Set([
  "canceled", "incomplete_expired",
]);

function httpError(statusCode, message) {
  return Object.assign(new Error(message), { statusCode });
}

function idOf(value) {
  return typeof value === "string" ? value : value?.id ?? null;
}

function timestamp(value) {
  return typeof value === "number" ? new Date(value * 1_000) : null;
}

function normalizeSubscription(stripeSubscription) {
  const status = supportedStatuses.has(stripeSubscription.status) ? stripeSubscription.status : "incomplete";
  const periodEnds = stripeSubscription.items?.data
    ?.map((item) => item.current_period_end)
    .filter((value) => typeof value === "number") ?? [];
  const currentPeriodEnd = periodEnds.length ? Math.max(...periodEnds) : null;
  return {
    status,
    stripeSubscriptionId: stripeSubscription.id,
    currentPeriodEnd: timestamp(currentPeriodEnd),
  };
}

function invoiceSubscriptionId(invoice) {
  return idOf(invoice.subscription)
    ?? idOf(invoice.parent?.subscription_details?.subscription)
    ?? null;
}

function subscriptionHasPrice(stripeSubscription, expectedPriceId) {
  return stripeSubscription.items?.data?.some((item) => idOf(item.price) === expectedPriceId) ?? false;
}

function subscriptionReference(stripeSubscription) {
  const value = stripeSubscription.metadata?.app_subscription_ref;
  return typeof value === "string" ? value : null;
}

export function createBillingService({ config, repositories, stripeClient }) {
  const stripe = stripeClient ?? new Stripe(config.stripe.secretKey, {
    maxNetworkRetries: 2,
    timeout: 20_000,
  });

  async function ensureCustomer(user, subscription) {
    if (subscription.stripeCustomerId) return subscription.stripeCustomerId;
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      name: user.displayName ?? undefined,
      metadata: { app_subscription_ref: subscription.id },
    }, { idempotencyKey: `mestizo-customer-${subscription.id}` });
    const updated = await repositories.setStripeCustomerForUser(user.id, customer.id);
    if (!updated) throw new Error("Unable to associate the billing customer with this account");
    return updated.stripeCustomerId;
  }

  async function synchronizeStripeSubscriptionForUser(userId, stripeSubscription) {
    const customerId = idOf(stripeSubscription.customer);
    const owned = await repositories.getSubscriptionForUser(userId);
    const sameSubscription = !owned?.stripeSubscriptionId
      || owned.stripeSubscriptionId === stripeSubscription.id;
    const validReplacement = Boolean(owned?.stripeSubscriptionId)
      && statusesAllowingReplacementSubscription.has(owned.status)
      && subscriptionReference(stripeSubscription) === owned.id;
    if (
      !owned
      || !customerId
      || owned.stripeCustomerId !== customerId
      || (!sameSubscription && !validReplacement)
      || subscriptionReference(stripeSubscription) !== owned.id
      || !subscriptionHasPrice(stripeSubscription, config.stripe.priceId)
    ) {
      throw httpError(404, "Checkout session not found");
    }
    return repositories.updateSubscriptionForUser(userId, {
      ...normalizeSubscription(stripeSubscription),
      stripeCustomerId: customerId,
    });
  }

  async function synchronizeStripeSubscriptionByCustomer(stripeSubscription) {
    const customerId = idOf(stripeSubscription.customer);
    if (!customerId) return null;
    const owned = await repositories.getSubscriptionByStripeCustomer(customerId);
    if (!owned) return null;
    const sameSubscription = owned.stripeSubscriptionId === stripeSubscription.id;
    const validReplacement = (!owned.stripeSubscriptionId || statusesAllowingReplacementSubscription.has(owned.status))
      && subscriptionReference(stripeSubscription) === owned.id;
    if (!sameSubscription && !validReplacement) return null;

    const normalized = normalizeSubscription(stripeSubscription);
    if (!subscriptionHasPrice(stripeSubscription, config.stripe.priceId)) {
      if (!sameSubscription) return null;
      normalized.status = "canceled";
    }
    return repositories.updateSubscriptionByVerifiedStripeCustomer(customerId, normalized);
  }

  async function markInvoicePaymentFailed(invoice) {
    const customerId = idOf(invoice.customer);
    const subscriptionId = invoiceSubscriptionId(invoice);
    if (!customerId || !subscriptionId) return null;

    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (idOf(stripeSubscription.customer) !== customerId) return null;
    const owned = await repositories.getSubscriptionByStripeCustomer(customerId);
    if (!owned) return null;
    const sameSubscription = owned.stripeSubscriptionId === stripeSubscription.id;
    const validReplacement = (!owned.stripeSubscriptionId || statusesAllowingReplacementSubscription.has(owned.status))
      && subscriptionReference(stripeSubscription) === owned.id;
    if (
      (!sameSubscription && !validReplacement)
      || !subscriptionHasPrice(stripeSubscription, config.stripe.priceId)
    ) return null;

    return repositories.updateSubscriptionByVerifiedStripeCustomer(customerId, {
      ...normalizeSubscription(stripeSubscription),
      status: "past_due",
    });
  }

  return Object.freeze({
    constructWebhookEvent(payload, signature) {
      return stripe.webhooks.constructEvent(payload, signature, config.stripe.webhookSecret);
    },

    async createCheckout(user) {
      let subscription = await repositories.getSubscriptionForUser(user.id);
      if (!subscription) throw new Error("Account entitlement record is missing");
      if (
        subscription.status === "active"
        || (subscription.stripeSubscriptionId && statusesRequiringExistingBillingResolution.has(subscription.status))
      ) {
        throw httpError(409, "Use the billing portal to manage the existing subscription");
      }
      const customerId = await ensureCustomer(user, subscription);
      subscription = await repositories.getSubscriptionForUser(user.id);
      const now = new Date();
      if (subscription?.pendingCheckoutSessionId && subscription.pendingCheckoutExpiresAt?.getTime() > now.getTime()) {
        const pending = await stripe.checkout.sessions.retrieve(subscription.pendingCheckoutSessionId);
        if (pending.status === "open" && pending.url && idOf(pending.customer) === customerId) return pending.url;
      }
      const checkoutExpiresAt = new Date(now.getTime() + 31 * 60_000);
      const checkout = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: config.stripe.priceId, quantity: 1 }],
        allow_promotion_codes: true,
        billing_address_collection: "auto",
        success_url: `${config.publicBaseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.publicBaseUrl}/billing/cancelled`,
        expires_at: Math.floor(checkoutExpiresAt.getTime() / 1_000),
        subscription_data: {
          metadata: { app_subscription_ref: subscription.id },
        },
      }, { idempotencyKey: `mestizo-checkout-${subscription.id}-${Math.floor(now.getTime() / 1_800_000)}` });
      if (!checkout.url) throw new Error("Stripe did not return a checkout URL");
      await repositories.setPendingCheckoutForUser(
        user.id,
        checkout.id,
        checkout.expires_at ? new Date(checkout.expires_at * 1_000) : checkoutExpiresAt,
      );
      return checkout.url;
    },

    async completeCheckoutForUser(userId, checkoutSessionId) {
      const checkout = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
        expand: ["subscription"],
      });
      const owned = await repositories.getSubscriptionForUser(userId);
      const customerId = idOf(checkout.customer);
      if (!owned || !customerId || owned.stripeCustomerId !== customerId) {
        throw httpError(404, "Checkout session not found");
      }
      if (checkout.mode !== "subscription" || checkout.status !== "complete") {
        throw httpError(409, "Checkout is not complete");
      }
      let stripeSubscription = checkout.subscription;
      if (typeof stripeSubscription === "string") {
        stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscription);
      }
      if (!stripeSubscription?.id) throw new Error("Checkout did not create a subscription");
      return synchronizeStripeSubscriptionForUser(userId, stripeSubscription);
    },

    async createPortalForUser(userId) {
      const subscription = await repositories.getSubscriptionForUser(userId);
      if (!subscription?.stripeCustomerId) throw httpError(409, "No billing account exists yet");
      const portal = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: config.publicBaseUrl,
      });
      return portal.url;
    },

    async processWebhook(event) {
      const claimed = await repositories.claimStripeEvent(event.id, event.type);
      if (!claimed) return { duplicate: true };
      try {
        if (event.type === "checkout.session.completed") {
          const checkout = event.data.object;
          const customerId = idOf(checkout.customer);
          const subscriptionId = idOf(checkout.subscription);
          if (customerId && subscriptionId) {
            const owned = await repositories.getSubscriptionByStripeCustomer(customerId);
            if (owned) {
              const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
              await synchronizeStripeSubscriptionByCustomer(stripeSubscription);
            }
          }
        } else if (event.type.startsWith("customer.subscription.")) {
          await synchronizeStripeSubscriptionByCustomer(event.data.object);
        } else if (event.type === "invoice.paid") {
          const invoice = event.data.object;
          const subscriptionId = invoiceSubscriptionId(invoice);
          if (subscriptionId) {
            const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
            await synchronizeStripeSubscriptionByCustomer(stripeSubscription);
          }
        } else if (event.type === "invoice.payment_failed") {
          await markInvoicePaymentFailed(event.data.object);
        }
        await repositories.completeStripeEvent(event.id);
        return { duplicate: false };
      } catch (error) {
        await repositories.releaseStripeEvent(event.id);
        throw error;
      }
    },
  });
}
