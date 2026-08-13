import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";
import { SafeImage } from "@/components/SafeImage";
import { pantry } from "@/data/pantry";

export function PantryPage() {
  const { locale } = useUser();
  const [, navigate] = useLocation();
  const t = dict[locale];

  return (
    <Layout section={t.nav.pantry} showBack>
      <section className="page-pad pt-5">
        <div className="eyebrow">{t.pantry.eyebrow}</div>
        <h1 className="display-lg mt-2">{t.pantry.title}</h1>
        <p className="mt-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">
          {t.pantry.body}
        </p>
      </section>

      <section className="page-pad pt-5 space-y-3">
        {pantry.map((p) => (
          <article key={p.slug} className="card-surface overflow-hidden">
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <div className="relative aspect-square">
                <SafeImage src={p.hero} alt={p.name[locale]} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="py-3 pr-3">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-muted)]">{p.category[locale]}</div>
                <h3 className="font-display text-lg leading-tight mt-0.5">{p.name[locale]}</h3>
                <p className="text-xs text-[var(--color-ink-soft)] leading-snug mt-1.5">{p.short[locale]}</p>
                <p className="text-xs italic text-[var(--color-chili)] mt-1.5">→ {p.bridges[locale]}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="page-pad pt-6 pb-6">
        <button type="button" onClick={() => navigate("/recipes")} className="btn-primary w-full justify-center">
          {t.pantry.next} <ArrowRight size={15} />
        </button>
      </section>
    </Layout>
  );
}
