import { useState } from "react";
import { Download, Share, Plus, X, Smartphone } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";
import { cn } from "@/lib/cn";

/**
 * PWA install entry point. Renders:
 * - "Install on my device" button in the home header (always visible when
 *   the install prompt is supported).
 * - Inline popover with iOS how-to steps on Safari.
 * - "Installed" badge when running as a standalone PWA.
 */
export function InstallButton({ className }: { className?: string }) {
  const { locale } = useUser();
  const { state, dismiss } = useInstallPrompt();
  const [open, setOpen] = useState(false);
  const t = dict[locale].trial;

  if (state.kind === "installed") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[11px] font-semibold uppercase tracking-[0.14em]",
          "bg-jade/10 text-jade",
          className,
        )}
        title={t.installInstalled}
      >
        <Smartphone size={13} />
        Installed
      </span>
    );
  }

  if (state.kind === "unsupported") return null;

  // Both android-prompt and ios-instructions show the same button — different popover content.
  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="btn btn-ghost btn-sm"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Download size={14} />
        {t.installLabel}
      </button>
      {open ? (
        <>
          <div
            className="fixed inset-0 z-modal bg-ink/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.installTitle}
            className="fixed z-modal left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-[min(92vw,28rem)] card-surface p-6 fade-up"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 grid place-items-center rounded-pill bg-chili/10 text-chili shrink-0">
                  <Smartphone size={18} />
                </span>
                <h3 className="display-md">{t.installTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="header-icon-btn"
                style={{ color: "var(--color-ink)" }}
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-ink-soft leading-relaxed mb-4">{t.installBody}</p>

            {state.kind === "android-prompt" ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="btn btn-primary btn-block btn-lg"
                  onClick={async () => {
                    try {
                      await state.prompt();
                      setOpen(false);
                    } catch {
                      /* user dismissed or errored — fine */
                    }
                  }}
                >
                  <Download size={16} />
                  {t.installCta}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-block"
                  onClick={() => {
                    dismiss();
                    setOpen(false);
                  }}
                >
                  {t.installLater}
                </button>
              </div>
            ) : (
              <IosSteps
                step1={t.installIosStep1}
                step2={t.installIosStep2}
                step3={t.installIosStep3}
                note={t.installIosNote}
                laterLabel={t.installLater}
                onLater={() => {
                  dismiss();
                  setOpen(false);
                }}
              />
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

function IosSteps({
  step1,
  step2,
  step3,
  note,
  laterLabel,
  onLater,
}: {
  step1: string;
  step2: string;
  step3: string;
  note: string;
  laterLabel: string;
  onLater: () => void;
}) {
  return (
    <div>
      <ol className="space-y-3 mb-4">
        <Step n={1} icon={<Share size={16} />} text={step1} />
        <Step n={2} icon={<Plus size={16} />} text={step2} />
        <Step n={3} icon={<Plus size={16} />} text={step3} />
      </ol>
      <p className="text-xs text-ink-muted leading-relaxed mb-4 italic">{note}</p>
      <button type="button" className="btn btn-ghost btn-block" onClick={onLater}>
        {laterLabel}
      </button>
    </div>
  );
}

function Step({ n, icon, text }: { n: number; icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="w-7 h-7 grid place-items-center rounded-pill bg-chili text-bone-50 shrink-0 text-[12px] font-semibold">
        {n}
      </span>
      <span className="flex-1 text-sm text-ink-soft leading-relaxed flex items-start gap-2 pt-0.5">
        <span className="text-chili shrink-0 mt-0.5">{icon}</span>
        <span>{text}</span>
      </span>
    </li>
  );
}
