import { ChevronLeft, Search } from "lucide-react";
import { useLocation } from "wouter";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";

export function Header({ section, showBack = false }: { section?: string; showBack?: boolean }) {
  const { locale } = useUser();
  const [, navigate] = useLocation();
  const t = dict[locale];
  return (
    <header className="header-band">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            type="button"
            aria-label={t.common.back}
            onClick={() => window.history.length > 1 ? window.history.back() : navigate("/")}
            className="p-1 -ml-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="font-display font-semibold text-[1.05rem] tracking-tight leading-none"
        >
          {t.brand}
        </button>
      </div>
      <div className="flex items-center gap-2">
        {section ? (
          <span className="text-[10px] uppercase tracking-[0.22em] opacity-80 hidden sm:inline">
            {section}
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => navigate("/search")}
          aria-label={t.nav.search}
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <Search size={18} />
        </button>
      </div>
    </header>
  );
}
