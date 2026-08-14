// Local storage keys
const SAVED_RECIPES_KEY = "mestizo_umami_saved_recipes";
const MEAL_PLAN_KEY = "mestizo_umami_meal_plan";
const PLAN_HISTORY_KEY = "mestizo_umami_plan_history";

export interface MealPlanSlot {
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snack?: string;
  [key: string]: string | undefined;
}

export type MealPlan = Record<string, MealPlanSlot>;

export function getSavedRecipes(): string[] {
  try {
    const data = localStorage.getItem(SAVED_RECIPES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

export function saveRecipe(slug: string): void {
  const saved = new Set(getSavedRecipes());
  saved.add(slug);
  localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(Array.from(saved)));
  window.dispatchEvent(new Event('storage-update'));
}

export function unsaveRecipe(slug: string): void {
  const saved = new Set(getSavedRecipes());
  saved.delete(slug);
  localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(Array.from(saved)));
  window.dispatchEvent(new Event('storage-update'));
}

export function isRecipeSaved(slug: string): boolean {
  const saved = getSavedRecipes();
  return saved.includes(slug);
}

export function getMealPlan(): MealPlan {
  try {
    const data = localStorage.getItem(MEAL_PLAN_KEY);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    return {};
  }
}

export function setMealPlanSlot(day: string, slot: string, slug: string | null): void {
  const plan = getMealPlan();
  if (!plan[day]) plan[day] = {};
  
  if (slug === null) {
    delete (plan[day] as any)[slot];
  } else {
    (plan[day] as any)[slot] = slug;
  }
  
  localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(plan));
  window.dispatchEvent(new Event('storage-update'));
}

export function saveMealPlan(plan: MealPlan): void {
  localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(plan));
  window.dispatchEvent(new Event('storage-update'));
}

export interface HistoryEntry {
  slug: string;
  usedAt: string; // ISO date string
}

export function getPlanHistory(): HistoryEntry[] {
  try {
    const data = localStorage.getItem(PLAN_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToHistory(slugs: string[]): void {
  const now = new Date().toISOString();
  const existing = getPlanHistory();
  const newEntries: HistoryEntry[] = slugs.map(slug => ({ slug, usedAt: now }));
  // Keep last 180 days only to prevent unbounded growth
  const cutoff = Date.now() - 180 * 24 * 60 * 60 * 1000;
  const trimmed = existing.filter(e => new Date(e.usedAt).getTime() > cutoff);
  localStorage.setItem(PLAN_HISTORY_KEY, JSON.stringify([...trimmed, ...newEntries]));
}

export function getRecentSlugs(days: number): Set<string> {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const history = getPlanHistory();
  return new Set(history.filter(e => new Date(e.usedAt).getTime() > cutoff).map(e => e.slug));
}
