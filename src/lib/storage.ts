const NS = "mestizoumami:v1";

export function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(`${NS}:${key}`);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    /* Recursive type-shape check against fallback, so a corrupted entry can never
       crash the app — it gets quarantined and the safe default takes over. */
    if (sameShape(parsed, fallback)) return parsed as T;
    quarantine(key, raw);
    return fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`${NS}:${key}`, JSON.stringify(value));
  } catch {
    /* quota exceeded or storage disabled — fail silently */
  }
}

export function remove(key: string): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(`${NS}:${key}`); } catch { /* ignore */ }
}

export function exportAll(): string {
  if (typeof window === "undefined") return "{}";
  const data: Record<string, unknown> = {};
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(`${NS}:`)) {
        const raw = window.localStorage.getItem(key);
        if (raw) {
          try { data[key.replace(`${NS}:`, "")] = JSON.parse(raw); }
          catch { /* skip corrupt entry */ }
        }
      }
    }
  } catch { /* ignore */ }
  return JSON.stringify(data, null, 2);
}

const ALLOWED_KEYS = new Set([
  "locale", "zip", "favorites", "notes", "userRecipes", "planner", "avoiding", "dietary",
]);

export function importAll(json: string): boolean {
  try {
    const data = JSON.parse(json) as unknown;
    if (!data || typeof data !== "object" || Array.isArray(data)) return false;
    let imported = 0;
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (!ALLOWED_KEYS.has(key)) continue; /* never accept unknown keys */
      save(key, value);
      imported++;
    }
    return imported > 0;
  } catch {
    return false;
  }
}

function quarantine(key: string, raw: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`${NS}:_corrupt:${key}:${Date.now()}`, raw);
    window.localStorage.removeItem(`${NS}:${key}`);
    if (typeof console !== "undefined") {
      console.warn(`[Mestizo Umami] quarantined corrupt storage key "${key}"`);
    }
  } catch { /* ignore */ }
}

/** Recursive deep type-shape comparison against a fallback. Fast path on primitives. */
function sameShape(value: unknown, fallback: unknown): boolean {
  if (fallback === null || fallback === undefined) return true; /* permissive */
  const ft = Array.isArray(fallback) ? "array" : typeof fallback;
  const vt = Array.isArray(value) ? "array" : typeof value;
  if (ft !== vt) return false;
  if (ft === "array") {
    if (!Array.isArray(value)) return false;
    const sample = (fallback as unknown[])[0];
    if (sample === undefined) return true; /* empty fallback array — accept anything */
    return value.every((v) => sameShape(v, sample));
  }
  if (ft === "object") {
    if (value === null || typeof value !== "object") return false;
    const fobj = fallback as Record<string, unknown>;
    const vobj = value as Record<string, unknown>;
    for (const k of Object.keys(fobj)) {
      if (!(k in vobj)) continue; /* missing keys are tolerated; defaults will fill in */
      if (!sameShape(vobj[k], fobj[k])) return false;
    }
    return true;
  }
  return true;
}
