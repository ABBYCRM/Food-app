import { recipes, type Recipe } from "./recipes";
import { localDayOfYear } from "@/lib/date";

/* Daily rotation over the verified signature collection. The previous version
   filled the year with 356 generated drafts and reused generic photographs for
   unrelated recipe names. Only editorially complete recipes are public now. */

const TOTAL = recipes.length;

export function recipeForCalendarIndex(index: number): Recipe {
  const i = ((index % TOTAL) + TOTAL) % TOTAL;
  return recipes[i];
}

export function recipeForDate(d: Date = new Date()): Recipe {
  return recipeForCalendarIndex(localDayOfYear(d) - 1);
}

export function allRecipesForCalendar(): Recipe[] {
  return recipes;
}

export const CALENDAR_LENGTH = TOTAL;
