import { useEffect, useRef, useState } from "react";
import { CircleUserRound, CreditCard, LogOut, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { InstallButton } from "./InstallButton";

export function AccountControls({ light = false }: { light?: boolean }) {
  const { session, logout, openBillingPortal } = useAuth();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);

  if (!session) return null;
  const trial = session.entitlement.state === "trial";
  const label = trial
    ? `${session.entitlement.daysRemaining}d trial`
    : session.entitlement.state === "paid" ? "Member" : "Account";

  async function run(action: () => Promise<void>) {
    setError(null);
    try { await action(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Account action failed"); }
  }

  return (
    <div className="relative" ref={root}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Open account controls"
        className={`flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors ${light ? "hover:bg-white/10 text-white" : "hover:bg-black/5"}`}
      >
        <CircleUserRound size={18} />
        <span className="text-[10px] uppercase tracking-[0.12em] hidden sm:inline">{label}</span>
      </button>
      {open ? (
        <section className="absolute top-[calc(100%+0.6rem)] right-0 z-50 w-[min(20rem,calc(100vw-2rem))] rounded-[1.1rem] bg-[var(--color-bone-50)] text-[var(--color-ink)] border border-black/10 shadow-2xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="eyebrow">Your kitchen</p>
              <p className="font-display text-lg truncate mt-1">{session.user.displayName || "Mestizo cook"}</p>
              {session.user.email ? <p className="text-xs text-[var(--color-ink-muted)] truncate mt-0.5">{session.user.email}</p> : null}
            </div>
            <button type="button" onClick={() => setOpen(false)} className="p-1.5 rounded-full hover:bg-black/5" aria-label="Close account controls"><X size={16} /></button>
          </div>
          <div className="mt-4 rounded-xl bg-[var(--color-chili)]/8 px-3.5 py-3">
            <p className="text-xs font-semibold">{trial ? `${session.entitlement.daysRemaining} trial day${session.entitlement.daysRemaining === 1 ? "" : "s"} remaining` : "Subscription active"}</p>
            <p className="text-[11px] text-[var(--color-ink-muted)] mt-1">{session.billing.priceDisplay} after the free trial.</p>
          </div>
          {error ? <p role="alert" className="mt-3 text-xs text-[var(--color-chili)]">{error}</p> : null}
          <div className="mt-3 grid gap-2">
            <InstallButton className="w-full justify-center !py-2.5 text-sm" />
            {session.billing.canManage ? (
              <button type="button" onClick={() => void run(openBillingPortal)} className="btn-ghost w-full justify-center !py-2.5 text-sm"><CreditCard size={14} /> Manage billing</button>
            ) : null}
            <button type="button" onClick={() => void run(logout)} className="btn-ghost w-full justify-center !py-2.5 text-sm"><LogOut size={14} /> Sign out</button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

