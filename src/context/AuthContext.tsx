import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Entitlement = {
  allowed: boolean;
  state: "trial" | "paid" | "paywall" | "unavailable";
  trialEndsAt: string | null;
  daysRemaining: number;
  currentPeriodEnd: string | null;
};

type Session = {
  authenticated: true;
  user: { displayName: string | null; email: string | null };
  entitlement: Entitlement;
  billing: { priceDisplay: string; canManage: boolean; paywallAction: "checkout" | "portal" };
  csrfToken: string;
};

type AuthStatus = "loading" | "anonymous" | "authenticated" | "error";

type AuthContextValue = {
  status: AuthStatus;
  session: Session | null;
  error: string | null;
  publicConfig: { trialDays: number; priceDisplay: string } | null;
  login: () => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<Session | null>;
  apiFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  startCheckout: () => Promise<void>;
  openBillingPortal: () => Promise<void>;
  completeCheckout: (sessionId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const RETURN_FRAGMENT_KEY = "mestizoumami:oidc:return-fragment";

function restoreReturnFragment(): void {
  try {
    const fragment = window.sessionStorage.getItem(RETURN_FRAGMENT_KEY);
    window.sessionStorage.removeItem(RETURN_FRAGMENT_KEY);
    if (!fragment || window.location.hash || !fragment.startsWith("#") || fragment.length > 300_001) return;
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}${fragment}`);
  } catch {
    // Login remains functional when browser storage is disabled.
  }
}

async function responseMessage(response: Response) {
  const data = await response.json().catch(() => null) as { error?: unknown } | null;
  return typeof data?.error === "string" ? data.error : `Request failed (${response.status})`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [publicConfig, setPublicConfig] = useState<{ trialDays: number; priceDisplay: string } | null>(null);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        credentials: "same-origin",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (response.status === 401) {
        const publicResponse = await fetch("/api/public/config", { cache: "no-store" });
        if (publicResponse.ok) setPublicConfig(await publicResponse.json());
        setSession(null);
        setStatus("anonymous");
        setError(null);
        return null;
      }
      if (!response.ok) throw new Error(await responseMessage(response));
      const next = await response.json() as Session;
      restoreReturnFragment();
      setSession(next);
      setStatus("authenticated");
      setError(null);
      return next;
    } catch (reason) {
      setSession(null);
      setStatus("error");
      setError(reason instanceof Error ? reason.message : "Authentication service is unavailable");
      return null;
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    const endsAt = session?.entitlement.state === "trial"
      ? Date.parse(session.entitlement.trialEndsAt ?? "")
      : Number.NaN;
    if (!Number.isFinite(endsAt)) return;

    let timer = 0;
    const scheduleDeadlineCheck = () => {
      const remaining = endsAt - Date.now();
      timer = window.setTimeout(() => {
        if (Date.now() >= endsAt) void refreshSession();
        else scheduleDeadlineCheck();
      }, remaining > 0 ? Math.min(remaining + 1_000, 2_147_000_000) : 30_000);
    };
    scheduleDeadlineCheck();
    const recheckVisibleTrial = () => {
      if (document.visibilityState === "visible" && Date.now() >= endsAt) {
        void refreshSession();
      }
    };
    document.addEventListener("visibilitychange", recheckVisibleTrial);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", recheckVisibleTrial);
    };
  }, [refreshSession, session?.entitlement.state, session?.entitlement.trialEndsAt]);

  const apiFetch = useCallback(async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const method = (init.method ?? "GET").toUpperCase();
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
      if (!session?.csrfToken) throw new Error("A secure session is required for this action");
      headers.set("X-CSRF-Token", session.csrfToken);
    }
    const response = await fetch(input, {
      ...init,
      method,
      headers,
      credentials: "same-origin",
      cache: "no-store",
    });
    if (response.status === 401) {
      setSession(null);
      setStatus("anonymous");
    } else if (response.status === 403) {
      const clone = response.clone();
      const body = await clone.json().catch(() => null) as { code?: unknown } | null;
      if (body?.code === "PAYWALL_REQUIRED") void refreshSession();
    }
    return response;
  }, [refreshSession, session?.csrfToken]);

  const login = useCallback(() => {
    const returnTo = `${window.location.pathname}${window.location.search}`;
    try {
      if (window.location.hash) window.sessionStorage.setItem(RETURN_FRAGMENT_KEY, window.location.hash);
      else window.sessionStorage.removeItem(RETURN_FRAGMENT_KEY);
    } catch {
      // The route still survives login; only a fragment may require re-sharing.
    }
    window.location.assign(`/api/auth/login?return_to=${encodeURIComponent(returnTo)}`);
  }, []);

  const logout = useCallback(async () => {
    if (!session?.csrfToken) {
      setSession(null);
      setStatus("anonymous");
      return;
    }
    const response = await apiFetch("/api/auth/logout", { method: "POST" });
    const data = await response.json().catch(() => null) as { redirectUrl?: unknown; error?: unknown } | null;
    setSession(null);
    setStatus("anonymous");
    if (!response.ok) throw new Error(typeof data?.error === "string" ? data.error : "Logout failed");
    window.location.assign(typeof data?.redirectUrl === "string" ? data.redirectUrl : "/");
  }, [apiFetch, session?.csrfToken]);

  const redirectFromAction = useCallback(async (endpoint: string) => {
    const response = await apiFetch(endpoint, { method: "POST" });
    if (!response.ok) throw new Error(await responseMessage(response));
    const data = await response.json() as { url?: unknown };
    if (typeof data.url !== "string" || !data.url.startsWith("https://")) {
      throw new Error("Billing service returned an invalid destination");
    }
    window.location.assign(data.url);
  }, [apiFetch]);

  const startCheckout = useCallback(() => redirectFromAction("/api/billing/checkout"), [redirectFromAction]);
  const openBillingPortal = useCallback(() => redirectFromAction("/api/billing/portal"), [redirectFromAction]);

  const completeCheckout = useCallback(async (checkoutSessionId: string) => {
    const response = await apiFetch("/api/billing/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: checkoutSessionId }),
    });
    if (!response.ok) throw new Error(await responseMessage(response));
    const result = await response.json() as { entitlement?: Entitlement };
    const refreshed = await refreshSession();
    if (!result.entitlement?.allowed || !refreshed?.entitlement.allowed) {
      throw new Error("Payment is not active yet. Return to your account to resolve or retry billing.");
    }
  }, [apiFetch, refreshSession]);

  const value = useMemo<AuthContextValue>(() => ({
    status,
    session,
    error,
    publicConfig,
    login,
    logout,
    refreshSession,
    apiFetch,
    startCheckout,
    openBillingPortal,
    completeCheckout,
  }), [
    status, session, error, publicConfig, login, logout, refreshSession, apiFetch,
    startCheckout, openBillingPortal, completeCheckout,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
