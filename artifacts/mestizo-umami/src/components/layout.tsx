import { type ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Heart, ChefHat, Calendar, Home as HomeIcon, Menu, X, MapPin, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { AccountButton } from "@/components/account-button";
import { OfflineBanner } from "@/components/offline-banner";
import { useLocale } from "@/lib/locale";
import { usePWAInstall } from "@/lib/use-pwa-install";

function Nav() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLocale();
  const { canInstall, triggerInstall } = usePWAInstall();

  const links = [
    { href: "/", labelKey: "nav.home" as const, icon: HomeIcon },
    { href: "/recipes", labelKey: "nav.recipes" as const, icon: ChefHat },
    { href: "/planner", labelKey: "nav.planner" as const, icon: Calendar },
    { href: "/notebook", labelKey: "nav.notebook" as const, icon: Heart },
    { href: "/stores", labelKey: "nav.stores" as const, icon: MapPin },
  ];

  return (
    <>
      {/* Desktop Nav — lg and above */}
      <nav className="hidden lg:flex fixed top-0 w-full z-50 glass-effect h-20 items-center justify-between px-8 border-b border-white/5">
        <Link href="/" data-testid="link-home-brand" className="font-display text-2xl tracking-widest text-primary hover:opacity-80 transition-opacity">
          MESTIZO UMAMI
        </Link>

        <div className="flex items-center gap-8">
          {links.map((link) => {
            const label = t(link.labelKey);
            return (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`link-nav-${link.labelKey.split(".")[1]}`}
                className={`text-sm uppercase tracking-wider font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
                {location === link.href && (
                  <motion.div
                    layoutId="underline"
                    className="h-[2px] bg-primary mt-1 w-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* PWA Install button — desktop */}
          {canInstall && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={triggerInstall}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/60 bg-primary/10 text-primary text-xs tracking-widest uppercase font-medium hover:bg-primary/20 hover:border-primary transition-all"
              aria-label="Install app"
            >
              <Download className="w-3.5 h-3.5" />
              Install App
            </motion.button>
          )}
          {/* Locale switcher */}
          <LocaleSwitcher compact />
          <Link href="/search" data-testid="link-nav-search" className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <Search className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
          <Link href="/notebook" data-testid="link-nav-notebook-icon" className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <Heart className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
          <AccountButton />
        </div>
      </nav>

      {/* Tablet Nav — md to lg */}
      <nav className="hidden md:flex lg:hidden fixed top-0 w-full z-50 glass-effect h-16 items-center justify-between px-6 border-b border-white/5">
        <Link href="/" data-testid="link-home-brand-tablet" className="font-display text-xl tracking-widest text-primary hover:opacity-80 transition-opacity">
          MESTIZO UMAMI
        </Link>

        <div className="flex items-center gap-3">
          <LocaleSwitcher compact />
          <AccountButton />
          <Link href="/search" className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <Search className="w-5 h-5 text-muted-foreground" />
          </Link>
          <button
            data-testid="button-hamburger"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-primary"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Tablet Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm hidden md:flex lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-72 z-[70] glass-effect border-l border-white/10 flex flex-col p-8 hidden md:flex lg:hidden"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-display text-lg tracking-widest text-primary">MENU</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 text-xl font-display transition-colors hover:text-primary ${
                      location === link.href ? "text-primary" : "text-foreground"
                    }`}
                  >
                    <link.icon className="w-5 h-5 shrink-0" />
                    {t(link.labelKey)}
                  </Link>
                ))}
                <Link
                  href="/search"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-xl font-display text-foreground hover:text-primary transition-colors"
                >
                  <Search className="w-5 h-5 shrink-0" />
                  {t("nav.search")}
                </Link>
              </nav>
              <div className="mt-8 pt-6 border-t border-white/5">
                <LocaleSwitcher compact={false} />
              </div>
              {canInstall && (
                <div className="mt-6">
                  <button
                    onClick={() => { triggerInstall(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-primary/60 bg-primary/10 text-primary text-xs tracking-widest uppercase font-medium hover:bg-primary/20 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Install on my device
                  </button>
                </div>
              )}
              <div className="mt-auto pt-8 border-t border-white/5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t("nav.tagline")}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Tab Bar — below md */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 glass-effect border-t border-white/5">
        {/* Locale + Install strip */}
        <div className="flex items-center justify-between gap-0 border-b border-white/5 py-1.5 px-3">
          <LocaleSwitcher compact />
          {canInstall && (
            <button
              onClick={triggerInstall}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/60 bg-primary/10 text-primary text-[9px] tracking-widest uppercase font-medium hover:bg-primary/20 transition-all"
              aria-label="Install app"
            >
              <Download className="w-3 h-3" />
              Install
            </button>
          )}
        </div>
        <div className="h-14 flex items-center justify-around px-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`link-tabnav-${link.labelKey.split(".")[1]}`}
              className={`flex flex-col items-center gap-0.5 py-1 px-1 sm:px-2 rounded-lg transition-colors ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <link.icon className="w-4 h-4" />
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider">{t(link.labelKey)}</span>
            </Link>
          ))}
          <Link
            href="/search"
            data-testid="link-tabnav-search"
            className={`flex flex-col items-center gap-0.5 py-1 px-1 sm:px-2 rounded-lg transition-colors ${
              location === "/search" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="text-[8px] sm:text-[9px] uppercase tracking-wider">{t("nav.search")}</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

function Footer() {
  const { t } = useLocale();
  return (
    <footer className="w-full py-12 border-t border-white/5 bg-background text-center md:pb-12 pb-24">
      <div className="font-display text-2xl tracking-widest text-primary mb-4">
        MESTIZO UMAMI
      </div>
      <p className="text-muted-foreground text-sm uppercase tracking-widest">
        {t("nav.tagline")}
      </p>
      <div className="mt-8 flex justify-center gap-6 text-sm text-muted-foreground">
        <Link href="/recipes" className="hover:text-primary transition-colors">{t("nav.recipes")}</Link>
        <Link href="/planner" className="hover:text-primary transition-colors">{t("nav.planner")}</Link>
        <Link href="/notebook" className="hover:text-primary transition-colors">{t("nav.notebook")}</Link>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col relative w-full bg-background text-foreground overflow-x-hidden">
      <OfflineBanner />
      <Nav />
      {/* pb-28: mobile bottom nav = locale strip (~36px) + tab bar (56px) ≈ 92px → safe 112px */}
      <main className="flex-1 w-full pt-0 md:pt-16 lg:pt-20 pb-28 md:pb-0 relative z-10 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
