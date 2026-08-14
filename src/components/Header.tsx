import { ChevronLeft, Search } from "lucide-react";
import { useLocation } from "wouter";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";
import { InstallButton } from "./InstallButton";

export function Header({ section, showBack = false }: { section?: string; showBack?: boolean }) {
  const { locale } = useUser();
  const [, navigate] = useLocation();
  const t = dict[locale];
  return (
    <header className="header-band">
      <div className="flex flex-1 items-center gap-2 min-w-0">
        {showBack ? (
          <button
            type="button"
            aria-label={t.common.back}
            onClick={() => window.history.length > 1 ? window.history.back() : navigate("/")}
            className="header-icon-btn"
          >
            <ChevronLeft size={20} />
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="font-display font-semibold text-[1.05rem] tracking-tight leading-tight text-left break-words"
        >
          {t.brand}
        </button>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {section ? (
          <span className="text-[10px] uppercase tracking-[0.16em] leading-tight text-right opacity-80 hidden sm:inline max-w-[20ch]">
            {section}
          </span>
        ) : null}
        <InstallButton className="bg-white/10 text-bone-50 border border-white/20 hover:bg-white/20" />
        <button
          type="button"
          onClick={() => navigate("/search")}
          aria-label={t.nav.search}
          className="header-icon-btn"
        >
          <Search size={18} />
        </button>
      </div>
    </header>
  );
}
