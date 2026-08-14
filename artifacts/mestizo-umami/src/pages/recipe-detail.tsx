import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRoute, Link } from "wouter";
import { getRecipeBySlug, recipes } from "../data/recipes";
import { isRecipeSaved, saveRecipe, unsaveRecipe } from "../lib/storage";
import { Bookmark, Clock, Flame, Utensils, Droplets, Minus, Plus, ChevronLeft, ChefHat, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale";
import { parseQtyNum, convertUnit, localizeTemp } from "@/lib/unit-convert";

function SpiceLevel({ level }: { level: number }) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3].map(i => (
        <span key={i} className={`w-2.5 h-2.5 rounded-full inline-block transition-colors ${i <= level ? "bg-red-500" : "bg-white/15"}`} />
      ))}
    </div>
  );
}

function UmamiLevel({ level }: { level: number }) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3].map(i => (
        <span key={i} className={`w-2.5 h-2.5 rounded-full inline-block transition-colors ${i <= level ? "bg-amber-500" : "bg-white/15"}`} />
      ))}
    </div>
  );
}

function parseFraction(qty: string): number | null {
  const n = parseQtyNum(qty);
  return isNaN(n) || n === 0 && qty.trim() !== "0" ? null : n;
}

function decimalToFraction(val: number): string {
  if (val === 0) return "0";
  const denominators = [1, 2, 3, 4, 8];
  let bestNum = Math.round(val);
  let bestDen = 1;
  let bestErr = Math.abs(val - bestNum);
  for (const den of denominators) {
    const num = Math.round(val * den);
    const err = Math.abs(val - num / den);
    if (err < bestErr - 0.001) { bestErr = err; bestNum = num; bestDen = den; }
  }
  if (bestDen === 1) return bestNum.toString();
  const whole = Math.floor(bestNum / bestDen);
  const rem = bestNum % bestDen;
  if (whole > 0 && rem > 0) return `${whole} ${rem}/${bestDen}`;
  if (rem === 0) return whole.toString();
  return `${rem}/${bestDen}`;
}

function scaleQtyStr(qty: string, ratio: number): string {
  const num = parseFraction(qty);
  if (num === null) return qty;
  return decimalToFraction(num * ratio);
}

/** Returns the translated difficulty label */
function localeDifficulty(
  difficulty: string,
  t: (k: Parameters<ReturnType<typeof useLocale>["t"]>[0]) => string,
): string {
  const d = difficulty.toLowerCase();
  if (d === "easy") return t("difficulty.easy");
  if (d === "medium") return t("difficulty.medium");
  if (d === "advanced" || d === "hard") return t("difficulty.advanced");
  return difficulty;
}

export function RecipeDetail() {
  const [match, params] = useRoute("/recipe/:slug");
  const slug = params?.slug;
  const recipe = slug ? getRecipeBySlug(slug) : undefined;
  const { t, unitSystem } = useLocale();

  const [saved, setSaved] = useState(false);
  const [servings, setServings] = useState<number>(1);

  useEffect(() => {
    if (recipe) {
      setSaved(isRecipeSaved(recipe.slug));
      setServings(recipe.servings);
      window.scrollTo(0, 0);
    }
  }, [recipe]);

  if (!match) return null;

  if (!recipe) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-display text-4xl mb-4">{t("recipe.notFound")}</h1>
        <Link href="/recipes" className="text-primary hover:underline">{t("recipe.returnCollection")}</Link>
      </div>
    );
  }

  const toggleSave = () => {
    if (saved) { unsaveRecipe(recipe.slug); setSaved(false); }
    else { saveRecipe(recipe.slug); setSaved(true); }
  };

  const ratio = recipe ? servings / recipe.servings : 1;

  /** Convert a single ingredient qty+unit for display */
  function displayIngredient(qty: string, unit: string): { qty: string; unit: string } {
    const num = parseFraction(qty);
    if (num === null) return { qty, unit }; // "to taste", "a pinch", etc.
    const scaled = num * ratio;
    return convertUnit(scaled, unit, unitSystem);
  }

  const related = recipes
    .filter(r => r.slug !== recipe.slug && r.category === recipe.category)
    .slice(0, 3);
  const fallbackRelated = recipes
    .filter(r => r.slug !== recipe.slug)
    .slice(0, 3 - related.length);
  const relatedRecipes = [...related, ...fallbackRelated].slice(0, 3);

  const feedsLabel = servings === 1 ? t("recipe.feedsPerson") : t("recipe.feedsPeople", { n: servings });

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-20 md:pb-24 w-full relative"
    >
      {/* Print View (Hidden on Screen) */}
      <div className="hidden print:block mb-8 pb-8 border-b">
        <h1 className="font-display text-4xl mb-4 font-bold">{recipe.title}</h1>
        <p className="text-xl mb-6">{t("common.serves")}: {servings}</p>

        <h2 className="text-2xl font-bold mb-4">{t("recipe.ingredients")}</h2>
        <ul className="mb-8 list-none p-0">
          {recipe.ingredients.map((ing, i) => {
            const disp = displayIngredient(ing.qty, ing.unit);
            return (
              <li key={i} className="mb-2 text-lg">
                <strong>{disp.qty} {disp.unit}</strong> {ing.item}
                {ing.note && <span> ({ing.note})</span>}
              </li>
            );
          })}
        </ul>

        <h2 className="text-2xl font-bold mb-4">{t("recipe.method")}</h2>
        <div className="mb-8">
          {recipe.method.map((step) => (
            <div key={step.step} className="mb-4 method-step text-lg flex gap-4">
              <div className="font-bold">{step.step}.</div>
              <div>{localizeTemp(step.text, unitSystem)}</div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-2">{t("recipe.chefNotes")}</h2>
        <p className="italic text-lg mb-4">{recipe.chefNotes}</p>
      </div>

      {/* Hero */}
      <section className="relative w-full h-[60vh] md:h-[80vh] min-h-[380px] flex items-end">
        <Link
          href="/recipes"
          data-testid="link-back-to-recipes"
          className="absolute top-4 md:top-6 left-4 md:left-6 z-30 p-2.5 md:p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:text-primary transition-colors flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-xs uppercase tracking-widest hidden md:inline">{t("recipe.back")}</span>
        </Link>

        <div className="absolute inset-0 z-0">
          <img src={recipe.heroImage} alt={recipe.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="relative z-10 px-5 md:px-12 pb-10 md:pb-12 w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div className="max-w-3xl flex-1">
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="text-xs uppercase tracking-widest px-3 py-1 border border-primary text-primary rounded-full bg-black/50">
                {recipe.category}
              </span>
              {recipe.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs uppercase tracking-widest px-3 py-1 border border-white/20 text-white rounded-full bg-black/50">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-none text-white mb-3">
              {recipe.title}
            </h1>
            <p className="text-base md:text-xl text-white/80 font-light italic font-display">
              {recipe.origin}
            </p>
          </div>

          <div className="flex gap-3 mt-6 md:mt-0">
            <Button
              onClick={() => window.print()}
              size="lg"
              variant="outline"
              className="shrink-0 border-white/20 bg-black/40 backdrop-blur-md h-12 md:h-14 px-6 md:px-8 text-xs tracking-widest uppercase transition-all text-white hover:text-primary hover:border-primary/50"
            >
              <Printer className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
              {t("recipe.printList")}
            </Button>
            <Button
              onClick={toggleSave}
              data-testid="button-save-detail"
              size="lg"
              variant="outline"
              className={`shrink-0 border-white/20 bg-black/40 backdrop-blur-md h-12 md:h-14 px-6 md:px-8 text-xs tracking-widest uppercase transition-all ${
                saved ? "text-primary border-primary bg-primary/10" : "text-white hover:text-primary hover:border-primary/50"
              }`}
            >
              <Bookmark className={`w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 ${saved ? "fill-primary" : ""}`} />
              {saved ? t("recipe.saved") : t("recipe.saveRecipe")}
            </Button>
          </div>
        </div>
      </section>

      {/* Sticky Meta Bar */}
      <section className="border-y border-white/5 bg-background/80 backdrop-blur-sm sticky top-0 md:top-16 lg:top-20 z-40">
        <div className="max-w-7xl mx-auto px-5 md:px-12 py-3 md:py-4 flex gap-4 md:gap-8 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <div>
              <div className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest">{t("recipe.prepCook")}</div>
              <div className="text-xs md:text-sm font-medium whitespace-nowrap">{recipe.prepTime} / {recipe.cookTime}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Utensils className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <div>
              <div className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest">{t("recipe.difficulty")}</div>
              <div className="text-xs md:text-sm font-medium">{localeDifficulty(recipe.difficulty, t)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Flame className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <div>
              <div className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest">{t("recipe.spice")}</div>
              <div className="text-xs md:text-sm font-medium pt-0.5"><SpiceLevel level={recipe.spiceLevel} /></div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <Droplets className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <div>
              <div className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest">{t("recipe.umami")}</div>
              <div className="text-xs md:text-sm font-medium pt-0.5"><UmamiLevel level={recipe.umamiLevel} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-5 md:px-12 pt-12 md:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 xl:gap-24">

        {/* Sidebar: Story & Ingredients */}
        <div className="lg:col-span-4 flex flex-col gap-10 md:gap-12">
          {/* Story */}
          <div>
            <h3 className="font-display text-2xl md:text-3xl mb-4 text-primary">{t("recipe.story")}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{recipe.story}</p>
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <h3 className="font-display text-2xl md:text-3xl text-primary">{t("recipe.ingredients")}</h3>
              {/* Servings Scaler */}
              <div className="flex items-center gap-2 bg-secondary rounded-full p-1 border border-white/5">
                <button
                  onClick={() => setServings(s => Math.max(1, s - 1))}
                  data-testid="button-scaler-minus"
                  aria-label="Decrease servings"
                  className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs w-24 text-center font-medium leading-tight">
                  {servings} {servings === 1 ? t("recipe.serving") : t("recipe.servings")}
                  <span className="block text-[10px] text-muted-foreground font-normal">{feedsLabel}</span>
                </span>
                <button
                  onClick={() => setServings(s => Math.min(20, s + 1))}
                  data-testid="button-scaler-plus"
                  aria-label="Increase servings"
                  className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Unit system badge */}
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {unitSystem === "imperial" ? "Imperial (oz · lb · cups · °F)" : "Métrico (g · kg · ml · °C)"}
              </span>
            </div>

            <ul className="flex flex-col gap-3 md:gap-4">
              {recipe.ingredients.map((ing, i) => {
                const disp = displayIngredient(ing.qty, ing.unit);
                return (
                  <li key={i} className="flex gap-3 md:gap-4 items-start text-sm">
                    <span className="text-primary font-medium w-20 shrink-0 text-right leading-relaxed">
                      {disp.qty}{disp.unit ? " " + disp.unit : ""}
                    </span>
                    <span className="text-foreground leading-relaxed">
                      {ing.item}
                      {ing.note && <span className="text-muted-foreground italic"> ({ing.note})</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Main: Method */}
        <div className="lg:col-span-8">
          <h3 className="font-display text-3xl md:text-4xl mb-8 md:mb-10 text-primary border-b border-white/5 pb-4">
            {t("recipe.method")}
          </h3>
          <div className="flex flex-col gap-10 md:gap-12">
            {recipe.method.map((step) => (
              <div key={step.step} className="flex gap-5 md:gap-8">
                <div className="font-display text-4xl md:text-5xl lg:text-6xl text-white/10 select-none shrink-0 w-10 md:w-12">
                  {String(step.step).padStart(2, "0")}
                </div>
                <div className="pt-1 md:pt-3 text-base md:text-lg text-muted-foreground leading-relaxed">
                  {localizeTemp(step.text, unitSystem)}
                </div>
              </div>
            ))}
          </div>

          {/* Chef Notes & Pairing */}
          <div className="mt-16 md:mt-20 p-6 md:p-10 border border-primary/20 bg-primary/5 rounded-2xl">
            <h4 className="font-display text-xl md:text-2xl text-primary mb-5 flex items-center gap-3">
              <ChefHat className="w-5 h-5 md:w-6 md:h-6" />
              {t("recipe.chefNotes")}
            </h4>
            <p className="text-muted-foreground leading-relaxed mb-6 font-display italic text-base md:text-lg">
              "{recipe.chefNotes}"
            </p>
            <div className="pt-6 border-t border-primary/10">
              <div className="text-xs uppercase tracking-widest text-primary mb-2">{t("recipe.pairing")}</div>
              <p className="text-foreground text-base md:text-lg">{recipe.pairing}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Recipes */}
      {relatedRecipes.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-12 mt-20 md:mt-24 pt-12 border-t border-white/5">
          <h3 className="font-display text-3xl md:text-4xl mb-8 md:mb-10 text-foreground">{t("recipe.relatedTitle")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {relatedRecipes.map((r) => (
              <Link
                key={r.slug}
                href={`/recipe/${r.slug}`}
                data-testid={`link-related-${r.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/5 mb-4">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10" />
                  <img
                    src={r.thumbImage}
                    alt={r.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="text-xs tracking-widest text-primary uppercase mb-2">{r.category}</div>
                <h4 className="font-display text-xl text-foreground group-hover:text-primary transition-colors leading-tight">{r.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}
    </motion.article>
  );
}
