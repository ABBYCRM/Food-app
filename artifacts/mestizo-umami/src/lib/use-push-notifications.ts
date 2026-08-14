/**
 * usePushNotifications — hook that manages the full Web Push lifecycle:
 *   subscribe / unsubscribe / sync meal plan to server
 *
 * The VAPID public key is fetched from /api/push/vapid-public-key so it
 * never needs to be hard-coded in the frontend bundle.
 */
import { useEffect, useState, useCallback, useRef } from "react";
import type { MealPlan } from "./storage";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ── Helpers ───────────────────────────────────────────────────────────────────

function urlBase64ToUint8Array(b64: string): Uint8Array {
  const padding = "=".repeat((4 - (b64.length % 4)) % 4);
  const base64  = (b64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw     = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
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

// ── Hook ──────────────────────────────────────────────────────────────────────

export type PushState = "unsupported" | "denied" | "unsubscribed" | "subscribed";

export function usePushNotifications() {
  const [state, setState] = useState<PushState>("unsubscribed");
  const subRef = useRef<globalThis.PushSubscription | null>(null);

  // On mount — detect support and existing subscription
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
    navigator.serviceWorker.ready.then(reg =>
      reg.pushManager.getSubscription().then(sub => {
        subRef.current = sub;
        setState(sub ? "subscribed" : "unsubscribed");
      }),
    ).catch(() => {});
  }, []);

  /** Request permission + subscribe, then POST to /api/push/subscribe. */
  const subscribe = useCallback(async (mealPlan: MealPlan): Promise<boolean> => {
    if (!("Notification" in window)) return false;

    const perm = await Notification.requestPermission();
    if (perm === "denied") { setState("denied"); return false; }
    if (perm !== "granted") return false;

    const vapidKey = await fetchVapidKey();
    if (!vapidKey) return false; // server not configured

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

  /** Push an updated meal plan snapshot to the server. */
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

  /** Unsubscribe from the browser and remove from server. */
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

  return {
    state,
    isSupported:  state !== "unsupported",
    isSubscribed: state === "subscribed",
    subscribe,
    syncPlan,
    unsubscribe,
  };
}
