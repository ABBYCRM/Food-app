/**
 * useAuth — fetches the current session from the API and exposes auth state
 * + helpers to the rest of the app.
 *
 * State is request-scoped (never stored in localStorage or global module
 * variables) so tenant identity stays server-authoritative.
 */
import { useState, useEffect, useCallback, useRef } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string | null;
}

export interface Entitlement {
  allowed: boolean;
  state: "unavailable" | "trial" | "paid" | "paywall";
  trialEndsAt: string | null;
  daysRemaining: number;
  currentPeriodEnd: string | null;
}

export interface AuthState {
  loading: boolean;
  authenticated: boolean;
  user: AuthUser | null;
  entitlement: Entitlement | null;
  csrfToken: string | null;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    loading: true,
    authenticated: false,
    user: null,
    entitlement: null,
    csrfToken: null,
  });

  const csrfRef = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res  = await fetch(`${BASE}/api/auth/session`, { credentials: "include" });
      const data = await res.json() as {
        authenticated: boolean;
        user: AuthUser | null;
        entitlement: Entitlement | null;
        csrfToken: string | null;
      };
      csrfRef.current = data.csrfToken;
      setState({
        loading: false,
        authenticated: data.authenticated,
        user: data.user,
        entitlement: data.entitlement,
        csrfToken: data.csrfToken,
      });
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  /** Navigate to the OIDC login page, optionally returning to a path. */
  const login = useCallback((returnTo?: string) => {
    const params = returnTo ? `?return_to=${encodeURIComponent(returnTo)}` : "";
    window.location.href = `${BASE}/api/auth/login${params}`;
  }, []);

  /** Call server logout, clear the session cookie, then reload to reset app state. */
  const logout = useCallback(async () => {
    try {
      const csrf = csrfRef.current;
      const res  = await fetch(`${BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: csrf ? { "x-csrf-token": csrf } : {},
      });
      const data = await res.json() as { endSessionUrl?: string | null };
      // Redirect to provider's end-session URL if available, otherwise home
      window.location.href = data.endSessionUrl ?? "/";
    } catch {
      window.location.href = "/";
    }
  }, []);

  /** Convenience for authenticated fetch — attaches credentials + CSRF header. */
  const authFetch = useCallback(
    (url: string, init?: RequestInit): Promise<Response> => {
      const csrf    = csrfRef.current;
      const headers = new Headers(init?.headers);
      if (csrf) headers.set("x-csrf-token", csrf);
      return fetch(url, { ...init, credentials: "include", headers });
    },
    [],
  );

  return { ...state, login, logout, authFetch, refresh };
}
