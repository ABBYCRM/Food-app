import { recipes, type Recipe } from "./recipes";
import { generateRecipe } from "./generator";

/* 365-day rotating calendar. Slots 1..N are hand-crafted hero recipes; remaining
   slots are deterministically generated. We retry generation with a salted seed if
   a slug would collide with an earlier day — so no plate repeats inside the year. */

const TOTAL = 365;

const cached: (Recipe | null)[] = new Array(TOTAL).fill(null);
const allSlugs: Set<string> = new Set();

function build(index: number): Recipe {
  if (index < recipes.length) return recipes[index];
  // Try up to 16 different salts before falling back to suffix-uniqueness.
  for (let salt = 0; salt < 16; salt++) {
    const r = generateRecipe(index + salt * 10007);
    if (!allSlugs.has(r.slug)) return r;
  }
  // Absolute last resort: suffix the slug with the index to force uniqueness.
  const r = generateRecipe(index);
  return { ...r, slug: `${r.slug}-d${index + 1}` };
}

export function recipeForCalendarIndex(index: number): Recipe {
  const i = ((index % TOTAL) + TOTAL) % TOTAL;
  // Always fill from day one through the requested day. Collision resolution
  // is therefore independent of navigation order and matches the SEO build.
  for (let cursor = 0; cursor <= i; cursor++) {
    if (cached[cursor]) continue;
    const recipe = build(cursor);
    cached[cursor] = recipe;
    allSlugs.add(recipe.slug);
  }
  return cached[i]!;
}

export function recipeForDate(d: Date = new Date()): Recipe {
  const year = d.getFullYear();
  const dayOfYear = Math.floor(
    (Date.UTC(year, d.getMonth(), d.getDate()) - Date.UTC(year, 0, 0)) / 86_400_000,
  ); // 1..365/366, independent of daylight-saving transitions
  return recipeForCalendarIndex(dayOfYear - 1);
}

let _all: Recipe[] | null = null;
export function allRecipesForCalendar(): Recipe[] {
  if (_all) return _all;
  const out: Recipe[] = [];
  for (let i = 0; i < TOTAL; i++) out.push(recipeForCalendarIndex(i));
  _all = out;
  return out;
}

export function relatedCalendarRecipes(current: Recipe, limit = 3): Recipe[] {
  return allRecipesForCalendar()
    .filter((recipe) => recipe.slug !== current.slug)
    .map((recipe) => ({
      recipe,
      score:
        (recipe.category === current.category ? 4 : 0)
        + (recipe.season === current.season ? 2 : 0)
        + recipe.meals.filter((meal) => current.meals.includes(meal)).length
        - Math.abs(recipe.spice - current.spice) * 0.5
        - Math.abs(recipe.umami - current.umami) * 0.5,
    }))
    .sort((left, right) => right.score - left.score || left.recipe.slug.localeCompare(right.recipe.slug))
    .slice(0, Math.max(0, limit))
    .map(({ recipe }) => recipe);
}

export const CALENDAR_LENGTH = TOTAL;
