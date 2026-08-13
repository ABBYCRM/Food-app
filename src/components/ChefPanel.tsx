/**
 * ChefPanel — Coming Soon
 *
 * The chef-booking integration is paused. The marketplace deep-links, ZIP
 * lookup, party-size form, and "Request quotes by email" mailto flow are
 * no longer wired to the UI. We keep the component file so the future
 * implementation can re-enable the same surface area without re-deriving
 * the i18n keys, but the rendered output is a single informational card.
 *
 * SECURITY: nothing here is a write action — no fetch, no localStorage
 * mutation, no network — so the trial gate is not consulted. This is a
 * pure informational surface.
 */
import { Clock, Sparkles } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";

export function ChefPanel({ dishLabel: _dishLabel }: { dishLabel: string }) {
  const { locale } = useUser();
  const t = dict[locale];
  return (
    <section
      className="card-surface px-4 py-5 text-center"
      role="region"
      aria-label={t.chef.comingSoonLabel}
    >
      <div className="mx-auto w-12 h-12 grid place-items-center rounded-pill bg-corn/20 text-corn-600 mb-3">
        <Clock size={20} />
      </div>
      <h3 className="display-md text-ink">{t.chef.comingSoonTitle}</h3>
      <p className="text-sm text-ink-soft leading-relaxed mt-2 max-w-[28rem] mx-auto">
        {t.chef.comingSoonBody}
      </p>
      <span className="inline-flex items-center gap-1.5 mt-4 pill pill-tag bg-ink/10 text-ink-soft">
        <Sparkles size={12} /> {t.chef.comingSoonNote}
      </span>
    </section>
  );
}
