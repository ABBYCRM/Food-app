import { en } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export type Locale = "en" | "es" | "pt";

export const locales: { code: Locale; label: string; flag: string; native: string }[] = [
  { code: "en", label: "English", flag: "EN", native: "English" },
  { code: "es", label: "Español", flag: "ES", native: "Español" },
  { code: "pt", label: "Português", flag: "PT", native: "Português" },
];

/** Widen `as const` literal types so other locales can satisfy the same shape. */
type Widen<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : T extends readonly (infer U)[]
  ? Widen<U>[]
  : T extends object
  ? { -readonly [K in keyof T]: Widen<T[K]> }
  : T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T;

export type Dict = Widen<typeof en>;

export const dict: Record<Locale, Dict> = { en, es, pt };

/** Safe locale lookup — falls back to English if the locale is somehow invalid. */
export function tFor(locale: Locale | string): Dict {
  if (locale === "es") return es;
  if (locale === "pt") return pt;
  return en;
}
