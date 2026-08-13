import type { Ingredient, Recipe, Unit } from "@/data/recipes";
import type { Locale } from "@/i18n";
import { scaledIngredientText } from "@/lib/scaling";
import { ingredientQuery } from "@/lib/shopping";

type InstacartMode = "recipe" | "list";

type InstacartLineItem = {
  name: string;
  displayText: string;
  quantity?: number;
  unit?: string;
};

type InstacartRequest = {
  mode: InstacartMode;
  title: string;
  servings?: number;
  cookingTime?: number;
  externalReferenceId?: string;
  instructions?: string[];
  ingredients: InstacartLineItem[];
  partnerLinkbackUrl?: string;
};

const INSTACART_UNITS: Partial<Record<Unit, string>> = {
  g: "gram",
  kg: "kilogram",
  ml: "milliliter",
  l: "liter",
  tsp: "teaspoon",
  tbsp: "tablespoon",
  cup: "cup",
  piece: "each",
};

const ENDPOINT = "/api/instacart-shopping-list";

export class InstacartLinkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InstacartLinkError";
  }
}

function safeHttpsUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    const allowedHost = url.hostname === "instacart.com" || url.hostname.endsWith(".instacart.com");
    return url.protocol === "https:" && allowedHost ? url.toString() : null;
  } catch {
    return null;
  }
}

async function requestInstacartLink(payload: InstacartRequest, csrfToken: string): Promise<string> {
  const serialized = JSON.stringify(payload);

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
      body: serialized,
      credentials: "same-origin",
      cache: "no-store",
    });
  } catch {
    throw new InstacartLinkError("Could not reach the shopping service.");
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : "Could not create the Instacart shopping page.";
    throw new InstacartLinkError(message);
  }

  const url =
    data && typeof data === "object" && "url" in data
      ? safeHttpsUrl(data.url)
      : null;
  if (!url) {
    throw new InstacartLinkError("The shopping service returned an invalid link.");
  }

  return url;
}

function toLineItem(
  ingredient: Ingredient,
  locale: Locale,
  multiplier: number,
): InstacartLineItem {
  const quantity =
    typeof ingredient.amount === "number" && ingredient.amount > 0
      ? ingredient.amount * multiplier
      : undefined;
  const unit = ingredient.unit ? INSTACART_UNITS[ingredient.unit] : undefined;

  return {
    name: ingredientQuery(ingredient),
    displayText: scaledIngredientText(ingredient, multiplier, locale),
    ...(quantity !== undefined && unit ? { quantity, unit } : {}),
  };
}

export async function createInstacartRecipeLink({
  recipe,
  ingredients,
  locale,
  servings,
  partnerLinkbackUrl,
  csrfToken,
}: {
  recipe: Recipe;
  ingredients: Ingredient[];
  locale: Locale;
  servings: number;
  partnerLinkbackUrl?: string;
  csrfToken: string;
}): Promise<string> {
  const multiplier = servings / recipe.serves;
  return requestInstacartLink({
    mode: "recipe",
    title: recipe.title[locale],
    servings,
    cookingTime: recipe.prepMinutes + recipe.cookMinutes,
    externalReferenceId: `${recipe.slug}:${servings}`,
    instructions: recipe.method[locale],
    ingredients: ingredients.map((ingredient) =>
      toLineItem(ingredient, locale, multiplier),
    ),
    partnerLinkbackUrl,
  }, csrfToken);
}

export async function createInstacartShoppingListLink({
  title,
  ingredients,
  partnerLinkbackUrl,
  csrfToken,
}: {
  title: string;
  ingredients: Array<{ name: string; displayText?: string }>;
  partnerLinkbackUrl?: string;
  csrfToken: string;
}): Promise<string> {
  return requestInstacartLink({
    mode: "list",
    title,
    ingredients: ingredients.map((ingredient) => ({
      name: ingredient.name,
      displayText: ingredient.displayText ?? ingredient.name,
    })),
    partnerLinkbackUrl,
  }, csrfToken);
}
