/**
 * PushNotificationsContext — single owner of the push subscription lifecycle.
 * Wrap the app with <PushNotificationsProvider> so Planner, NotificationPrompt,
 * and any other consumer all share the same subscription ref and state.
 */
import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import type { MealPlan } from "./storage";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ── helpers ───────────────────────────────────────────────────────────────────

function urlBase64ToUint8Array(b64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (b64.length % 4)) % 4);
  const base64  = (b64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw     = atob(base64);
  const arr     = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

async function fetchVapidKey(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/api/push/vapid-public-key`);
    if (!res.ok) return null;
    const { publicKey } = await res.json() as { publicKey: string };
    return publicKey ?? null;
  } catch {
    return null;
  }
}

// ── types ─────────────────────────────────────────────────────────────────────

export type PushState = "unsupported" | "denied" | "unsubscribed" | "subscribed";

interface PushCtx {
  state: PushState;
  isSupported: boolean;
  isSubscribed: boolean;
  subscribe: (mealPlan: MealPlan) => Promise<boolean>;
  syncPlan:  (mealPlan: MealPlan) => Promise<void>;
  unsubscribe: () => Promise<void>;
}

// ── context ───────────────────────────────────────────────────────────────────

const PushNotificationsContext = createContext<PushCtx>({
  state: "unsubscribed",
  isSupported: false,
  isSubscribed: false,
  subscribe: async () => false,
  syncPlan: async () => {},
  unsubscribe: async () => {},
});

export function usePushNotifications() {
  return useContext(PushNotificationsContext);
}

// ── provider ──────────────────────────────────────────────────────────────────

export function PushNotificationsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PushState>("unsubscribed");
  const subRef = useRef<globalThis.PushSubscription | null>(null);

  // Detect support and existing subscription on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }
    navigator.serviceWorker.ready
      .then(reg => reg.pushManager.getSubscription())
      .then(sub => {
        subRef.current = sub;
        setState(sub ? "subscribed" : "unsubscribed");
      })
      .catch(() => {});
  }, []);

  const subscribe = useCallback(async (mealPlan: MealPlan): Promise<boolean> => {
    if (!("Notification" in window)) return false;

    const perm = await Notification.requestPermission();
    if (perm === "denied") { setState("denied"); return false; }
    if (perm !== "granted") return false;

    const vapidKey = await fetchVapidKey();
    if (!vapidKey) return false;

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      subRef.current = sub;

      await fetch(`${BASE}/api/push/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON(), mealPlan }),
      });

      setState("subscribed");
      return true;
    } catch (err) {
      console.error("[push] subscribe failed", err);
      return false;
    }
  }, []);

  const syncPlan = useCallback(async (mealPlan: MealPlan) => {
    const sub = subRef.current;
    if (!sub) return;
    try {
      await fetch(`${BASE}/api/push/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint, mealPlan }),
      });
    } catch (err) {
      console.warn("[push] sync failed", err);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    const sub = subRef.current;
    if (!sub) return;
    try {
      await sub.unsubscribe();
      await fetch(`${BASE}/api/push/unsubscribe`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });
    } catch (err) {
      console.warn("[push] unsubscribe failed", err);
    }
    subRef.current = null;
    setState("unsubscribed");
  }, []);

  const value: PushCtx = {
    state,
    isSupported: state !== "unsupported",
    isSubscribed: state === "subscribed",
    subscribe,
    syncPlan,
    unsubscribe,
  };

  return (
    <PushNotificationsContext.Provider value={value}>
      {children}
    </PushNotificationsContext.Provider>
  );
}
