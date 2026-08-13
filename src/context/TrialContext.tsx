import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { load, save } from "@/lib/storage";

/**
 * 7-day free trial + soft paywall.
 *
 * The trial clock starts on the user's first visit (a LocalStorage timestamp
 * stamped lazily in this provider's mount effect). After 7 days, the app
 * flips to "expired" — interactive features degrade with a soft paywall
 * (browsing still works, but planner/notebook/favorites are disabled and
 * surface a "Subscribe to save" affordance).
 *
 * SECURITY NOTE (per SECURITY-MODEL.md §3, §12):
 *   Trial state is per-browser (LocalStorage). It is not a security
 *   boundary. The paywall is a UX gate, not an access control. A user
 *   can clear LocalStorage and start a new trial. This is acceptable
 *   for a content app where recipes are the value, not the gate.
 *   When a backend ships, the trial + entitlement must be enforced
 *   server-side on a `subscriptions` table keyed by `userId` and
 *   validated per request — never trusted from the client.
 */

export type TrialStatus = "trialing" | "expired" | "unlocked" | "dismissed";

type TrialState = {
  /** ms timestamp when the trial started, or null if not yet started */
  startedAt: number | null;
  /** ms timestamp when the user unlocked (paid), or null */
  unlockedAt: number | null;
  /** "trialing" | "expired" | "unlocked" | "dismissed" (dismissed = user closed the paywall once but didn't unlock) */
  status: TrialStatus;
  /** days remaining in the trial (0 if expired) */
  daysRemaining: number;
  /** hours remaining (rounded) — useful for the last-day UX */
  hoursRemaining: number;
};

type TrialActions = {
  /** Mark the trial as unlocked (called after a successful purchase). */
  unlock: () => void;
  /** Reset the trial (used by the developer / clear-localStorage flow). */
  reset: () => void;
  /** Dismiss the paywall UI (without unlocking) — re-shows on next visit. */
  dismiss: () => void;
  /** True if the user is allowed to perform write actions (favorites, planner, etc). */
  canWrite: boolean;
};

const Ctx = createContext<(TrialState & TrialActions) | null>(null);

/** 7 days in ms. */
export const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function nowMs() {
  return Date.now();
}

function computeStatus(startedAt: number | null, unlockedAt: number | null, dismissed: boolean): TrialStatus {
  if (unlockedAt) return "unlocked";
  if (!startedAt) return "trialing"; // first visit, treat as trialing until effect runs
  if (nowMs() - startedAt >= TRIAL_DURATION_MS) return "expired";
  if (dismissed) return "dismissed";
  return "trialing";
}

function computeRemaining(startedAt: number | null): { days: number; hours: number } {
  if (!startedAt) return { days: 7, hours: 7 * 24 };
  const elapsed = nowMs() - startedAt;
  const left = Math.max(0, TRIAL_DURATION_MS - elapsed);
  return {
    days: Math.ceil(left / (24 * 60 * 60 * 1000)),
    hours: Math.ceil(left / (60 * 60 * 1000)),
  };
}

export function TrialProvider({ children }: { children: ReactNode }) {
  // Lazy init: read persisted state, fall back to a "not started" placeholder.
  // The first-use stamp happens in the mount effect so SSR / strict-mode
  // double-mount doesn't shift the clock.
  const [startedAt, setStartedAt] = useState<number | null>(() => load("trialStartedAt", null as number | null));
  const [unlockedAt, setUnlockedAt] = useState<number | null>(() => load("trialUnlockedAt", null as number | null));
  const [dismissedAt, setDismissedAt] = useState<number | null>(() => load("trialDismissedAt", null as number | null));
  const [, setTick] = useState(0);

  // First-visit stamp.
  useEffect(() => {
    if (startedAt === null) {
      const t = nowMs();
      setStartedAt(t);
      save("trialStartedAt", t);
    }
  }, [startedAt]);

  // Persist on change.
  useEffect(() => { save("trialStartedAt", startedAt); }, [startedAt]);
  useEffect(() => { save("trialUnlockedAt", unlockedAt); }, [unlockedAt]);
  useEffect(() => { save("trialDismissedAt", dismissedAt); }, [dismissedAt]);

  // Re-evaluate status every minute so the last-day UX ticks down accurately.
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const unlock = useCallback(() => {
    const t = nowMs();
    setUnlockedAt(t);
    setDismissedAt(null);
  }, []);

  const reset = useCallback(() => {
    setStartedAt(nowMs());
    setUnlockedAt(null);
    setDismissedAt(null);
  }, []);

  const dismiss = useCallback(() => {
    setDismissedAt(nowMs());
  }, []);

  const value = useMemo<TrialState & TrialActions>(() => {
    const status = computeStatus(startedAt, unlockedAt, dismissedAt !== null);
    const { days, hours } = computeRemaining(startedAt);
    return {
      startedAt,
      unlockedAt,
      status,
      daysRemaining: days,
      hoursRemaining: hours,
      unlock,
      reset,
      dismiss,
      canWrite: status === "trialing" || status === "unlocked",
    };
  }, [startedAt, unlockedAt, dismissedAt, unlock, reset, dismiss]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTrial() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTrial must be used within TrialProvider");
  return v;
}

/** Lightweight guard hook — returns true and a reason string when the action is blocked. */
export function useTrialGuard() {
  const { canWrite, status, daysRemaining } = useTrial();
  return {
    canWrite,
    status,
    daysRemaining,
    reason: canWrite
      ? null
      : status === "expired"
        ? "Your free 7-day trial has ended. Subscribe to keep using the planner, notebook, and favorites."
        : "Please subscribe to continue.",
  };
}
