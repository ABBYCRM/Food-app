/**
 * Stripe billing service.
 * Ported faithfully from server/billing.js.
 */
import Stripe from "stripe";
import type { AuthConfig } from "./config-auth.js";
import { repos, type AppUser, type AppSubscription } from "./auth-repos.js";

const SUPPORTED_STATUSES = new Set([
  "trialing", "active", "past_due", "canceled", "unpaid",
  "incomplete", "incomplete_expired", "paused",
]);
const STATUSES_BLOCKING_NEW_CHECKOUT = new Set([
  "active", "trialing", "past_due", "unpaid", "incomplete", "paused",
]);
const STATUSES_ALLOWING_REPLACEMENT = new Set(["canceled", "incomplete_expired"]);

function idOf(value: string | { id: string } | null | undefined): string | null {
  return typeof value === "string" ? value : (value as { id?: string })?.id ?? null;
}

function timestamp(value: number | null | undefined): Date | null {
  return typeof value === "number" ? new Date(value * 1_000) : null;
}

function normalizeSubscription(s: Stripe.Subscription) {
  const status = SUPPORTED_STATUSES.has(s.status) ? s.status : "incomplete";
  const ends = (s.items?.data ?? [])
    .map((i) => i.current_period_end)
    .filter((v): v is number => typeof v === "number");
  return {
    status,
    stripeSubscriptionId: s.id,
    currentPeriodEnd: ends.length ? timestamp(Math.max(...ends)) : null,
  };
}

function subscriptionRef(s: Stripe.Subscription): string | null {
  const v = s.metadata?.["app_subscription_ref"];
  return typeof v === "string" ? v : null;
}

function hasPrice(s: Stripe.Subscription, priceId: string): boolean {
  return (s.items?.data ?? []).some((i) => idOf(i.price as string | Stripe.Price) === priceId);
}

function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  // invoice.subscription was removed in newer Stripe SDK versions; use parent path
  const inv = invoice as Stripe.Invoice & {
    subscription?: string | Stripe.Subscription | null;
    parent?: { subscription_details?: { subscription?: string | null } };
  };
  return idOf(inv.subscription ?? null)
    ?? idOf(inv.parent?.subscription_details?.subscription ?? null)
    ?? null;
}

function httpError(statusCode: number, message: string): Error {
  return Object.assign(new Error(message), { statusCode });
}

export function createBillingService(config: AuthConfig) {
  if (!config.stripe) return null;

  const stripe = new Stripe(config.stripe.secretKey, {
    maxNetworkRetries: 2,
    timeout: 20_000,
  });
  const { priceId, webhookSecret } = config.stripe;

  async function ensureCustomer(user: AppUser, subscription: AppSubscription): Promise<string> {
    if (subscription.stripeCustomerId) return subscription.stripeCustomerId;
    const customer = await stripe.customers.create(
      { email: user.email ?? undefined, name: user.displayName ?? undefined,
        metadata: { app_subscription_ref: subscription.id } },
      { idempotencyKey: `mestizo-customer-${subscription.id}` },
    );
    const updated = await repos.setStripeCustomerForUser(user.id, customer.id);
    if (!updated) throw new Error("Unable to associate the billing customer with this account");
    return updated.stripeCustomerId!;
  }

  async function syncSubscriptionForUser(userId: string, stripeSub: Stripe.Subscription): Promise<void> {
    const customerId = idOf(stripeSub.customer as string | Stripe.Customer | null);
    const owned = await repos.getSubscriptionForUser(userId);
    const same = !owned?.stripeSubscriptionId || owned.stripeSubscriptionId === stripeSub.id;
    const validReplacement =
      Boolean(owned?.stripeSubscriptionId) &&
      STATUSES_ALLOWING_REPLACEMENT.has(owned?.status ?? "") &&
      subscriptionRef(stripeSub) === owned?.id;
    if (
      !owned || !customerId ||
      owned.stripeCustomerId !== customerId ||
      (!same && !validReplacement) ||
      subscriptionRef(stripeSub) !== owned.id ||
      !hasPrice(stripeSub, priceId)
    ) throw httpError(404, "Checkout session not found");
    await repos.updateSubscriptionForUser(userId, {
      ...normalizeSubscription(stripeSub),
      stripeCustomerId: customerId,
    });
  }

  async function syncSubscriptionByCustomer(stripeSub: Stripe.Subscription): Promise<void> {
    const customerId = idOf(stripeSub.customer as string | Stripe.Customer | null);
    if (!customerId) return;
    const owned = await repos.getSubscriptionByStripeCustomer(customerId);
    if (!owned) return;
    if (!hasPrice(stripeSub, priceId)) return;
    await repos.updateSubscriptionByVerifiedStripeCustomer(customerId, {
      ...normalizeSubscription(stripeSub),
    });
  }

  return Object.freeze({
    constructWebhookEvent(body: Buffer, signature: string): Stripe.Event {
      return stripe.webhooks.constructEvent(body, signature, webhookSecret);
    },

    async processWebhook(event: Stripe.Event): Promise<void> {
      const claimed = await repos.claimStripeEvent(event.id, event.type);
      if (!claimed) return; // idempotency — already processed
      try {
        const { type, data: { object } } = event;
        if (type === "checkout.session.completed") {
          const cs = object as Stripe.Checkout.Session;
          const subId = idOf(cs.subscription as string | Stripe.Subscription | null);
          if (!subId) return;
          const userId = cs.metadata?.["app_user_id"];
          if (!userId) return;
          const stripeSub = await stripe.subscriptions.retrieve(subId);
          await syncSubscriptionForUser(userId, stripeSub);
        } else if (
          type === "customer.subscription.updated" ||
          type === "customer.subscription.deleted"
        ) {
          await syncSubscriptionByCustomer(object as Stripe.Subscription);
        } else if (
          type === "invoice.paid" ||
          type === "invoice.payment_failed" ||
          type === "invoice.finalized"
        ) {
          const invoice = object as Stripe.Invoice;
          const subId = invoiceSubscriptionId(invoice);
          if (!subId) return;
          const stripeSub = await stripe.subscriptions.retrieve(subId);
          await syncSubscriptionByCustomer(stripeSub);
        }
        await repos.completeStripeEvent(event.id);
      } catch (err) {
        await repos.releaseStripeEvent(event.id);
        throw err;
      }
    },

    async startCheckout(user: AppUser, subscription: AppSubscription, successUrl: string, cancelUrl: string) {
      if (STATUSES_BLOCKING_NEW_CHECKOUT.has(subscription.status)) {
        throw httpError(409, "This account already has an active subscription");
      }
      const customerId = await ensureCustomer(user, subscription);
      const expiresAt  = new Date(Date.now() + 30 * 60_000);
      const session    = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url:  cancelUrl,
        subscription_data: {
          metadata: { app_subscription_ref: subscription.id, app_user_id: user.id },
        },
        metadata: { app_user_id: user.id },
        expires_at: Math.floor(expiresAt.getTime() / 1_000),
      });
      await repos.setPendingCheckoutForUser(user.id, session.id, expiresAt);
      return { url: session.url };
    },

    async startPortal(user: AppUser, subscription: AppSubscription, returnUrl: string) {
      if (!subscription.stripeCustomerId) {
        throw httpError(409, "No billing relationship exists for this account");
      }
      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: returnUrl,
      });
      return { url: session.url };
    },
  });
}

export type BillingService = NonNullable<ReturnType<typeof createBillingService>>;
