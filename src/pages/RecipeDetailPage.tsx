import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, Bookmark, Share2, CalendarPlus, GitFork, Clock, Flame, Sparkles, ShieldAlert, ChefHat,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { SafeImage } from "@/components/SafeImage";
import { RecipeCard } from "@/components/RecipeCard";
import { ServingsScaler } from "@/components/ServingsScaler";
import { ShoppingPanel } from "@/components/ShoppingPanel";
import { VendorPanel } from "@/components/VendorPanel";
import { ChefPanel } from "@/components/ChefPanel";
import { useUser } from "@/context/UserContext";
import { dict } from "@/i18n";
import type { Ingredient } from "@/data/recipes";
import { allRecipesForCalendar } from "@/data/calendar";
import { recipeBySlug, relatedRecipes } from "@/data/recipes";
import { scaledIngredientParts } from "@/lib/scaling";
import { cn } from "@/lib/cn";

function findRecipe(slug: string) {
  return recipeBySlug(slug) ?? allRecipesForCalendar().find((r) => r.slug === slug);
}

export function RecipeDetailPage({ slug }: { slug: string }) {
  const { locale, isFavorite, toggleFavorite, getNote, setNote, planDay, addUserRecipe } = useUser();
  const [, navigate] = useLocation();
  const t = dict[locale];
  const found = findRecipe(slug);

  const [servings, setServings] = useState<number>(found?.serves ?? 4);
  const [planFeedback, setPlanFeedback] = useState(false);

  if (!found) {
    return (
      <Layout showBack>
        <div className="page-pad py-12 text-center">
          <p className="text-sm text-[var(--color-ink-muted)]">Recipe not found.</p>
          <button type="button" onClick={() => navigate("/recipes")} className="btn-ghost mt-4 mx-auto">
            <ArrowLeft size={14} /> {t.recipe.backToRecipes}
          </button>
        </div>
      </Layout>
    );
  }

  /* Bind to a const after narrow so nested function declarations keep type info. */
  const recipe = found;
  const multiplier = servings / recipe.serves;

  const scaled: Ingredient[] = recipe.ingredients;

  const fav = isFavorite(recipe.slug);
  const note = getNote(recipe.slug);

  const related = relatedRecipes(recipe.slug, 3);

  const totalMinutes = recipe.prepMinutes + recipe.cookMinutes;
  const isDraft = recipe.slug.startsWith("day-");

  function addToPlanner() {
    const today = new Date();
    const dayKey = today.toISOString().slice(0, 10);
    planDay(dayKey, recipe.slug);
    setPlanFeedback(true);
    setTimeout(() => setPlanFeedback(false), 1800);
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: recipe.title[locale], text: recipe.subtitle[locale], url }); return; } catch { /* fallthrough */ }
    }
    try { await navigator.clipboard.writeText(url); } catch { /* ignore */ }
  }

  function forkToNotebook() {
    const lines = scaled.map((ing) => {
      const p = scaledIngredientParts(ing, multiplier, locale);
      return [p.qty, p.name].filter(Boolean).join(" — ");
    });
    addUserRecipe({
      title: recipe.title[locale],
      subtitle: recipe.subtitle[locale],
      story: recipe.story[locale],
      ingredients: lines,
      method: [...recipe.method[locale]],
      serves: servings,
      minutes: totalMinutes,
      forkedFrom: recipe.slug,
    });
    navigate("/notebook");
  }

  return (
    <Layout hideHeader>
      {/* Full-bleed hero */}
      <section className="relative">
        <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/9] lg:max-h-[440px] overflow-hidden">
          <SafeImage src={recipe.hero} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/30" />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => window.history.length > 1 ? window.history.back() : navigate("/recipes")}
              className="w-9 h-9 grid place-items-center rounded-full bg-black/35 backdrop-blur text-white"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={share}
                className="w-9 h-9 grid place-items-center rounded-full bg-black/35 backdrop-blur text-white"
                aria-label={t.recipe.share}
              >
                <Share2 size={15} />
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(recipe.slug)}
                className={cn(
                  "w-9 h-9 grid place-items-center rounded-full",
                  fav ? "bg-[var(--color-chili)] text-white" : "bg-black/35 backdrop-blur text-white"
                )}
                aria-label={fav ? t.recipe.saved : t.recipe.save}
              >
                <Bookmark size={15} fill={fav ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
          <div className="absolute bottom-4 left-5 right-5 text-white prose-rail">
            <div className="text-[10px] uppercase tracking-[0.22em] opacity-90">{recipe.origin[locale]}</div>
            <h1 className="font-display text-[1.85rem] sm:text-[2.2rem] lg:text-[2.6rem] leading-[1.08] font-semibold mt-1.5 drop-shadow-md break-words">
              {recipe.title[locale]}
            </h1>
            <p className="text-sm sm:text-base opacity-95 mt-2 leading-relaxed drop-shadow">
              {recipe.subtitle[locale]}
            </p>
          </div>
        </div>
      </section>

      {/* Quick metrics */}
      <section className="page-pad pt-5">
        <div className="card-surface px-4 py-3 grid grid-cols-4 gap-2 text-center">
          <Metric icon={<Clock size={14} />} label={t.recipe.time} value={`${totalMinutes} ${t.recipes.minutes}`} />
          <Metric icon={<ChefHat size={14} />} label={t.recipe.difficulty} value={t.recipes.difficulty[recipe.difficulty]} />
          <Metric icon={<Flame size={14} />} label={t.recipe.spiceLevel} value={t.meta.spice[recipe.spice - 1]} />
          <Metric icon={<Sparkles size={14} />} label={t.recipe.umamiDepth} value={t.meta.umami[recipe.umami - 1]} />
        </div>
      </section>

      {/* Draft notice for generated calendar variants */}
      {isDraft ? (
        <section className="page-pad pt-3">
          <div className="card-surface px-4 py-3 flex items-start gap-3 border-l-4 !border-l-[var(--color-corn)]">
            <ShieldAlert size={16} className="text-[var(--color-corn)] mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]">
                {t.meta.draft}
              </div>
              <p className="text-xs text-[var(--color-ink-muted)] leading-snug mt-0.5">
                {t.meta.draftNote}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* Story */}
      <section className="page-pad pt-5">
        <div className="eyebrow">{t.recipe.story}</div>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">
          {recipe.story[locale]}
        </p>
      </section>

      {/* Scaler */}
      <section className="page-pad pt-5">
        <ServingsScaler baseServes={recipe.serves} servings={servings} setServings={setServings} />
      </section>

      {/* Ingredients (scaled) */}
      <section className="page-pad pt-5">
        <div className="flex items-baseline justify-between mb-2.5">
          <h2 className="display-md">{t.recipe.ingredients}</h2>
          <span className="text-xs text-[var(--color-ink-muted)]">
            {recipe.ingredients.length} · {servings} {t.recipe.servings.toLowerCase()}
          </span>
        </div>
        <ul className="card-surface px-4 py-2 divide-y divide-[rgba(28,20,14,0.06)]">
          {scaled.map((ing, idx) => {
            const p = scaledIngredientParts(ing, multiplier, locale);
            return (
              <li key={idx} className="flex items-start gap-3 py-2.5">
                <span className="font-display text-[var(--color-chili)] text-sm min-w-[5rem]">{p.qty || "·"}</span>
                <span className="text-sm leading-snug flex-1">{p.name}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Allergens */}
      <section className="page-pad pt-5">
        <div className="card-surface px-4 py-3">
          <div className="eyebrow mb-2">{t.recipe.contains}</div>
          {recipe.allergens.length === 0 ? (
            <p className="text-xs text-[var(--color-jade)] font-medium">— {t.recipe.freeOf.toLowerCase()} —</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {recipe.allergens.map((a) => (
                <span key={a} className="px-2.5 py-1 rounded-full bg-[var(--color-chili)]/10 text-[var(--color-chili-700)] text-[11px] font-semibold uppercase tracking-wide">
                  {t.allergy.flags[a]}
                </span>
              ))}
            </div>
          )}
          {recipe.dietary.length > 0 ? (
            <>
              <div className="eyebrow mt-3 mb-2">{t.recipe.freeOf}</div>
              <div className="flex flex-wrap gap-1.5">
                {recipe.dietary.map((d) => (
                  <span key={d} className="px-2.5 py-1 rounded-full bg-[var(--color-jade)]/10 text-[var(--color-jade)] text-[11px] font-semibold uppercase tracking-wide">
                    {t.allergy.dietary[d]}
                  </span>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>

      {/* Shopping */}
      <section className="page-pad pt-5">
        <ShoppingPanel recipe={recipe} scaledIngredients={scaled} />
      </section>

      {/* Vendor */}
      <section className="page-pad pt-5">
        <VendorPanel />
      </section>

      {/* Chef booking */}
      <section className="page-pad pt-5">
        <ChefPanel dishLabel={recipe.title.en} />
      </section>

      {/* Method */}
      <section className="page-pad pt-5">
        <h2 className="display-md mb-3">{t.recipe.method}</h2>
        <ol className="space-y-3">
          {recipe.method[locale].map((step, idx) => (
            <li key={idx} className="card-surface px-4 py-3 flex items-start gap-3">
              <span className="font-display text-2xl text-[var(--color-chili)] leading-none w-8 shrink-0">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Notes & Pairing */}
      <section className="page-pad pt-5 space-y-3">
        <article className="card-surface px-4 py-4">
          <div className="eyebrow">{t.recipe.notes}</div>
          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mt-2">{recipe.notes[locale]}</p>
        </article>
        <article className="card-surface px-4 py-4">
          <div className="eyebrow">{t.recipe.pairing}</div>
          <p className="text-sm italic text-[var(--color-ink-soft)] leading-relaxed mt-2">"{recipe.pairing[locale]}"</p>
        </article>
      </section>

      {/* Personal notes */}
      <section className="page-pad pt-5">
        <div className="card-surface px-4 py-4">
          <div className="eyebrow">{t.recipe.myNotes}</div>
          <textarea
            value={note}
            onChange={(e) => setNote(recipe.slug, e.target.value)}
            placeholder={t.recipe.myNotesPlaceholder}
            rows={4}
            className="mt-2 w-full rounded-md border border-[rgba(28,20,14,0.12)] bg-white px-3 py-2 text-sm leading-relaxed focus:outline-none focus:border-[var(--color-chili)]"
          />
        </div>
      </section>

      {/* Actions */}
      <section className="page-pad pt-5 pb-2 grid grid-cols-2 gap-3">
        <button type="button" onClick={addToPlanner} className="btn-teal justify-center">
          <CalendarPlus size={15} /> {planFeedback ? t.recipe.addedToPlanner : t.recipe.addToPlanner}
        </button>
        <button type="button" onClick={forkToNotebook} className="btn-primary justify-center">
          <GitFork size={15} /> {t.recipe.forkToNotebook}
        </button>
      </section>

      {/* Related */}
      <section className="page-pad pt-7 pb-6">
        <h2 className="display-md mb-3">{t.recipe.related}</h2>
        <div className="grid grid-cols-2 gap-3">
          {related.map((r) => (
            <RecipeCard key={r.slug} recipe={r} />
          ))}
        </div>
      </section>
    </Layout>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[var(--color-chili)]">{icon}</span>
      <span className="text-[9.5px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)] mt-1">{label}</span>
      <span className="text-xs font-semibold">{value}</span>
    </div>
  );
}
