/**
 * NotificationPrompt — polite opt-in card shown in the Planner
 * after the user has at least one meal slot filled.
 *
 * Appears as a slim banner below the planner grid.  Dismissed permanently
 * via localStorage once the user explicitly accepts or declines.
 */
import { useState, useEffect } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePushNotifications } from "@/lib/use-push-notifications";
import type { MealPlan } from "@/lib/storage";

const DISMISSED_KEY = "mestizo_push_prompt_dismissed";

interface Props {
  mealPlan: MealPlan;
  hasMeals: boolean;
}

export function NotificationPrompt({ mealPlan, hasMeals }: Props) {
  const { state, isSupported, subscribe, unsubscribe } = usePushNotifications();
  const [dismissed, setDismissed] = useState(true); // start hidden, check in effect
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    try {
      const val = localStorage.getItem(DISMISSED_KEY);
      setDismissed(val === "true");
    } catch {
      setDismissed(false);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setDismissed(true);
  };

  const handleSubscribe = async () => {
    setLoading(true);
    const ok = await subscribe(mealPlan);
    setLoading(false);
    if (ok) {
      // keep visible so user can see "Reminders on" state — don't auto-dismiss
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    await unsubscribe();
    setLoading(false);
  };

  // Don't render if: unsupported, dismissed, no meals yet, or denied
  const shouldShow = isSupported && !dismissed && hasMeals && state !== "denied";
  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="notif-prompt"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.35 }}
        className="relative mt-8 rounded-2xl border border-primary/25 bg-primary/8 px-5 py-4 flex items-start gap-4"
      >
        {/* Icon */}
        <div className="shrink-0 mt-0.5">
          {state === "subscribed"
            ? <Bell className="w-5 h-5 text-primary" />
            : <Bell className="w-5 h-5 text-muted-foreground" />
          }
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          {state === "subscribed" ? (
            <>
              <p className="text-sm font-medium text-foreground">
                Meal reminders are <span className="text-primary">on</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                You'll get a notification at 7 pm the evening before each planned meal.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">
                Get a reminder the night before each meal
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                We'll send a notification at 7 pm with tomorrow's menu — no account required.
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {state === "subscribed" ? (
            <button
              onClick={handleUnsubscribe}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
            >
              <BellOff className="w-3.5 h-3.5" />
              Turn off
            </button>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-background text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Bell className="w-3 h-3" />
              {loading ? "…" : "Remind me"}
            </button>
          )}

          {state !== "subscribed" && (
            <button
              onClick={dismiss}
              className="p-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors rounded-full"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
