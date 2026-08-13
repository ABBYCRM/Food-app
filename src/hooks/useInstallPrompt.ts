import { useEffect, useState, useCallback } from "react";

/**
 * Hook for the PWA "Add to Home Screen" / "Install" flow.
 *
 * - Captures the `beforeinstallprompt` event so we can show our own
 *   in-app install button instead of relying on the browser's mini-bar.
 * - Detects iOS Safari (which does NOT fire `beforeinstallprompt`) and
 *   surfaces an "iOS how-to-install" flow instead.
 * - Detects already-installed (standalone display mode) so we hide the
 *   button when the app is already installed.
 */
export type InstallState =
  | { kind: "unsupported" }
  | { kind: "installed" }
  | { kind: "ios-instructions" }
  | { kind: "android-prompt"; prompt: () => Promise<void> };

const DISMISS_KEY = "mestizoumami:v1:install-dismissed";

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // iOS Safari sets this; Chrome / Edge use display-mode media query.
  const navAny = window.navigator as unknown as { standalone?: boolean };
  if (navAny.standalone === true) return true;
  if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
  if (window.matchMedia?.("(display-mode: fullscreen)").matches) return true;
  return false;
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  // iPad on iOS 13+ reports as Mac — check for touch points.
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  if (/Mac/.test(ua) && navigator.maxTouchPoints > 1) return true;
  return false;
}

function wasDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function useInstallPrompt() {
  const [state, setState] = useState<InstallState>(() => {
    if (typeof window === "undefined") return { kind: "unsupported" };
    if (isStandalone()) return { kind: "installed" };
    if (wasDismissed()) return { kind: "unsupported" };
    if (isIos()) return { kind: "ios-instructions" };
    return { kind: "unsupported" };
  });

  useEffect(() => {
    if (isStandalone()) {
      setState({ kind: "installed" });
      return;
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      const evt = e as BeforeInstallPromptEvent;
      setState({
        kind: "android-prompt",
        prompt: async () => {
          await evt.prompt();
          await evt.userChoice;
        },
      });
    };
    const onInstalled = () => setState({ kind: "installed" });
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = useCallback(() => {
    try { window.localStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
    setState({ kind: "unsupported" });
  }, []);

  const reset = useCallback(() => {
    try { window.localStorage.removeItem(DISMISS_KEY); } catch { /* ignore */ }
    if (isStandalone()) {
      setState({ kind: "installed" });
    } else if (isIos()) {
      setState({ kind: "ios-instructions" });
    } else {
      setState({ kind: "unsupported" });
    }
  }, []);

  return { state, dismiss, reset };
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}
