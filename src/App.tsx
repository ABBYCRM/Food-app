import { useEffect, useState } from "react";
import { Route, Switch, useLocation } from "wouter";
import { UserProvider } from "@/context/UserContext";
import { TrialProvider, useTrial } from "@/context/TrialContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PaywallModal } from "@/components/PaywallModal";
import { HomePage } from "@/pages/HomePage";
import { PhilosophyPage } from "@/pages/PhilosophyPage";
import { PantryPage } from "@/pages/PantryPage";
import { RecipesPage } from "@/pages/RecipesPage";
import { RecipeDetailPage } from "@/pages/RecipeDetailPage";
import { PlannerPage } from "@/pages/PlannerPage";
import { NotebookPage } from "@/pages/NotebookPage";
import { AllergyMenuPage } from "@/pages/AllergyMenuPage";
import { SearchPage } from "@/pages/SearchPage";
import { VendorPage } from "@/pages/VendorPage";
import { ChefsPage } from "@/pages/ChefsPage";

/* Per-route ErrorBoundary that resets when the URL changes — so a render error
   on one recipe doesn't poison subsequent navigation. */
function RoutedErrorBoundary({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

/** Renders the paywall as a global overlay when the trial has expired. */
function GlobalPaywall() {
  const { status } = useTrial();
  if (status !== "expired") return null;
  return <PaywallModal />;
}

/** Registers the service worker (no-op in dev where SW is disabled). */
function ServiceWorkerBoot() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // Only register on http(s), not on file:// or the dev server.
    const proto = window.location.protocol;
    if (proto !== "http:" && proto !== "https:") return;
    if (import.meta.env?.DEV) return; // skip in dev to avoid HMR conflicts
    const onLoad = () => {
      const base = import.meta.env.BASE_URL;
      navigator.serviceWorker
        .register(`${base}sw.js`, { scope: base })
        .catch((err) => {
          console.warn("[Mestizo Umami] SW registration failed:", err);
        });
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return null;
}

export default function App() {
  // Defer the global paywall mount by one tick so the app's first paint
  // doesn't flash behind a modal.
  const [showPaywall, setShowPaywall] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShowPaywall(true), 50);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <ErrorBoundary>
      <UserProvider>
        <TrialProvider>
          <RoutedErrorBoundary>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/philosophy" component={PhilosophyPage} />
              <Route path="/pantry" component={PantryPage} />
              <Route path="/recipes" component={RecipesPage} />
              <Route path="/recipe/:slug">
                {(params) => <RecipeDetailPage slug={params.slug} />}
              </Route>
              <Route path="/planner" component={PlannerPage} />
              <Route path="/notebook" component={NotebookPage} />
              <Route path="/allergy" component={AllergyMenuPage} />
              <Route path="/vendor" component={VendorPage} />
              <Route path="/chefs" component={ChefsPage} />
              <Route path="/search" component={SearchPage} />
              <Route>
                <HomePage />
              </Route>
            </Switch>
          </RoutedErrorBoundary>
          <GlobalPaywallGate show={showPaywall} />
          <ServiceWorkerBoot />
        </TrialProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}

function GlobalPaywallGate({ show }: { show: boolean }) {
  if (!show) return null;
  return <GlobalPaywall />;
}
