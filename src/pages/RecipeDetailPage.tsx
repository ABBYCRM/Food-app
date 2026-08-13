import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, Bookmark, Share2, CalendarPlus, GitFork, Clock, Flame, Sparkles, ShieldAlert, ChefHat, X,
  Coffee, Sun, Moon, Cookie,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { SafeImage } from "@/components/SafeImage";
import { RecipeCard } from "@/components/RecipeCard";
import { ServingsScaler } from "@/components/ServingsScaler";
import { ShoppingPanel } from "@/components/ShoppingPanel";
import { VendorPanel } from "@/components/VendorPanel";
import { ChefPanel } from "@/components/ChefPanel";
import { PaywallModal } from "@/components/PaywallModal";
import { useUser, type MealSlot, MEAL_SLOTS } from "@/context/UserContext";
import { useTrial } from "@/context/TrialContext";
import { dict } from "@/i18n";
import type { Ingredient } from "@/data/recipes";
import { allRecipesForCalendar } from "@/data/calendar";
import { recipeBySlug, relatedRecipes } from "@/data/recipes";
import { scaledIngredientParts } from "@/lib/scaling";
import { cn } from "@/lib/cn";

const SLOT_ICON: Record<MealSlot, typeof Coffee> = {
  breakfast: Coffee, lunch: Sun, dinner: Moon, snack: Cookie,
};

function findRecipe(slug: string) {
  return recipeBySlug(slug) ?? allRecipesForCalendar().find((r) => r.slug === slug);
}

export function RecipeDetailPage({ slug }: { slug: string }) {
  const { locale, isFavorite, toggleFavorite, getNote, setNote, planSlot, addUserRecipe } = useUser();
  const { canWrite } = useTrial();
  const [, navigate] = useLocation();
  const t = dict[locale];
  const found = findRecipe(slug);

  const [servings, setServings] = useState<number>(found?.serves ?? 4);
  const [planFeedback, setPlanFeedback] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [slotPickerOpen, setSlotPickerOpen] = useState(false);

  if (!found) {
    return (
      <Layout showBack>
        <div className="page-pad py-12 text-center">
          <p className="text-sm text-ink-muted">Recipe not found.</p>
          <button type="button" onClick={() => navigate("/recipes")} className="btn btn-ghost mt-4 mx-auto">
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

  const requireWrite = (action: () => void) => {
    if (!canWrite) {
      setPaywallOpen(true);
      return;
    }
    action();
  };

  function addToPlanner(slot: MealSlot) {
    const today = new Date();
    const dayKey = today.toISOString().slice(0, 10);
    planSlot(dayKey, slot, recipe.slug);
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
        <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:h-[440px] overflow-hidden">
          <SafeImage src={recipe.hero} recipeSlug={recipe.slug} fallbackSize="hero" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/30" />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => window.history.length > 1 ? window.history.back() : navigate("/recipes")}
              className="w-9 h-9 grid place-items-center rounded-pill bg-black/35 backdrop-blur text-white transition-colors hover:bg-black/45"
              aria-label={t.common.back}
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={share}
                className="w-9 h-9 grid place-items-center rounded-pill bg-black/35 backdrop-blur text-white transition-colors hover:bg-black/45"
                aria-label={t.recipe.share}
              >
                <Share2 size={16} />
              </button>
              <button
                type="button"
                onClick={() => requireWrite(() => toggleFavorite(recipe.slug))}
                className={cn(
                  "w-9 h-9 grid place-items-center rounded-pill transition-colors",
                  fav ? "bg-chili text-white" : "bg-black/35 backdrop-blur text-white hover:bg-black/45"
                )}
                aria-label={fav ? t.recipe.saved : t.recipe.save}
                aria-pressed={fav}
              >
                <Bookmark size={16} fill={fav ? "currentColor" : "none"} />
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
          <div className="card-surface px-4 py-3 flex items-start gap-3 border-l-4 !border-l-corn">
            <ShieldAlert size={16} className="text-corn mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">
                {t.meta.draft}
              </div>
              <p className="text-xs text-ink-muted leading-snug mt-0.5">
                {t.meta.draftNote}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* Story */}
      <section className="page-pad pt-5">
        <div className="eyebrow">{t.recipe.story}</div>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed">
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
          <span className="text-xs text-ink-muted tabular">
            {recipe.ingredients.length} · {servings} {t.recipe.servings.toLowerCase()}
          </span>
        </div>
        <ul className="card-surface px-4 py-2 divide-y divide-line-soft">
          {scaled.map((ing, idx) => {
            const p = scaledIngredientParts(ing, multiplier, locale);
            return (
              <li key={idx} className="flex items-start gap-3 py-2.5">
                <span className="font-display text-chili text-sm min-w-[5rem] tabular">{p.qty || "·"}</span>
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
            <p className="text-xs text-jade font-medium">— {t.recipe.freeOf.toLowerCase()} —</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {recipe.allergens.map((a) => (
                <span key={a} className="pill bg-chili/10 text-chili-700">
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
                  <span key={d} className="pill bg-jade/10 text-jade">
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
              <span className="font-display text-2xl text-chili leading-none w-8 shrink-0 tabular">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-relaxed text-ink-soft">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Notes & Pairing */}
      <section className="page-pad pt-5 space-y-3">
        <article className="card-surface px-4 py-4">
          <div className="eyebrow">{t.recipe.notes}</div>
          <p className="text-sm text-ink-soft leading-relaxed mt-2">{recipe.notes[locale]}</p>
        </article>
        <article className="card-surface px-4 py-4">
          <div className="eyebrow">{t.recipe.pairing}</div>
          <p className="text-sm italic text-ink-soft leading-relaxed mt-2">"{recipe.pairing[locale]}"</p>
        </article>
      </section>

      {/* Personal notes — gated write */}
      <section className="page-pad pt-5">
        <div className="card-surface px-4 py-4">
          <div className="eyebrow">{t.recipe.myNotes}</div>
          {canWrite ? (
            <textarea
              value={note}
              onChange={(e) => setNote(recipe.slug, e.target.value)}
              placeholder={t.recipe.myNotesPlaceholder}
              rows={4}
              className="textarea mt-2"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPaywallOpen(true)}
              className="mt-2 w-full rounded-input border border-dashed border-line bg-ink/[0.03] px-3 py-3 text-sm text-ink-muted hover:bg-ink/[0.06] transition-colors"
            >
              🔒 Subscribe to write personal notes
            </button>
          )}
        </div>
      </section>

      {/* Actions — gated writes */}
      <section className="page-pad pt-5 pb-2 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => requireWrite(() => setSlotPickerOpen(true))}
          className={cn("btn btn-teal", planFeedback && "btn-jade")}
        >
          <CalendarPlus size={16} /> {planFeedback ? t.recipe.addedToPlanner : t.recipe.addToPlanner}
        </button>
        <button
          type="button"
          onClick={() => requireWrite(forkToNotebook)}
          className="btn btn-primary"
        >
          <GitFork size={16} /> {t.recipe.forkToNotebook}
        </button>
      </section>

      {/* Slot picker modal — choose which meal to add this recipe to */}
      {slotPickerOpen ? (
        <div className="fixed inset-0 z-modal bg-ink/55 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label={t.recipe.addToPlanner}>
          <div className="max-w-[420px] w-full bg-bone-50 rounded-card-lg overflow-hidden card-surface my-auto">
            <div className="px-4 py-3 border-b border-line-soft flex items-center justify-between">
              <div className="font-display text-lg">{t.recipe.addToPlanner}</div>
              <button type="button" onClick={() => setSlotPickerOpen(false)} className="p-1 rounded-pill hover:bg-ink/[0.06]" aria-label={t.common.cancel}>
                <X size={16} />
              </button>
            </div>
            <div className="p-3 space-y-2">
              {MEAL_SLOTS.map((slot) => {
                const Icon = SLOT_ICON[slot];
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => { addToPlanner(slot); setSlotPickerOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-input text-left",
                      "border border-line hover:border-chili hover:bg-chili/[0.04] transition-colors"
                    )}
                  >
                    <span
                      className={cn(
                        "w-9 h-9 grid place-items-center rounded-pill shrink-0",
                        slot === "breakfast" ? "bg-corn/20 text-corn-600"
                        : slot === "lunch" ? "bg-jade/15 text-jade-600"
                        : slot === "dinner" ? "bg-chili/15 text-chili-600"
                        : "bg-teal/15 text-teal-600"
                      )}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="flex-1 text-sm font-semibold">{t.planner.slot[slot]}</span>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">{t.planner.slotShort[slot]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* Related */}
      {related.length > 0 ? (
        <section className="page-pad pt-7 pb-4">
          <div className="eyebrow mb-3">{t.recipe.related}</div>
          <div className="grid-responsive">
            {related.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </section>
      ) : null}

      {paywallOpen ? <PaywallModal force onClose={() => setPaywallOpen(false)} /> : null}
    </Layout>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-chili">{icon}</span>
      <span className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">{label}</span>
      <span className="text-xs font-semibold text-ink leading-tight">{value}</span>
    </div>
  );
}
