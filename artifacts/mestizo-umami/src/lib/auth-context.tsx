/**
 * AuthContext — single shared auth state for the whole app.
 * Wrap App with <AuthProvider>; consume with useAuthContext().
 */
import { createContext, useContext, type ReactNode } from "react";
import { useAuth, type AuthState, type AuthUser, type Entitlement } from "./use-auth.js";

interface AuthCtx extends AuthState {
  login: (returnTo?: string) => void;
  logout: () => Promise<void>;
  authFetch: (url: string, init?: RequestInit) => Promise<Response>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  loading: true,
  authenticated: false,
  user: null,
  entitlement: null,
  csrfToken: null,
  login: () => {},
  logout: async () => {},
  authFetch: (url, init) => fetch(url, init),
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthCtx {
  return useContext(AuthContext);
}

// Re-export types for convenience
export type { AuthUser, Entitlement };
