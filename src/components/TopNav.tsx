import { useLocation } from "wouter";
import { Home, BookOpen, CalendarDays, NotebookPen, Search } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { dict, locales, type Locale } from "@/i18n";

/**
 * Desktop / large-tablet primary navigation.
 *
 * A bottom tab bar is a phone idiom — on a pointer-driven screen it strands
 * navigation at the far edge of a 1180px shell. From `lg` up we hide
 * BottomNav (see `.lang-bottom-nav` in index.css) and show this horizontal
 * rail instead. Same four destinations, same locale switcher, so the two
 * never disagree about where you can go.
 */
export function TopNav() {
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
    <nav className="top-nav" aria-label="Primary">
      <div className="flex items-center gap-1">
        {tabs.map((tab) => {
          const active = tab.to === "/" ? location === "/" : location.startsWith(tab.to);
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => navigate(tab.to)}
              aria-current={active ? "page" : undefined}
              className="top-nav-tab"
            >
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
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
        <button
          type="button"
          onClick={() => navigate("/search")}
          aria-label={t.nav.search}
          className="top-nav-search"
        >
          <Search size={16} />
        </button>
      </div>
    </nav>
  );
}
