import { createContext, useContext, useState, type ReactNode } from "react";
import { translations, type TranslationKey } from "./translations";

export type Locale = "en" | "es" | "pt";
export type UnitSystem = "imperial" | "metric";

const UNIT_SYSTEM: Record<Locale, UnitSystem> = {
  en: "imperial",
  es: "metric",
  pt: "metric",
};

const LOCALE_LABEL: Record<Locale, string> = { en: "EN", es: "ES", pt: "PT" };

interface LocaleCtx {
  locale: Locale;
  unitSystem: UnitSystem;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  localeLabel: string;
}

const LocaleContext = createContext<LocaleCtx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem("mu-locale") as Locale | null;
      if (saved && ["en", "es", "pt"].includes(saved)) return saved;
    } catch {}
    // Auto-detect from browser language
    const lang = navigator.language?.slice(0, 2).toLowerCase();
    if (lang === "es") return "es";
    if (lang === "pt") return "pt";
    return "en";
  });

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem("mu-locale", l); } catch {}
  };

  const t = (key: TranslationKey, vars?: Record<string, string | number>): string => {
    let str = translations[locale][key] ?? translations["en"][key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return str;
  };

  return (
    <LocaleContext.Provider value={{
      locale,
      unitSystem: UNIT_SYSTEM[locale],
      setLocale,
      t,
      localeLabel: LOCALE_LABEL[locale],
    }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleCtx {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}
