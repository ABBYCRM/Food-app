/**
 * OfflineBanner — a slim, unobtrusive bar that appears at the top of the page
 * when the device loses its network connection and disappears when it returns.
 *
 * Because recipes are bundled JS and the meal plan lives in localStorage, the
 * app is fully usable offline — this banner simply lets the user know why live
 * features (store search, push sync) won't respond.
 */
import { AnimatePresence, motion } from "framer-motion";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/lib/use-online-status";

export function OfflineBanner() {
  const online = useOnlineStatus();

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          key="offline-banner"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden w-full z-[200] fixed top-0 left-0"
          aria-live="assertive"
          role="alert"
        >
          <div className="flex items-center justify-center gap-2 bg-amber-500/20 border-b border-amber-500/30 backdrop-blur-sm px-4 py-1.5 text-amber-400 text-xs tracking-wider">
            <WifiOff className="w-3 h-3 shrink-0" />
            <span>
              You're offline — recipes &amp; your meal plan still work.
              Live features resume when you reconnect.
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
