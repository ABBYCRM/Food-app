import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import { AnimatePresence } from 'framer-motion';

import { LocaleProvider } from './lib/locale';
import { PushNotificationsProvider } from './lib/push-context';
import { AuthProvider } from './lib/auth-context';
import { Layout } from './components/layout';
import { Home } from './pages/home';
import { RecipesGallery } from './pages/recipes';
import { RecipeDetail } from './pages/recipe-detail';
import { Planner } from './pages/planner';
import { Notebook } from './pages/notebook';
import { SearchPage } from './pages/search';
import { StoresPage } from './pages/stores';

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  
  return (
    <Layout>
      <RoutedErrorBoundary>
        <AnimatePresence mode="wait">
          <Switch location={location} key={location}>
            {/* "" handles the case where Wouter strips the base from the exact base path (no trailing slash) */}
            <Route path="" component={Home} />
            <Route path="/" component={Home} />
            <Route path="/recipes" component={RecipesGallery} />
            <Route path="/recipe/:slug" component={RecipeDetail} />
            <Route path="/planner" component={Planner} />
            <Route path="/notebook" component={Notebook} />
            <Route path="/search" component={SearchPage} />
            <Route path="/stores" component={StoresPage} />
            <Route component={NotFound} />
          </Switch>
        </AnimatePresence>
      </RoutedErrorBoundary>
    </Layout>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LocaleProvider>
          <AuthProvider>
            <PushNotificationsProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
                <Router />
              </WouterRouter>
              <Toaster />
            </PushNotificationsProvider>
          </AuthProvider>
        </LocaleProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
