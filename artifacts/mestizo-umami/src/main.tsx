import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);

if ('serviceWorker' in navigator) {
  // __BUILD_TS__ is injected by Vite at build time (see vite.config.ts → define).
  // Each deploy gets a unique value, busting stale SW caches automatically.
  // The global declaration lives in src/vite-env.d.ts.
  const swVersion = (window as unknown as Record<string, unknown>).__BUILD_TS__ as string ?? 'dev';
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`/sw.js?v=${swVersion}`).catch(() => {});
  });
}
