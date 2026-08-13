import { useLocation } from "wouter";
import { Home, BookOpen, CalendarDays, NotebookPen } from "lucide-react";
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
    { key: "planner", to: "/planner", label: t.nav.planner, icon: CalendarDays },
    { key: "notebook", to: "/notebook", label: t.nav.notebook, icon: NotebookPen },
  ];

  return (
    <nav className="lang-bottom-nav" aria-label="Primary">
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
              aria-current={active ? "page" : undefined}
              className={cn(
                "lang-bottom-nav-tab",
                active ? "text-chili" : "text-ink-muted"
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
              <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-1.5 px-3 pb-3 pt-1 border-t border-line-soft">
        {locales.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code as Locale)}
            aria-pressed={locale === l.code}
            className="lang-pill"
          >
            {l.native}
          </button>
        ))}
      </div>
    </nav>
  );
}
