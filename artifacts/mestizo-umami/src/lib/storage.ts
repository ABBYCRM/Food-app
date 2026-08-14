// Local storage keys
const SAVED_RECIPES_KEY = "mestizo_umami_saved_recipes";
const MEAL_PLAN_KEY = "mestizo_umami_meal_plan";

export interface MealPlanSlot {
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snack?: string;
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
