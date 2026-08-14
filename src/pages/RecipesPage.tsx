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
        <p className="mt-3 text-sm text-ink-soft leading-relaxed">
          {t.recipes.subtitle}
        </p>
      </section>

      {/* Meal-time pills */}
      <section className="page-pad pt-5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-stable">
          <FilterPill active={mealFilter === null} onClick={() => setMealFilter(null)}>{t.recipes.filterAll}</FilterPill>
          <FilterPill
            active={mealFilter === "breakfast"}
            onClick={() => setMealFilter(mealFilter === "breakfast" ? null : "breakfast")}
            variant="teal"
          >
            <Sunrise size={12} /> {t.recipes.filterBreakfast}
          </FilterPill>
          <FilterPill
            active={mealFilter === "lunch"}
            onClick={() => setMealFilter(mealFilter === "lunch" ? null : "lunch")}
            variant="teal"
          >
            <Sun size={12} /> {t.recipes.filterLunch}
          </FilterPill>
          <FilterPill
            active={mealFilter === "dinner"}
            onClick={() => setMealFilter(mealFilter === "dinner" ? null : "dinner")}
            variant="teal"
          >
            <Moon size={12} /> {t.recipes.filterDinner}
          </FilterPill>
          <FilterPill
            active={healthyOnly}
            onClick={() => setHealthyOnly((v) => !v)}
            variant="jade"
          >
            <Leaf size={12} /> {t.recipes.filterHealthy}
          </FilterPill>
        </div>
      </section>

      {/* Category pills */}
      <section className="page-pad pt-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-stable">
          {filters.map((f) => (
            <FilterPill
              key={f.key}
              active={filter === f.key}
              onClick={() => setFilter(f.key)}
              variant="chili"
            >
              {f.label}
            </FilterPill>
          ))}
        </div>
      </section>

      <section className="page-pad pt-4 text-[11px] uppercase tracking-[0.18em] text-ink-muted tabular">
        {t.recipes.showing(Math.min(visible, filtered.length), filtered.length)}
      </section>

      <section className="page-pad pt-3 grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filtered.slice(0, visible).map((r) => (
          <RecipeCard key={r.slug} recipe={r} />
        ))}
        {filtered.length === 0 ? (
          <div className="text-center text-sm text-ink-muted py-8 col-span-full">
            {t.recipes.empty}
          </div>
        ) : null}
      </section>

      {visible < filtered.length ? (
        <section className="page-pad py-5">
          <button
            type="button"
            onClick={() => setVisible((v) => v + 24)}
            className="btn btn-ghost btn-block"
          >
            +24
          </button>
        </section>
      ) : (
        <section className="py-5" />
      )}
    </Layout>
  );
}

type PillVariant = "chili" | "teal" | "jade";
const PILL_ACTIVE: Record<PillVariant, string> = {
  chili: "bg-chili text-bone-50 border-chili",
  teal: "bg-teal text-white border-teal",
  jade: "bg-jade text-white border-jade",
};
const PILL_INACTIVE = "bg-ink/[0.06] text-ink border-transparent hover:bg-ink/[0.1]";

function FilterPill({
  active, onClick, variant = "chili", children,
}: {
  active: boolean; onClick: () => void; variant?: PillVariant; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 chip",
        active ? PILL_ACTIVE[variant] : PILL_INACTIVE,
      )}
    >
      {children}
    </button>
  );
}
