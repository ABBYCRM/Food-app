/**
 * Billing routes — Stripe checkout, portal, webhook, and status.
 *
 * POST /api/billing/webhook        → Stripe webhook (no auth)
 * GET  /api/billing/status         → current entitlement
 * POST /api/billing/checkout       → start Stripe checkout
 * POST /api/billing/checkout/complete → poll after redirect
 * POST /api/billing/portal         → open Stripe billing portal
 */
import { Router, type Request } from "express";
import type { AuthConfig } from "../lib/config-auth.js";
import type { BillingService } from "../lib/billing.js";
import { repos } from "../lib/auth-repos.js";
import { describeEntitlement } from "../lib/entitlements.js";
import type { AuthMiddleware } from "./auth.js";

export function createBillingRouter(
  config: AuthConfig,
  billing: BillingService,
  auth: AuthMiddleware,
): Router {
  const router = Router();

  // Stripe webhook — raw body needed for signature verification
  router.post(
    "/webhook",
    (req, res, next) => {
      // body was already parsed as raw Buffer by app.ts special-case
      next();
    },
    async (req, res, next) => {
      try {
        const signature = req.get("stripe-signature");
        if (!signature) return res.status(400).json({ error: "Missing Stripe signature" });
        const event = billing.constructWebhookEvent(req.body as Buffer, signature);
        await billing.processWebhook(event);
        return res.status(200).json({ received: true });
      } catch (err) { return next(err); }
    },
  );

  // All other billing routes require authentication + CSRF
  router.use(auth.resolveAuthentication, auth.requireAuthentication);

  router.get("/status", async (req, res, next) => {
    try {
      const subscription = await repos.getSubscriptionForUser(req.user!.id);
      return res.json(describeEntitlement(subscription));
    } catch (err) { return next(err); }
  });

  router.post("/checkout", auth.requireCsrf, async (req, res, next) => {
    try {
      const subscription = await repos.getSubscriptionForUser(req.user!.id);
      if (!subscription) return res.status(404).json({ error: "Subscription record not found", code: "NO_SUBSCRIPTION" });
      const successUrl = `${config.publicBaseUrl}/billing/success`;
      const cancelUrl  = `${config.publicBaseUrl}/billing/cancelled`;
      const result = await billing.startCheckout(req.user!, subscription, successUrl, cancelUrl);
      return res.json(result);
    } catch (err) { return next(err); }
  });

  router.post("/checkout/complete", auth.requireCsrf, async (req, res, next) => {
    try {
      // After the redirect-back, re-fetch the subscription to return updated state
      const subscription = await repos.getSubscriptionForUser(req.user!.id);
      return res.json(describeEntitlement(subscription));
    } catch (err) { return next(err); }
  });

  router.post("/portal", auth.requireCsrf, async (req, res, next) => {
    try {
      const subscription = await repos.getSubscriptionForUser(req.user!.id);
      if (!subscription) return res.status(404).json({ error: "No subscription found", code: "NO_SUBSCRIPTION" });
      const returnUrl = `${config.publicBaseUrl}/`;
      const result = await billing.startPortal(req.user!, subscription, returnUrl);
      return res.json(result);
    } catch (err) { return next(err); }
  });

  return router;
}
