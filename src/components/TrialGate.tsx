import { Lock } from "lucide-react";
import { useTrialGuard } from "@/context/TrialContext";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";

/**
 * Wraps a write-action control (button, link). If the trial has expired
 * and the user is not unlocked, the wrapper disables the control and
 * surfaces a small "Subscribe to save" hint.
 *
 * Two modes:
 * - inline (default): keeps the original button visible, just disables
 *   it and swaps the label to a "locked" affordance.
 * - stub: replaces the control entirely with a "Subscribe" button that
 *   opens the PaywallModal. Used when the wrapped element would be
 *   broken in a half-state.
 */
export function TrialGate({
  children,
  stub = false,
  onLockedClick,
}: {
  children: React.ReactElement<{ onClick?: (e: React.MouseEvent) => void; "aria-disabled"?: boolean; disabled?: boolean; title?: string }>;
  stub?: boolean;
  onLockedClick?: () => void;
}) {
  const { canWrite, reason } = useTrialGuard();
  const { locale } = useUser();
  const t = dict[locale].trial;

  if (canWrite) return children;

  if (stub) {
    return (
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={onLockedClick}
        title={reason ?? t.paywallLocked}
        aria-label={t.paywallLocked}
      >
        <Lock size={13} />
        {t.paywallLocked}
      </button>
    );
  }

  // Inline: clone the child and pass disabled + locked title.
  const lockedTitle = reason ?? t.paywallLocked;
  return (
    <span
      onClick={(e) => {
        if (!canWrite) {
          e.preventDefault();
          e.stopPropagation();
          onLockedClick?.();
        }
      }}
      className="inline-block"
    >
      {(() => {
        const child = children as React.ReactElement<{
          onClick?: (e: React.MouseEvent) => void;
          "aria-disabled"?: boolean;
          disabled?: boolean;
          title?: string;
          className?: string;
        }>;
        const childOnClick = child.props.onClick;
        return (
          <child.type
            {...(child.props as Record<string, unknown>)}
            onClick={(e: React.MouseEvent) => {
              if (!canWrite) {
                e.preventDefault();
                e.stopPropagation();
                onLockedClick?.();
                return;
              }
              childOnClick?.(e);
            }}
            aria-disabled={!canWrite}
            disabled={!canWrite || child.props.disabled}
            title={child.props.title ?? lockedTitle}
          />
        );
      })()}
    </span>
  );
}
