/**
 * AccountButton — shows login CTA when unauthenticated, or a user avatar
 * with a dropdown (trial status, logout) when signed in.
 *
 * Rendered inside the Nav so every page has it.
 */
import { useState, useRef, useEffect } from "react";
import { LogIn, LogOut, User, Crown, Clock } from "lucide-react";
import { useAuthContext } from "@/lib/auth-context";

export function AccountButton() {
  const { loading, authenticated, user, entitlement, login, logout } = useAuthContext();
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />;
  }

  if (!authenticated) {
    return (
      <button
        onClick={() => login(window.location.pathname)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/50 bg-primary/10 text-primary text-xs tracking-wider uppercase font-medium hover:bg-primary/20 transition-all"
        aria-label="Sign in"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Sign in</span>
      </button>
    );
  }

  const initial = (user?.displayName ?? user?.email ?? "U")[0].toUpperCase();
  const stateIcon =
    entitlement?.state === "paid" ? <Crown className="w-3 h-3 text-amber-400" /> :
    entitlement?.state === "trial" ? <Clock className="w-3 h-3 text-primary" /> :
    null;

  return (
    <div className="relative" ref={dropRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary text-xs font-semibold">
          {initial}
        </div>
        {stateIcon && (
          <span className="hidden sm:flex items-center">{stateIcon}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-background/95 backdrop-blur-md shadow-xl z-[100] p-2 text-sm">
          {/* User info */}
          <div className="px-3 py-2 border-b border-white/10 mb-1">
            <p className="font-medium text-foreground truncate">
              {user?.displayName ?? "Account"}
            </p>
            {user?.email && (
              <p className="text-muted-foreground text-xs truncate">{user.email}</p>
            )}
          </div>

          {/* Entitlement */}
          {entitlement && (
            <div className="px-3 py-2 border-b border-white/10 mb-1">
              {entitlement.state === "paid" && (
                <div className="flex items-center gap-2 text-amber-400">
                  <Crown className="w-3.5 h-3.5" />
                  <span className="text-xs">Full access</span>
                </div>
              )}
              {entitlement.state === "trial" && (
                <div className="flex items-center gap-2 text-primary">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs">
                    Trial · {entitlement.daysRemaining} day{entitlement.daysRemaining !== 1 ? "s" : ""} left
                  </span>
                </div>
              )}
              {entitlement.state === "paywall" && (
                <div className="flex items-center gap-2 text-rose-400">
                  <User className="w-3.5 h-3.5" />
                  <span className="text-xs">Trial ended</span>
                </div>
              )}
            </div>
          )}

          {/* Logout */}
          <button
            onClick={() => { setOpen(false); void logout(); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
