import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Search, Heart, ChefHat, Calendar, Home as HomeIcon } from "lucide-react";
import { motion } from "framer-motion";

function Nav() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/recipes", label: "Recipes", icon: ChefHat },
    { href: "/planner", label: "Planner", icon: Calendar },
    { href: "/notebook", label: "Notebook", icon: Heart },
  ];

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex fixed top-0 w-full z-50 glass-effect h-20 items-center justify-between px-8 border-b border-white/5">
        <Link href="/" data-testid="link-home-brand" className="font-display text-2xl tracking-widest text-primary hover:opacity-80 transition-opacity">
          MESTIZO UMAMI
        </Link>

        <div className="flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              data-testid={`link-nav-${link.label.toLowerCase()}`}
              className={`text-sm uppercase tracking-wider font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
              {location === link.href && (
                <motion.div 
                  layoutId="underline" 
                  className="h-[2px] bg-primary mt-1 w-full"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/search" data-testid="link-nav-search" className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <Search className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
          <Link href="/notebook" data-testid="link-nav-notebook-icon" className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <Heart className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
        </div>
      </nav>

      {/* Mobile Tab Bar */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 glass-effect h-16 border-t border-white/5 flex items-center justify-around px-4">
        {links.map((link) => (
          <Link 
            key={link.href} 
            href={link.href}
            className={`flex flex-col items-center p-2 ${
              location === link.href ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <link.icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] uppercase tracking-wider">{link.label}</span>
          </Link>
        ))}
        <Link 
          href="/search"
          className={`flex flex-col items-center p-2 ${
            location === "/search" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Search className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase tracking-wider">Search</span>
        </Link>
      </nav>
    </>
  );
}

function Footer() {
  return (
    <footer className="w-full py-12 border-t border-white/5 bg-background text-center md:pb-12 pb-24">
      <div className="font-display text-2xl tracking-widest text-primary mb-4">
        MESTIZO UMAMI
      </div>
      <p className="text-muted-foreground text-sm uppercase tracking-widest">
        A private dining room in your kitchen.
      </p>
      <div className="mt-8 flex justify-center gap-6 text-sm text-muted-foreground">
        <Link href="/recipes" className="hover:text-primary transition-colors">Recipes</Link>
        <Link href="/planner" className="hover:text-primary transition-colors">Planner</Link>
        <Link href="/notebook" className="hover:text-primary transition-colors">Notebook</Link>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col relative w-full bg-background text-foreground overflow-x-hidden">
      <Nav />
      <main className="flex-1 w-full md:pt-20 pt-0 pb-16 md:pb-0 relative z-10 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
