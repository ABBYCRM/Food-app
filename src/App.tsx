import { Route, Switch, useLocation } from "wouter";
import { UserProvider } from "@/context/UserContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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

export default function App() {
  return (
    <ErrorBoundary>
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
      </UserProvider>
    </ErrorBoundary>
  );
}
