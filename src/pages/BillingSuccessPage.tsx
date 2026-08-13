import { useEffect, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, TriangleAlert } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { InstallButton } from "@/components/InstallButton";

export function BillingSuccessPage() {
  const { status, error: authError, login, completeCheckout, refreshSession } = useAuth();
  const [, navigate] = useLocation();
  const [state, setState] = useState<"working" | "success" | "error">("working");
  const [message, setMessage] = useState("");
  const started = useRef(false);
  const sessionId = new URLSearchParams(window.location.search).get("session_id");

  useEffect(() => {
    if (sessionId) window.history.replaceState(window.history.state, "", "/billing/success");
  }, [sessionId]);

  useEffect(() => {
    if (status !== "authenticated" || started.current) return;
    started.current = true;
    if (!sessionId) {
      setState("error");
      setMessage("The checkout confirmation is missing.");
      return;
    }
    void completeCheckout(sessionId)
      .then(() => setState("success"))
      .catch((reason) => {
        setState("error");
        setMessage(reason instanceof Error ? reason.message : "Checkout could not be confirmed.");
      });
  }, [completeCheckout, sessionId, status]);

  return (
    <main className="gate-page">
      <section className="gate-card grain">
        {status === "error" ? (
          <>
            <div className="gate-icon"><TriangleAlert size={24} /></div>
            <h1 className="display-lg mt-5">Account verification is unavailable.</h1>
            <p role="alert" className="gate-copy">{authError}</p>
            <button type="button" onClick={() => void refreshSession()} className="btn-primary mt-6 w-full justify-center">Try again</button>
          </>
        ) : status === "loading" ? (
          <>
            <div className="gate-icon"><LoaderCircle size={24} className="animate-spin" /></div>
            <h1 className="display-lg mt-5">Confirming your subscription…</h1>
            <p className="gate-copy">This usually takes only a moment.</p>
          </>
        ) : status === "anonymous" ? (
          <>
            <div className="gate-icon"><TriangleAlert size={24} /></div>
            <h1 className="display-lg mt-5">Sign in to confirm checkout.</h1>
            <button type="button" onClick={login} className="btn-primary mt-6 w-full justify-center">Continue securely</button>
          </>
        ) : state === "working" ? (
          <>
            <div className="gate-icon"><LoaderCircle size={24} className="animate-spin" /></div>
            <h1 className="display-lg mt-5">Confirming your subscription…</h1>
            <p className="gate-copy">This usually takes only a moment.</p>
          </>
        ) : state === "success" ? (
          <>
            <div className="gate-icon"><CheckCircle2 size={24} /></div>
            <p className="eyebrow mt-5">Subscription active</p>
            <h1 className="display-xl mt-2 text-[var(--color-chili)]">Welcome back to the kitchen.</h1>
            <button type="button" onClick={() => navigate("/")} className="btn-primary mt-7 w-full justify-center">Open Mestizo Umami</button>
            <InstallButton className="mt-3 w-full justify-center" />
          </>
        ) : (
          <>
            <div className="gate-icon"><TriangleAlert size={24} /></div>
            <h1 className="display-lg mt-5">Checkout needs attention.</h1>
            <p role="alert" className="gate-copy">{message}</p>
            <button type="button" onClick={() => navigate("/")} className="btn-ghost mt-6 w-full justify-center">Return to account</button>
          </>
        )}
      </section>
    </main>
  );
}
