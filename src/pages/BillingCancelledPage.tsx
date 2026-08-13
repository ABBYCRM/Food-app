import { ArrowLeft, CreditCard } from "lucide-react";
import { useLocation } from "wouter";
import { InstallButton } from "@/components/InstallButton";

export function BillingCancelledPage() {
  const [, navigate] = useLocation();
  return (
    <main className="gate-page">
      <section className="gate-card grain">
        <div className="gate-icon"><CreditCard size={24} /></div>
        <p className="eyebrow mt-5">Checkout canceled</p>
        <h1 className="display-xl mt-2 text-[var(--color-chili)]">Nothing was charged.</h1>
        <p className="gate-copy">Your private recipes and plans are still stored. Return whenever you are ready to subscribe.</p>
        <button type="button" onClick={() => navigate("/")} className="btn-primary mt-7 w-full justify-center">
          <ArrowLeft size={16} /> Return to my account
        </button>
        <InstallButton className="mt-3 w-full justify-center" />
      </section>
    </main>
  );
}
