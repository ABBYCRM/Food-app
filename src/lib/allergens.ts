import type { Allergen, Dietary, Recipe } from "@/data/recipes";

export const ALL_ALLERGENS: Allergen[] = [
  "nuts", "shellfish", "fish", "dairy", "egg", "gluten", "soy", "sesame", "pork", "alcohol",
];

export const ALL_DIETARY: Dietary[] = [
  "vegetarian", "vegan", "glutenFree", "dairyFree", "pescatarian", "pork",
];

export function recipeMatchesFilters(
  r: Recipe,
  avoiding: Set<Allergen>,
  requireDietary: Set<Dietary>,
): boolean {
  for (const a of avoiding) {
    if (r.allergens.includes(a)) return false;
  }
  for (const d of requireDietary) {
    if (d === "pork") {
      if (r.allergens.includes("pork")) return false;
      continue;
    }
    if (d === "dairyFree") {
      if (r.allergens.includes("dairy")) return false;
      continue;
    }
    if (d === "glutenFree") {
      if (r.allergens.includes("gluten")) return false;
      continue;
    }
    if (!r.dietary.includes(d)) return false;
  }
  return true;
}
