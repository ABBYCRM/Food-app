import { recipes, type Recipe } from "./recipes";
import { generateRecipe } from "./generator";

/* 365-day rotating calendar. Slots 1..N are hand-crafted hero recipes; remaining
   slots are deterministically generated. We retry generation with a salted seed if
   a slug would collide with an earlier day — so no plate repeats inside the year. */

const TOTAL = 365;

const cached: (Recipe | null)[] = new Array(TOTAL).fill(null);
const slugsByIndex: Map<number, string> = new Map();
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
  let r = cached[i];
  if (!r) {
    r = build(i);
    cached[i] = r;
    slugsByIndex.set(i, r.slug);
    allSlugs.add(r.slug);
  }
  return r;
}

export function recipeForDate(d: Date = new Date()): Recipe {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000); // 1..365/366
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

export const CALENDAR_LENGTH = TOTAL;
