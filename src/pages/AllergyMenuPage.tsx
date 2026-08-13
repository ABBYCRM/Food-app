import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { RecipeCard } from "@/components/RecipeCard";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";
import type { Allergen, Dietary } from "@/data/recipes";
import { allRecipesForCalendar } from "@/data/calendar";
import { ALL_ALLERGENS, ALL_DIETARY, recipeMatchesFilters } from "@/lib/allergens";
import { cn } from "@/lib/cn";

const all = allRecipesForCalendar();

export function AllergyMenuPage() {
  const { locale, avoiding, dietary, toggleAvoiding, toggleDietary, resetFilters } = useUser();
  const t = dict[locale];
  const [visible, setVisible] = useState(60);

  const avoidSet = useMemo(() => new Set(avoiding), [avoiding]);
  const dietSet = useMemo(() => new Set(dietary), [dietary]);

  const safe = useMemo(
    () => all.filter((r) => recipeMatchesFilters(r, avoidSet, dietSet)),
    [avoidSet, dietSet],
  );

  useEffect(() => setVisible(60), [avoiding, dietary]);

  return (
    <Layout section={t.nav.allergy}>
      <section className="page-pad pt-5">
        <h1 className="display-lg">{t.allergy.title}</h1>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">{t.allergy.subtitle}</p>
      </section>

      <section className="page-pad pt-5">
        <div className="eyebrow mb-2">{t.allergy.avoiding}</div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_ALLERGENS.map((a: Allergen) => {
            const active = avoidSet.has(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAvoiding(a)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                  active
                    ? "bg-[var(--color-chili)] text-white border-transparent"
                    : "bg-white text-[var(--color-ink)] border-[rgba(28,20,14,0.12)] hover:border-[var(--color-ink)]"
                )}
              >
                {active ? "✕ " : ""}{t.allergy.flags[a]}
              </button>
            );
          })}
        </div>
      </section>

      <section className="page-pad pt-4">
        <div className="eyebrow mb-2">{t.allergy.showOnly}</div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_DIETARY.map((d: Dietary) => {
            const active = dietSet.has(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDietary(d)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-all border",
                  active
                    ? "bg-[var(--color-jade)] text-white border-transparent"
                    : "bg-white text-[var(--color-ink)] border-[rgba(28,20,14,0.12)] hover:border-[var(--color-ink)]"
                )}
              >
                {active ? "✓ " : ""}{t.allergy.dietary[d]}
              </button>
            );
          })}
        </div>
      </section>

      <section className="page-pad pt-4 flex items-center justify-between">
        <p className="text-xs font-semibold text-[var(--color-jade)]">{t.allergy.results(safe.length)}</p>
        <button type="button" onClick={resetFilters} className="text-xs underline underline-offset-2 text-[var(--color-ink-muted)]">
          {t.allergy.reset}
        </button>
      </section>

      <section className="page-pad pt-3">
        <p className="card-surface px-4 py-3 text-xs leading-relaxed text-[var(--color-ink-soft)]" role="note">
          {t.allergy.disclaimer}
        </p>
      </section>

      <section className="page-pad pt-3 pb-4 grid grid-cols-2 gap-3">
        {safe.slice(0, visible).map((r) => (
          <RecipeCard key={r.slug} recipe={r} />
        ))}
      </section>

      {visible < safe.length ? (
        <section className="page-pad pb-6">
          <button type="button" onClick={() => setVisible((value) => value + 24)} className="btn-ghost w-full justify-center">
            {t.recipes.loadMore}
          </button>
        </section>
      ) : <section className="pb-2" />}
    </Layout>
  );
}
