import { useLocation } from "wouter";
import { Home, BookOpen, CalendarDays, NotebookPen, ChefHat } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { dict, locales, type Locale } from "@/i18n";
import { cn } from "@/lib/cn";

export function BottomNav() {
  const { locale, setLocale } = useUser();
  const [location, navigate] = useLocation();
  const t = dict[locale];

  const tabs = [
    { key: "home", to: "/", label: t.nav.home, icon: Home },
    { key: "recipes", to: "/recipes", label: t.nav.recipes, icon: BookOpen },
    { key: "chefs", to: "/chefs", label: t.nav.chefs, icon: ChefHat },
    { key: "planner", to: "/planner", label: t.nav.planner, icon: CalendarDays },
    { key: "notebook", to: "/notebook", label: t.nav.notebook, icon: NotebookPen },
  ];

  return (
    <nav className="lang-bottom-nav">
      <div className="flex items-stretch justify-between px-3 pt-2 pb-1">
        {tabs.map((tab) => {
          const active =
            tab.to === "/" ? location === "/" : location.startsWith(tab.to);
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => navigate(tab.to)}
              className={cn(
                "flex-1 flex flex-col items-center gap-0.5 py-1 rounded-lg transition-colors",
                active ? "text-[var(--color-chili)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
              <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-1.5 px-3 pb-3 pt-1 border-t border-[rgba(28,20,14,0.06)]">
        {locales.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code as Locale)}
            className={cn(
              "px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.14em] uppercase transition-all",
              locale === l.code
                ? "bg-[var(--color-chili)] text-[var(--color-bone-50)] shadow-sm"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            )}
            aria-pressed={locale === l.code}
          >
            {l.native}
          </button>
        ))}
      </div>
    </nav>
  );
}
