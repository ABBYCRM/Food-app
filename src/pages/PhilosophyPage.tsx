import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";
import { SafeImage } from "@/components/SafeImage";
import { recipes } from "@/data/recipes";

export function PhilosophyPage() {
  const { locale } = useUser();
  const [, navigate] = useLocation();
  const t = dict[locale];
  const hero = recipes[0];

  return (
    <Layout section={t.philosophy.section} showBack>
      <section className="page-pad pt-4">
        <div className="relative rounded-[1.4rem] overflow-hidden aspect-[5/6]">
          <SafeImage src={hero.hero} alt={hero.title[locale]} className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/0" />
          <span className="absolute top-4 left-4 pill bg-[var(--color-chili)] text-[var(--color-bone-50)]">
            {t.philosophy.section}
          </span>
        </div>
      </section>

      <section className="page-pad pt-6">
        <div className="eyebrow">{t.philosophy.eyebrow}</div>
        <h1 className="display-xl mt-2">{t.philosophy.title}</h1>
      </section>

      <section className="page-pad pt-5 space-y-3">
        {(["en", "es", "pt"] as const).map((code) => (
          <article key={code} className="card-surface px-4 py-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="eyebrow">{code === "en" ? "English" : code === "es" ? "Español" : "Português"}</span>
            </div>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
              {dict[code].philosophy.body}
            </p>
          </article>
        ))}
      </section>

      <section className="page-pad pt-6 flex items-center gap-3">
        <div className="flavor-chip bg-[var(--color-chili)]/12 text-[var(--color-chili-700)]">
          🌶️ {t.philosophy.spice}
        </div>
        <div className="flavor-chip bg-[var(--color-teal)]/12 text-[var(--color-teal-600)]">
          🌊 {t.philosophy.umami}
        </div>
      </section>

      <section className="page-pad pt-6 pb-6 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => navigate("/")} className="btn-ghost justify-center">
          <ArrowLeft size={15} /> {t.philosophy.back}
        </button>
        <button type="button" onClick={() => navigate("/pantry")} className="btn-primary justify-center">
          {t.philosophy.next} <ArrowRight size={15} />
        </button>
      </section>
    </Layout>
  );
}
