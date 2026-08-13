import { useState, type ReactNode } from "react";
import { ArrowRight, Check, LockKeyhole, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { InstallButton } from "./InstallButton";

export function AccessGate({ children }: { children: ReactNode }) {
  const { status, session, error, publicConfig, login, refreshSession, startCheckout, openBillingPortal } = useAuth();
  const [actionError, setActionError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  if (status === "loading") return <GateLoading />;

  if (status === "error") {
    return (
      <GateShell>
        <div className="gate-icon"><RefreshCw size={24} /></div>
        <p className="eyebrow mt-5">Secure connection</p>
        <h1 className="display-lg mt-2">The kitchen could not open.</h1>
        <p className="gate-copy">{error ?? "The account service is temporarily unavailable."}</p>
        <button type="button" onClick={() => void refreshSession()} className="btn-primary mt-6 mx-auto">
          Try again <RefreshCw size={16} />
        </button>
        <InstallButton className="mt-3 mx-auto" />
      </GateShell>
    );
  }

  if (status === "anonymous" || !session) {
    return (
      <GateShell>
        <div className="gate-icon"><Sparkles size={24} /></div>
        <p className="eyebrow mt-5">Mestizo Umami</p>
        <h1 className="display-xl mt-2 text-[var(--color-chili)]">Your trilingual kitchen, wherever you cook.</h1>
        <p className="gate-copy">
          Start with seven full days free. Save recipes, plan the week, and move ingredients to supported retailers. No card is collected during the trial.
        </p>
        <div className="mt-5 grid gap-2 text-left text-sm">
          {[
            "365 Mexican-Asian recipes in English, Español, and Português",
            "A private notebook and planner tied only to your account",
            `${publicConfig?.trialDays ?? 7} days free, then ${publicConfig?.priceDisplay ?? "the displayed subscription price"}`,
          ].map((line) => (
            <div key={line} className="flex items-start gap-2.5"><Check size={16} className="text-[var(--color-jade)] mt-0.5 shrink-0" />{line}</div>
          ))}
        </div>
        <button type="button" onClick={login} className="btn-primary mt-7 w-full">
          Start my free seven days <ArrowRight size={17} />
        </button>
        <InstallButton className="mt-3 w-full justify-center" />
        <p className="mt-5 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
          Sign-in uses OpenID Connect with PKCE. Your provider tokens stay encrypted on the server; this device receives only an opaque, HttpOnly session cookie.
        </p>
      </GateShell>
    );
  }

  if (!session.entitlement.allowed) {
    const resolveBilling = session.billing.paywallAction === "portal";
    async function run(action: () => Promise<void>) {
      setWorking(true);
      setActionError(null);
      try { await action(); }
      catch (reason) { setActionError(reason instanceof Error ? reason.message : "Billing could not be opened"); }
      finally { setWorking(false); }
    }
    return (
      <GateShell>
        <div className="gate-icon"><LockKeyhole size={24} /></div>
        <p className="eyebrow mt-5">Seven-day trial complete</p>
        <h1 className="display-xl mt-2 text-[var(--color-chili)]">Keep your kitchen open.</h1>
        <p className="gate-copy">
          Your recipes, notes, filters, and weekly plan are still safely stored. Subscribe to restore the full app immediately.
        </p>
        <div className="card-surface mt-6 px-5 py-4 text-left">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl">Mestizo Umami</p>
              <p className="text-xs text-[var(--color-ink-muted)] mt-1">Cancel any time in the billing portal.</p>
            </div>
            <p className="font-semibold text-[var(--color-chili)] whitespace-nowrap">{session.billing.priceDisplay}</p>
          </div>
        </div>
        {actionError ? <p role="alert" className="mt-4 text-sm text-[var(--color-chili)]">{actionError}</p> : null}
        <button type="button" disabled={working} onClick={() => void run(resolveBilling ? openBillingPortal : startCheckout)} className="btn-primary mt-5 w-full disabled:opacity-60">
          {working ? "Opening secure billing…" : resolveBilling ? "Resolve billing and continue" : "Subscribe and continue"} <ShieldCheck size={17} />
        </button>
        {session.billing.canManage && !resolveBilling ? (
          <button type="button" disabled={working} onClick={() => void run(openBillingPortal)} className="btn-ghost mt-3 w-full justify-center disabled:opacity-60">
            Manage existing billing
          </button>
        ) : null}
        <InstallButton className="mt-3 w-full justify-center" />
      </GateShell>
    );
  }

  return children;
}

function GateLoading() {
  return (
    <GateShell>
      <div className="gate-icon gate-pulse"><Sparkles size={24} /></div>
      <p className="eyebrow mt-5">Mestizo Umami</p>
      <p className="mt-3 text-sm text-[var(--color-ink-muted)]">Opening your kitchen…</p>
    </GateShell>
  );
}

function GateShell({ children }: { children: ReactNode }) {
  return (
    <main className="gate-page">
      <section className="gate-card grain">{children}</section>
    </main>
  );
}
