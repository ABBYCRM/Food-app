import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SafeImage } from "@/components/SafeImage";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";
import { recipes } from "@/data/recipes";

export function PhilosophyPage() {
  const { locale } = useUser();
  const [, navigate] = useLocation();
  const t = dict[locale];
  const hero = recipes[0];

  return (
    <Layout section={t.philosophy.section} showBack>
      <section className="page-pad pt-4">
        <div className="relative rounded-card-lg overflow-hidden aspect-[5/6]">
          <SafeImage
            src={hero.hero}
            recipeSlug={hero.slug}
            fallbackSize="hero"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/0" />
          <span className="absolute top-4 left-4 pill pill-tag bg-chili text-bone-50">
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
            <p className="text-sm text-ink-soft leading-relaxed">
              {dict[code].philosophy.body}
            </p>
          </article>
        ))}
      </section>

      <section className="page-pad pt-6 flex items-center gap-3 flex-wrap">
        <div className="flavor-chip bg-chili/10 text-chili-700">
          🌶️ {t.philosophy.spice}
        </div>
        <div className="flavor-chip bg-teal/10 text-teal-600">
          🌊 {t.philosophy.umami}
        </div>
      </section>

      <section className="page-pad pt-6 pb-6 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => navigate("/")} className="btn btn-ghost">
          <ArrowLeft size={15} /> {t.philosophy.back}
        </button>
        <button type="button" onClick={() => navigate("/pantry")} className="btn btn-primary">
          {t.philosophy.next} <ArrowRight size={15} />
        </button>
      </section>
    </Layout>
  );
}
