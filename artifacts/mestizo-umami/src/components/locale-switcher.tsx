import { useLocale, type Locale } from "@/lib/locale";

const LOCALES: { code: Locale; label: string; title: string }[] = [
  { code: "en", label: "EN", title: "English — Imperial" },
  { code: "es", label: "ES", title: "Español — Métrico" },
  { code: "pt", label: "PT", title: "Português — Métrico" },
];

interface Props {
  compact?: boolean; // true = small pills for nav; false = larger labeled for mobile menu
}

export function LocaleSwitcher({ compact = true }: Props) {
  const { locale, setLocale } = useLocale();

  if (compact) {
    return (
      <div
        className="flex items-center rounded-full border border-white/15 overflow-hidden bg-black/20 backdrop-blur-sm"
        role="group"
        aria-label="Language selector"
      >
        {LOCALES.map(({ code, label, title }) => (
          <button
            key={code}
            onClick={() => setLocale(code)}
            title={title}
            aria-pressed={locale === code}
            className={`
              px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase transition-colors
              ${locale === code
                ? "bg-primary text-background"
                : "text-muted-foreground hover:text-primary hover:bg-white/5"}
            `}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  // Full version for mobile drawer
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">Language</span>
      <div className="flex gap-2">
        {LOCALES.map(({ code, label, title }) => (
          <button
            key={code}
            onClick={() => setLocale(code)}
            title={title}
            aria-pressed={locale === code}
            className={`
              flex-1 py-2 rounded-xl text-sm font-semibold tracking-wider uppercase border transition-colors
              ${locale === code
                ? "bg-primary text-background border-primary"
                : "border-white/15 text-muted-foreground hover:text-primary hover:border-primary/40"}
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
