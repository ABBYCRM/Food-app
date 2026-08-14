export function describeEntitlement(subscription, now = new Date()) {
  if (!subscription) {
    return {
      allowed: false,
      state: "unavailable",
      trialEndsAt: null,
      daysRemaining: 0,
      currentPeriodEnd: null,
    };
  }

  const internalTrialActive = !subscription.stripeSubscriptionId
    && subscription.status === "trialing"
    && subscription.trialEndsAt.getTime() > now.getTime();
  const paidActive = subscription.status === "active"
    || (Boolean(subscription.stripeSubscriptionId) && subscription.status === "trialing");
  const remainingMs = Math.max(0, subscription.trialEndsAt.getTime() - now.getTime());

  return {
    allowed: internalTrialActive || paidActive,
    state: paidActive ? "paid" : internalTrialActive ? "trial" : "paywall",
    trialEndsAt: subscription.trialEndsAt.toISOString(),
    daysRemaining: internalTrialActive ? Math.ceil(remainingMs / 86_400_000) : 0,
    currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
  };
}

export function createEntitlementMiddleware({ repositories, clock = () => new Date() }) {
  return async function requireEntitlement(req, res, next) {
    try {
      const subscription = await repositories.getSubscriptionForUser(req.user.id);
      const entitlement = describeEntitlement(subscription, clock());
      req.subscription = subscription;
      req.entitlement = entitlement;
      if (!entitlement.allowed) {
        return res.status(403).json({ error: "Subscription required", code: "PAYWALL_REQUIRED" });
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

