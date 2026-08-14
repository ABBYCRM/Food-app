import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRoute, Link } from "wouter";
import { getRecipeBySlug, recipes } from "../data/recipes";
import { isRecipeSaved, saveRecipe, unsaveRecipe } from "../lib/storage";
import { Bookmark, Clock, Flame, Utensils, Droplets, Minus, Plus, ChevronLeft, ChefHat, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale";
import { parseQtyNum, convertUnit, localizeTemp } from "@/lib/unit-convert";
import { PlatingGuide } from "@/components/plating-guide";

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
  const { t, unitSystem, locale } = useLocale();

  // Resolve locale-specific content, falling back to English fields
  const localeContent = recipe?.locales?.[locale as "es" | "pt"];
  const displayTitle = localeContent?.title ?? recipe?.title ?? "";
  const displaySubtitle = localeContent?.subtitle ?? recipe?.subtitle ?? "";
  const displayStory = localeContent?.story ?? recipe?.story ?? "";
  const displayChefNotes = localeContent?.chefNotes ?? recipe?.chefNotes ?? "";
  const displayMethod = localeContent?.method ?? recipe?.method ?? [];

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

  // ── Print handler ────────────────────────────────────────────────────────
  function printRecipe() {
    if (!recipe) return;
    const lang = locale === "en" ? "en" : locale === "es" ? "es" : "pt";

    const LABELS: Record<string, Record<string, string>> = {
      en: { ingredients: "Ingredients", method: "Method", notes: "Chef's Notes",
            pairing: "Suggested Pairing", serves: "Serves", prep: "Prep", cook: "Cook",
            difficulty: "Difficulty", spice: "Spice", umami: "Umami" },
      es: { ingredients: "Ingredientes", method: "Método", notes: "Notas del Chef",
            pairing: "Maridaje Sugerido", serves: "Porciones", prep: "Prep", cook: "Cocción",
            difficulty: "Dificultad", spice: "Picante", umami: "Umami" },
      pt: { ingredients: "Ingredientes", method: "Modo de Preparo", notes: "Notas do Chef",
            pairing: "Harmonização Sugerida", serves: "Porções", prep: "Prep", cook: "Cozimento",
            difficulty: "Dificuldade", spice: "Picância", umami: "Umami" },
    };
    const L = LABELS[lang] ?? LABELS.en;

    // Build ingredient rows (already unit-converted)
    const ingRows = recipe.ingredients.map((ing) => {
      const num = parseFraction(ing.qty);
      const disp = num !== null
        ? convertUnit(num * ratio, ing.unit, unitSystem)
        : { qty: ing.qty, unit: ing.unit };
      const note = ing.note ? `<span class="note">(${ing.note})</span>` : "";
      return `<li><span class="qty">${disp.qty}${disp.unit ? "&thinsp;" + disp.unit : ""}</span>${ing.item}${note}</li>`;
    }).join("\n");

    // Build method steps (temperature-localized, using active locale)
    const stepRows = displayMethod.map((step) => {
      const text = localizeTemp(step.text, unitSystem);
      return `<div class="step"><span class="step-num">${String(step.step).padStart(2, "0")}</span><p>${text}</p></div>`;
    }).join("\n");

    // Spice/umami dots
    const dots = (n: number, filled: string) =>
      [1, 2, 3].map(i => `<span class="dot ${i <= n ? "filled " + filled : ""}"></span>`).join("");

    const unitLabel = unitSystem === "imperial"
      ? "oz · lb · cup · °F"
      : "g · kg · ml · °C";

    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <title>Mestizo Umami — ${displayTitle}</title>
  <style>
    @page {
      size: letter portrait;
      margin: 0.70in 0.75in 0.80in 0.75in;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 11pt;
      line-height: 1.55;
      color: #111;
      background: #fff;
    }

    /* ── Header ─────────────────────────────── */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5pt solid #b45309;
      padding-bottom: 10pt;
      margin-bottom: 14pt;
    }
    .brand {
      font-family: Georgia, serif;
      font-size: 8.5pt;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #b45309;
      margin-bottom: 5pt;
    }
    .recipe-title {
      font-size: 22pt;
      font-weight: bold;
      line-height: 1.1;
      color: #111;
      letter-spacing: -0.01em;
    }
    .recipe-origin {
      font-size: 9.5pt;
      color: #777;
      font-style: italic;
      margin-top: 3pt;
    }

    /* ── Meta row ──────────────────────────── */
    .meta-row {
      display: flex;
      gap: 0;
      margin-bottom: 14pt;
      border: 1pt solid #e5d6c0;
      border-radius: 4pt;
      overflow: hidden;
    }
    .meta-cell {
      flex: 1;
      padding: 5pt 10pt;
      border-right: 1pt solid #e5d6c0;
    }
    .meta-cell:last-child { border-right: none; }
    .meta-label {
      font-family: Arial, sans-serif;
      font-size: 6.5pt;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #b45309;
      display: block;
      margin-bottom: 1.5pt;
    }
    .meta-value {
      font-size: 9.5pt;
      font-weight: bold;
      color: #222;
    }
    .dots { display: inline-flex; gap: 2pt; vertical-align: middle; }
    .dot { width: 6pt; height: 6pt; border-radius: 50%; border: 1pt solid #ccc; display: inline-block; }
    .dot.filled.red { background: #dc2626; border-color: #dc2626; }
    .dot.filled.amber { background: #b45309; border-color: #b45309; }

    /* ── Two-column body ────────────────────── */
    .body-columns {
      display: grid;
      grid-template-columns: 2.4in 1fr;
      column-gap: 22pt;
      margin-bottom: 14pt;
    }

    /* ── Section headings ───────────────────── */
    .section-heading {
      font-family: Arial, sans-serif;
      font-size: 7pt;
      letter-spacing: 0.20em;
      text-transform: uppercase;
      color: #b45309;
      border-bottom: 1pt solid #e5d6c0;
      padding-bottom: 4pt;
      margin-bottom: 9pt;
    }

    /* ── Ingredients ────────────────────────── */
    .ingredients-col {}
    .unit-note {
      font-size: 7pt;
      color: #aaa;
      font-family: Arial, sans-serif;
      margin-bottom: 8pt;
      letter-spacing: 0.06em;
    }
    .ingredients-col ul {
      list-style: none;
    }
    .ingredients-col li {
      display: flex;
      align-items: baseline;
      gap: 6pt;
      padding: 3.5pt 0;
      border-bottom: 0.5pt solid #f0ebe3;
      font-size: 10pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .qty {
      font-weight: bold;
      color: #b45309;
      min-width: 52pt;
      text-align: right;
      flex-shrink: 0;
      font-size: 9.5pt;
    }
    .note {
      font-size: 8pt;
      color: #999;
      font-style: italic;
      margin-left: 2pt;
    }

    /* ── Method ─────────────────────────────── */
    .method-col {}
    .step {
      display: grid;
      grid-template-columns: 18pt 1fr;
      gap: 8pt;
      margin-bottom: 10pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .step-num {
      font-size: 18pt;
      color: #e5d6c0;
      font-weight: bold;
      line-height: 1.1;
      font-family: Georgia, serif;
      padding-top: 1pt;
    }
    .step p {
      font-size: 10pt;
      line-height: 1.6;
      color: #333;
    }

    /* ── Chef's Notes ───────────────────────── */
    .notes-section {
      border-top: 1pt solid #e5d6c0;
      padding-top: 10pt;
      margin-top: 2pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .notes-section blockquote {
      font-style: italic;
      font-size: 10pt;
      color: #555;
      border-left: 2pt solid #b45309;
      padding-left: 10pt;
      margin: 6pt 0 8pt;
      line-height: 1.6;
    }
    .pairing-line {
      font-size: 9pt;
      color: #888;
    }
    .pairing-line strong {
      font-family: Arial, sans-serif;
      font-size: 6.5pt;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #b45309;
      display: block;
      margin-bottom: 2pt;
    }

    /* ── Footer ─────────────────────────────── */
    .page-footer {
      position: fixed;
      bottom: 0.35in;
      left: 0.75in;
      right: 0.75in;
      display: flex;
      justify-content: space-between;
      font-family: Arial, sans-serif;
      font-size: 7pt;
      color: #bbb;
      border-top: 0.5pt solid #e5d6c0;
      padding-top: 4pt;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <div class="page-header">
    <div>
      <div class="brand">Mestizo Umami</div>
      <div class="recipe-title">${displayTitle}</div>
      <div class="recipe-origin">${recipe.origin}</div>
    </div>
    <div style="text-align:right; padding-top:6pt;">
      <div class="meta-value" style="font-size:11pt; color:#b45309;">${servings}</div>
      <div class="meta-label" style="text-align:right;">${L.serves}</div>
    </div>
  </div>

  <div class="meta-row">
    <div class="meta-cell">
      <span class="meta-label">${L.prep}</span>
      <span class="meta-value">${recipe.prepTime}</span>
    </div>
    <div class="meta-cell">
      <span class="meta-label">${L.cook}</span>
      <span class="meta-value">${recipe.cookTime}</span>
    </div>
    <div class="meta-cell">
      <span class="meta-label">${L.difficulty}</span>
      <span class="meta-value">${recipe.difficulty}</span>
    </div>
    <div class="meta-cell">
      <span class="meta-label">${L.spice}</span>
      <span class="meta-value"><span class="dots">${dots(recipe.spiceLevel, "red")}</span></span>
    </div>
    <div class="meta-cell">
      <span class="meta-label">${L.umami}</span>
      <span class="meta-value"><span class="dots">${dots(recipe.umamiLevel, "amber")}</span></span>
    </div>
    <div class="meta-cell" style="flex:1.6;">
      <span class="meta-label">Units</span>
      <span class="meta-value" style="font-size:8.5pt; font-weight:normal; color:#888;">${unitLabel}</span>
    </div>
  </div>

  <div class="body-columns">
    <div class="ingredients-col">
      <div class="section-heading">${L.ingredients}</div>
      <ul>${ingRows}</ul>
    </div>
    <div class="method-col">
      <div class="section-heading">${L.method}</div>
      ${stepRows}
    </div>
  </div>

  <div class="notes-section">
    <div class="section-heading">${L.notes}</div>
    <blockquote>${displayChefNotes}</blockquote>
    <div class="pairing-line">
      <strong>${L.pairing}</strong>
      ${recipe.pairing}
    </div>
  </div>

  <div class="page-footer">
    <span>mestizo-umami.com</span>
    <span>${displayTitle}</span>
  </div>

  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`;

    const win = window.open("", "_blank", "width=900,height=700");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pb-20 md:pb-24 w-full relative"
    >
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
          <img src={recipe.heroImage} alt={displayTitle} className="w-full h-full object-cover" />
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
              {displayTitle}
            </h1>
            <p className="text-base md:text-xl text-white/80 font-light italic font-display">
              {recipe.origin}
            </p>
          </div>

          <div className="flex gap-3 mt-6 md:mt-0">
            <Button
              onClick={printRecipe}
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
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{displayStory}</p>
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
            {displayMethod.map((step) => (
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

          {/* Plating Guide */}
          <PlatingGuide method={displayMethod} recipeName={displayTitle} />

          {/* Chef Notes & Pairing */}
          <div className="mt-16 md:mt-20 p-6 md:p-10 border border-primary/20 bg-primary/5 rounded-2xl">
            <h4 className="font-display text-xl md:text-2xl text-primary mb-5 flex items-center gap-3">
              <ChefHat className="w-5 h-5 md:w-6 md:h-6" />
              {t("recipe.chefNotes")}
            </h4>
            <p className="text-muted-foreground leading-relaxed mb-6 font-display italic text-base md:text-lg">
              "{displayChefNotes}"
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
