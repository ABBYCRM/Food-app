import { useState } from "react";
import {
  CalendarDays,
  NotebookPen,
  Bookmark,
  WifiOff,
  MapPin,
  Sparkles,
  X,
  Lock,
  Check,
} from "lucide-react";
import { useTrial } from "@/context/TrialContext";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";

/**
 * Soft paywall. The app stays browsable — recipes, chefs, philosophy,
 * pantry, allergy filters all keep working. The modal appears once
 * the trial expires, the user can dismiss (re-shows next visit) or
 * unlock. Unlocking stamps `trialUnlockedAt` in LocalStorage and
 * removes the modal + lifts all write-action guards.
 *
 * SECURITY: this is a UX gate. A malicious user can clear LocalStorage
 * to start a new trial. That's acceptable here because the value
 * (recipes) is browsable, only the *persistence* of write actions is
 * gated. When a backend ships, the entitlement must be enforced
 * server-side (see SECURITY-MODEL.md §4, §5, §6).
 */
export function PaywallModal({
  force = false,
  onClose,
}: {
  force?: boolean;
  onClose?: () => void;
}) {
  const { locale } = useUser();
  const { status, unlock, dismiss } = useTrial();
  const t = dict[locale].trial;

  const visible = force || status === "expired";
  const [open, setOpen] = useState(true);
  if (!visible || !open) return null;

  const features = [
    { icon: <CalendarDays size={16} />, label: t.paywallFeaturePlanner },
    { icon: <NotebookPen size={16} />, label: t.paywallFeatureNotebook },
    { icon: <Bookmark size={16} />, label: t.paywallFeatureFavorites },
    { icon: <WifiOff size={16} />, label: t.paywallFeatureOffline },
    { icon: <MapPin size={16} />, label: t.paywallFeatureVendors },
    { icon: <Sparkles size={16} />, label: t.paywallFeatureUpdates },
  ];

  const close = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <>
      <div className="fixed inset-0 z-modal bg-ink/55 backdrop-blur-sm" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="paywall-title"
        className="fixed z-modal left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[min(94vw,32rem)] max-h-[90vh] overflow-auto card-surface p-6 fade-up"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 grid place-items-center rounded-pill bg-chili/10 text-chili shrink-0">
              <Lock size={16} />
            </span>
            <h2 id="paywall-title" className="display-md">
              {t.paywallTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="header-icon-btn"
            style={{ color: "var(--color-ink)" }}
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-sm text-ink-soft leading-relaxed mb-5">{t.paywallBody}</p>

        <div className="rounded-input border border-line bg-surface-1 p-4 mb-5">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="display-md">{t.paywallPrice}</span>
          </div>
          <p className="text-xs text-ink-muted">{t.paywallSub}</p>
        </div>

        <p className="eyebrow mb-2">{t.paywallFeaturesTitle}</p>
        <ul className="space-y-2 mb-6">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-ink-soft leading-relaxed">
              <span className="text-jade shrink-0 mt-0.5">
                <Check size={15} />
              </span>
              <span>{f.label}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="btn btn-primary btn-block btn-lg"
            onClick={() => {
              // Real Stripe / Paddle integration goes here. For now the
              // unlock action stamps a LocalStorage flag and lifts the gate.
              // Replace with a real checkout redirect when billing ships.
              unlock();
              close();
            }}
          >
            {t.paywallUnlock}
          </button>
          <button type="button" className="btn btn-ghost btn-block" onClick={() => { dismiss(); close(); }}>
            {t.paywallContinue}
          </button>
        </div>
      </div>
    </>
  );
}
