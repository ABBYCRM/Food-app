/**
 * Entitlement logic — maps a subscription record to an access decision.
 * Ported faithfully from server/entitlements.js.
 */
import type { Request, Response, NextFunction } from "express";
import { repos, type AppSubscription } from "./auth-repos.js";

export interface EntitlementState {
  allowed: boolean;
  state: "unavailable" | "trial" | "paid" | "paywall";
  trialEndsAt: string | null;
  daysRemaining: number;
  currentPeriodEnd: string | null;
}

export function describeEntitlement(
  subscription: AppSubscription | null,
  now = new Date(),
): EntitlementState {
  if (!subscription) {
    return { allowed: false, state: "unavailable", trialEndsAt: null, daysRemaining: 0, currentPeriodEnd: null };
  }
  const internalTrialActive =
    !subscription.stripeSubscriptionId &&
    subscription.status === "trialing" &&
    subscription.trialEndsAt.getTime() > now.getTime();
  const paidActive =
    subscription.status === "active" ||
    (Boolean(subscription.stripeSubscriptionId) && subscription.status === "trialing");
  const remainingMs = Math.max(0, subscription.trialEndsAt.getTime() - now.getTime());
  return {
    allowed: internalTrialActive || paidActive,
    state: paidActive ? "paid" : internalTrialActive ? "trial" : "paywall",
    trialEndsAt: subscription.trialEndsAt.toISOString(),
    daysRemaining: internalTrialActive ? Math.ceil(remainingMs / 86_400_000) : 0,
    currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
  };
}

/** Express middleware: 403 if the authenticated user has no active entitlement. */
export function requireEntitlement(clock: () => Date = () => new Date()) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscription = await repos.getSubscriptionForUser(req.user!.id);
      const entitlement  = describeEntitlement(subscription, clock());
      (req as Request & { subscription?: AppSubscription; entitlement?: EntitlementState })
        .subscription = subscription ?? undefined;
      (req as Request & { entitlement?: EntitlementState }).entitlement = entitlement;
      if (!entitlement.allowed) {
        return res.status(403).json({ error: "Subscription required", code: "PAYWALL_REQUIRED" });
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
}
