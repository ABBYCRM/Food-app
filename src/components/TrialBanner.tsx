import { Clock, Sparkles } from "lucide-react";
import { useTrial } from "@/context/TrialContext";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";

/**
 * Slim banner shown under the home header during the trial. Visually
 * distinct but never blocks content. Hidden once the user is unlocked;
 * the PaywallModal takes over when the trial is expired.
 */
export function TrialBanner() {
  const { status, daysRemaining, hoursRemaining } = useTrial();
  const { locale } = useUser();
  const t = dict[locale].trial;

  if (status === "unlocked") return null;
  if (status === "expired") return null; // PaywallModal handles that state.

  // Only show the last 3 days — keep it from being noisy at the start.
  if (daysRemaining > 3) return null;

  return (
    <div className="bg-corn/15 border-b border-corn/30 px-4 py-2 flex items-center gap-2 text-xs text-ink-soft">
      <Clock size={13} className="text-corn-600 shrink-0" />
      <span className="flex-1 leading-snug">
        {t.banner(daysRemaining)}{" "}
        <span className="text-ink-muted">
          · {hoursRemaining} {locale === "en" ? "hr" : locale === "es" ? "h" : "h"}
        </span>
      </span>
      <Sparkles size={13} className="text-corn-600 shrink-0" />
    </div>
  );
}
