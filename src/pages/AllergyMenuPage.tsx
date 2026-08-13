import { useMemo } from "react";
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

  const avoidSet = useMemo(() => new Set(avoiding), [avoiding]);
  const dietSet = useMemo(() => new Set(dietary), [dietary]);

  const safe = useMemo(
    () => all.filter((r) => recipeMatchesFilters(r, avoidSet, dietSet)),
    [avoidSet, dietSet],
  );

  return (
    <Layout section={t.nav.allergy}>
      <section className="page-pad pt-5">
        <h1 className="display-lg">{t.allergy.title}</h1>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed">{t.allergy.subtitle}</p>
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
                aria-pressed={active}
                className={cn(
                  "chip",
                  active ? "bg-chili text-white border-chili" : "bg-white text-ink border-line hover:border-ink"
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
                aria-pressed={active}
                className={cn(
                  "chip",
                  active ? "bg-jade text-white border-jade" : "bg-white text-ink border-line hover:border-ink"
                )}
              >
                {active ? "✓ " : ""}{t.allergy.dietary[d]}
              </button>
            );
          })}
        </div>
      </section>

      <section className="page-pad pt-4 flex items-center justify-between">
        <p className="text-xs font-semibold text-jade tabular">{t.allergy.results(safe.length)}</p>
        <button type="button" onClick={resetFilters} className="text-xs underline underline-offset-2 text-ink-muted hover:text-ink">
          {t.allergy.reset}
        </button>
      </section>

      <section className="page-pad pt-3 pb-6 grid grid-cols-2 gap-3">
        {safe.slice(0, 60).map((r) => (
          <RecipeCard key={r.slug} recipe={r} />
        ))}
      </section>
    </Layout>
  );
}
