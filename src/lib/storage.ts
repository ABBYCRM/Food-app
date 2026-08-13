import type { Locale } from "@/i18n";

const namespace = "mestizoumami:v1";
const localeKey = `${namespace}:locale`;
const legacyUserKeys = ["zip", "favorites", "notes", "userRecipes", "planner", "avoiding", "dietary"];

/** Locale is a presentation preference, not an identity or authorization input. */
export function loadLocale(fallback: Locale): Locale {
  if (typeof window === "undefined") return fallback;
  try {
    const value = JSON.parse(window.localStorage.getItem(localeKey) ?? "null") as unknown;
    return value === "en" || value === "es" || value === "pt" ? value : fallback;
  } catch {
    return fallback;
  }
}

export function saveLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(localeKey, JSON.stringify(locale)); }
  catch { /* The server-owned workspace remains authoritative. */ }
}

/** Removes data written by pre-auth releases so another account on the same
 * browser cannot inherit it. Current tenant data is never written to localStorage. */
export function clearLegacyUserStorage(): void {
  if (typeof window === "undefined") return;
  try {
    for (const key of legacyUserKeys) window.localStorage.removeItem(`${namespace}:${key}`);
  } catch { /* Storage may be disabled. */ }
}
