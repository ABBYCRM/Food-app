import { useMemo, useState } from "react";
import { Sunrise, Sun, Moon, Leaf } from "lucide-react";
import { Layout } from "@/components/Layout";
import { RecipeCard } from "@/components/RecipeCard";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";
import type { Category, Meal } from "@/data/recipes";
import { allRecipesForCalendar } from "@/data/calendar";
import { recipeMatchesFilters } from "@/lib/allergens";
import { cn } from "@/lib/cn";

const all = allRecipesForCalendar();

function readSearch(): { meal: Meal | null; healthy: boolean } {
  if (typeof window === "undefined") return { meal: null, healthy: false };
  const sp = new URLSearchParams(window.location.search);
  const m = sp.get("meal");
  const meal = (m === "breakfast" || m === "lunch" || m === "dinner" ? m : null) as Meal | null;
  return { meal, healthy: sp.get("healthy") === "1" };
}

export function RecipesPage() {
  const { locale, avoiding, dietary } = useUser();
  const t = dict[locale];
  const initial = readSearch();
  const [filter, setFilter] = useState<Category | "all">("all");
  const [mealFilter, setMealFilter] = useState<Meal | null>(initial.meal);
  const [healthyOnly, setHealthyOnly] = useState(initial.healthy);
  const [visible, setVisible] = useState(24);

  const filtered = useMemo(() => {
    const avoidSet = new Set(avoiding);
    const dietSet = new Set(dietary);
    return all.filter(
      (r) =>
        (filter === "all" || r.category === filter) &&
        (mealFilter === null || r.meals.includes(mealFilter)) &&
        (!healthyOnly || r.healthy) &&
        recipeMatchesFilters(r, avoidSet, dietSet),
    );
  }, [filter, mealFilter, healthyOnly, avoiding, dietary]);

  const filters: { key: Category | "all"; label: string }[] = [
    { key: "all", label: t.recipes.filterAll },
    { key: "main", label: t.recipes.filterMains },
    { key: "starter", label: t.recipes.filterStarters },
    { key: "dessert", label: t.recipes.filterDessert },
  ];

  return (
    <Layout section={t.nav.recipes}>
      <section className="page-pad pt-5 prose-rail">
        <div className="eyebrow">{t.recipes.eyebrow}</div>
        <h1 className="display-lg mt-2">{t.recipes.title}</h1>
        <p className="mt-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">
          {t.recipes.subtitle}
        </p>
      </section>

      {/* Meal-time pills */}
      <section className="page-pad pt-5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <MealPill active={mealFilter === null} onClick={() => setMealFilter(null)}>{t.recipes.filterAll}</MealPill>
          <MealPill active={mealFilter === "breakfast"} onClick={() => setMealFilter(mealFilter === "breakfast" ? null : "breakfast")}>
            <Sunrise size={12} /> {t.recipes.filterBreakfast}
          </MealPill>
          <MealPill active={mealFilter === "lunch"} onClick={() => setMealFilter(mealFilter === "lunch" ? null : "lunch")}>
            <Sun size={12} /> {t.recipes.filterLunch}
          </MealPill>
          <MealPill active={mealFilter === "dinner"} onClick={() => setMealFilter(mealFilter === "dinner" ? null : "dinner")}>
            <Moon size={12} /> {t.recipes.filterDinner}
          </MealPill>
          <button
            type="button"
            onClick={() => setHealthyOnly((v) => !v)}
            className={cn(
              "shrink-0 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors",
              healthyOnly
                ? "bg-[var(--color-jade)] text-white"
                : "bg-[rgba(28,20,14,0.06)] text-[var(--color-ink)] hover:bg-[rgba(28,20,14,0.1)]"
            )}
          >
            <Leaf size={12} /> {t.recipes.filterHealthy}
          </button>
        </div>
      </section>

      {/* Category pills */}
      <section className="page-pad pt-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors",
                filter === f.key
                  ? "bg-[var(--color-chili)] text-[var(--color-bone-50)]"
                  : "bg-[rgba(28,20,14,0.06)] text-[var(--color-ink)] hover:bg-[rgba(28,20,14,0.1)]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className="page-pad pt-4 text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
        {t.recipes.showing(Math.min(visible, filtered.length), filtered.length)}
      </section>

      <section className="page-pad pt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
        {filtered.slice(0, visible).map((r) => (
          <RecipeCard key={r.slug} recipe={r} />
        ))}
        {filtered.length === 0 ? (
          <div className="text-center text-sm text-[var(--color-ink-muted)] py-8 col-span-full">
            {t.recipes.empty}
          </div>
        ) : null}
      </section>

      {visible < filtered.length ? (
        <section className="page-pad py-5">
          <button
            type="button"
            onClick={() => setVisible((v) => v + 24)}
            className="btn-ghost w-full justify-center"
          >
            {t.recipes.loadMore}
          </button>
        </section>
      ) : (
        <section className="py-5" />
      )}
    </Layout>
  );
}

function MealPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors",
        active
          ? "bg-[var(--color-teal)] text-white"
          : "bg-[rgba(28,20,14,0.06)] text-[var(--color-ink)] hover:bg-[rgba(28,20,14,0.1)]"
      )}
    >
      {children}
    </button>
  );
}
