import { recipes, findRecipeBySlug, findRelatedRecipes, type Recipe } from "./recipes";
import { BREAKFAST_RECIPES } from "./breakfast";
import { localDayOfYear } from "@/lib/date";

/* Daily rotation over the verified signature collection. The previous version
   filled the year with 356 generated drafts and reused generic photographs for
   unrelated recipe names — replaced by a small curated set with real
   photography (see git history). "Today's Recipe" on the home page rotates
   this curated set only, so it keeps the premium photography.

   The 365-day breakfast collection (src/data/breakfast.ts) is a separate,
   genuinely one-per-calendar-day rotation — see breakfastForDate below — and
   is folded into allRecipesForCalendar() so it participates in the
   breakfast meal row, recipe listing/filters, planner, and search like any
   other recipe. */

const TOTAL = recipes.length;
const ALL: Recipe[] = [...recipes, ...BREAKFAST_RECIPES];

export function recipeForCalendarIndex(index: number): Recipe {
  const i = ((index % TOTAL) + TOTAL) % TOTAL;
  return recipes[i];
}

export function recipeForDate(d: Date = new Date()): Recipe {
  return recipeForCalendarIndex(localDayOfYear(d) - 1);
}

/** The day's dedicated fusion breakfast — one distinct recipe per day of year. */
export function breakfastForCalendarIndex(index: number): Recipe {
  const i = ((index % BREAKFAST_RECIPES.length) + BREAKFAST_RECIPES.length) % BREAKFAST_RECIPES.length;
  return BREAKFAST_RECIPES[i];
}

export function breakfastForDate(d: Date = new Date()): Recipe {
  return breakfastForCalendarIndex(localDayOfYear(d) - 1);
}

export function allRecipesForCalendar(): Recipe[] {
  return ALL;
}

/** Slug lookup across curated + breakfast recipes — what recipe detail pages
 *  and anything reachable from a /recipe/:slug route should use, since a
 *  slug may belong to either collection. */
export function anyRecipeBySlug(slug: string): Recipe | undefined {
  return findRecipeBySlug(ALL, slug);
}

export function anyRelatedRecipes(slug: string, limit = 3): Recipe[] {
  return findRelatedRecipes(ALL, slug, limit);
}

export const CALENDAR_LENGTH = ALL.length;
