import { Route, Switch, useLocation } from "wouter";
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AccessGate } from "@/components/AccessGate";
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
import { BillingSuccessPage } from "@/pages/BillingSuccessPage";
import { SharedRecipePage } from "@/pages/SharedRecipePage";
import { BillingCancelledPage } from "@/pages/BillingCancelledPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

/* Per-route ErrorBoundary that resets when the URL changes — so a render error
   on one recipe doesn't poison subsequent navigation. */
function RoutedErrorBoundary({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Switch>
          <Route path="/billing/success" component={BillingSuccessPage} />
          <Route path="/billing/cancelled" component={BillingCancelledPage} />
          <Route>
            <AccessGate>
              <UserProvider>
                <RoutedErrorBoundary>
                  <Switch>
                    <Route path="/" component={HomePage} />
                    <Route path="/philosophy" component={PhilosophyPage} />
                    <Route path="/pantry" component={PantryPage} />
                    <Route path="/recipes" component={RecipesPage} />
                    <Route path="/recipe/:slug">
                      {(params) => <RecipeDetailPage slug={params.slug} />}
                    </Route>
                    <Route path="/recipe-shared" component={SharedRecipePage} />
                    <Route path="/planner" component={PlannerPage} />
                    <Route path="/notebook" component={NotebookPage} />
                    <Route path="/allergy" component={AllergyMenuPage} />
                    <Route path="/vendor" component={VendorPage} />
                    <Route path="/chefs" component={ChefsPage} />
                    <Route path="/search" component={SearchPage} />
                    <Route><NotFoundPage /></Route>
                  </Switch>
                </RoutedErrorBoundary>
              </UserProvider>
            </AccessGate>
          </Route>
        </Switch>
      </AuthProvider>
    </ErrorBoundary>
  );
}
