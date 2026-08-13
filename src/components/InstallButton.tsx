import { useEffect, useState } from "react";
import { Download, MonitorDown, Share, Smartphone, X } from "lucide-react";
import { cn } from "@/lib/cn";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandalone() {
  const iosStandalone = "standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return window.matchMedia("(display-mode: standalone)").matches || iosStandalone;
}

export function InstallButton({ className }: { className?: string }) {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() => typeof window !== "undefined" && isStandalone());
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    function capture(event: Event) {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    }
    function markInstalled() {
      setInstalled(true);
      setPromptEvent(null);
      setShowHelp(false);
    }
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", markInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", markInstalled);
    };
  }, []);

  if (installed) return null;

  async function install() {
    if (!promptEvent) {
      setShowHelp(true);
      return;
    }
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setPromptEvent(null);
  }

  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <>
      <button type="button" onClick={() => void install()} className={cn("btn-ghost", className)}>
        <Download size={15} /> Install on my device
      </button>
      {showHelp ? (
        <div className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm grid place-items-center px-4" role="dialog" aria-modal="true" aria-labelledby="install-title">
          <section className="w-full max-w-[410px] rounded-[1.4rem] bg-[var(--color-bone-50)] p-5 shadow-2xl text-left">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Device install</p>
                <h2 id="install-title" className="display-md mt-1">Keep Mestizo Umami on your home screen.</h2>
              </div>
              <button type="button" onClick={() => setShowHelp(false)} className="p-2 -mt-2 -mr-2 rounded-full hover:bg-black/5" aria-label="Close install instructions">
                <X size={18} />
              </button>
            </div>
            {ios ? (
              <ol className="mt-5 space-y-3 text-sm text-[var(--color-ink-soft)]">
                <li className="flex gap-3"><span className="install-step"><Share size={15} /></span><span>Open this page in Safari and tap the <strong>Share</strong> button.</span></li>
                <li className="flex gap-3"><span className="install-step">2</span><span>Choose <strong>Add to Home Screen</strong>.</span></li>
                <li className="flex gap-3"><span className="install-step">3</span><span>Tap <strong>Add</strong>. The app will open in its own window.</span></li>
              </ol>
            ) : (
              <div className="mt-5 space-y-4 text-sm text-[var(--color-ink-soft)]">
                <p className="flex gap-3"><span className="install-step"><MonitorDown size={15} /></span><span>Use your browser menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</span></p>
                <p className="flex gap-3"><span className="install-step"><Smartphone size={15} /></span><span>If the option is missing, open this site in Chrome, Edge, or another browser that supports web-app installation.</span></p>
              </div>
            )}
            <button type="button" onClick={() => setShowHelp(false)} className="btn-primary mt-6 w-full justify-center">Done</button>
          </section>
        </div>
      ) : null}
    </>
  );
}

