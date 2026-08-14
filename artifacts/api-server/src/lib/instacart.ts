/**
 * Instacart Developer Platform service.
 * Ported faithfully from server/instacart.js.
 */
import { createHash } from "node:crypto";
import type { AuthConfig } from "./config-auth.js";

const SUPPORTED_UNITS = new Set([
  "cup", "milliliter", "liter", "tablespoon", "teaspoon",
  "gram", "kilogram", "ounce", "pound",
  "each", "bunch", "can", "ears", "head", "package", "packet",
]);

interface InstacartIngredient {
  name: string;
  displayText?: string;
  quantity?: number;
  unit?: string;
}

interface InstacartListInput {
  mode: "list";
  title: string;
  ingredients: InstacartIngredient[];
  partnerLinkbackUrl?: string;
}

interface InstacartRecipeInput {
  mode: "recipe";
  title: string;
  ingredients: InstacartIngredient[];
  servings?: number;
  cookingTime?: number;
  externalReferenceId?: string;
  instructions?: string[];
  partnerLinkbackUrl?: string;
}

export type InstacartInput = InstacartListInput | InstacartRecipeInput;

function linkback(value: string | undefined, config: AuthConfig): string | undefined {
  if (!value) return undefined;
  const url = new URL(value);
  if (url.origin !== new URL(config.publicBaseUrl).origin) {
    const err = new Error("Shopping linkback must use this application's origin");
    (err as Error & { statusCode: number }).statusCode = 400;
    throw err;
  }
  url.username = "";
  url.password = "";
  url.hash = "";
  return url.toString();
}

function ingredientPayload(ingredient: InstacartIngredient, measurementKey: string) {
  const measurement = ingredient.quantity && ingredient.unit
    ? { quantity: ingredient.quantity, unit: ingredient.unit }
    : null;
  if (measurement && !SUPPORTED_UNITS.has(measurement.unit)) {
    throw new Error("Unsupported Instacart measurement unit");
  }
  return {
    name: ingredient.name,
    ...(ingredient.displayText ? { display_text: ingredient.displayText } : {}),
    ...(measurement ? { [measurementKey]: [measurement] } : {}),
  };
}

export function buildInstacartRequest(input: InstacartInput, config: AuthConfig) {
  const partnerLinkbackUrl = linkback(input.partnerLinkbackUrl, config);
  const landingPageConfig  = partnerLinkbackUrl
    ? { partner_linkback_url: partnerLinkbackUrl }
    : undefined;

  if (input.mode === "recipe") {
    return {
      path: "/idp/v1/products/recipe",
      payload: {
        title: input.title,
        author: "Mestizo Umami",
        content_creator_credit_info: "Mestizo Umami",
        expires_in: 365,
        ...(input.servings         ? { servings: input.servings }                    : {}),
        ...(input.cookingTime      ? { cooking_time: input.cookingTime }              : {}),
        ...(input.externalReferenceId ? { external_reference_id: input.externalReferenceId } : {}),
        ...(input.instructions?.length ? { instructions: input.instructions }         : {}),
        ingredients: input.ingredients.map((i) => ingredientPayload(i, "measurements")),
        landing_page_configuration: { ...(landingPageConfig ?? {}), enable_pantry_items: true },
      },
    };
  }

  return {
    path: "/idp/v1/products/products_link",
    payload: {
      title: input.title,
      link_type: "shopping_list",
      expires_in: 365,
      line_items: input.ingredients.map((i) => ingredientPayload(i, "line_item_measurements")),
      ...(landingPageConfig ? { landing_page_configuration: landingPageConfig } : {}),
    },
  };
}

export function requestHash(input: InstacartInput): string {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

function safeProductsLink(value: string): string {
  const url = new URL(value);
  const hostOk = url.hostname === "instacart.com" || url.hostname.endsWith(".instacart.com");
  if (url.protocol !== "https:" || !hostOk) {
    const err = new Error("Instacart returned an invalid shopping link");
    (err as Error & { statusCode: number }).statusCode = 502;
    throw err;
  }
  return url.toString();
}

export function createInstacartService(config: AuthConfig) {
  if (!config.instacart) return null;
  const { apiKey, apiBaseUrl } = config.instacart;

  return Object.freeze({
    async createShoppingPage(input: InstacartInput): Promise<string> {
      const request    = buildInstacartRequest(input, config);
      const controller = new AbortController();
      const timeout    = setTimeout(() => controller.abort(), 10_000);
      try {
        const response = await fetch(`${apiBaseUrl}${request.path}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request.payload),
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null) as Record<string, unknown> | null;
        if (!response.ok) {
          const msg = response.status === 429
            ? "Instacart is receiving too many requests. Please try again."
            : "Instacart could not create the shopping page.";
          const err = new Error(msg);
          (err as Error & { statusCode: number }).statusCode = response.status === 429 ? 429 : 502;
          throw err;
        }
        return safeProductsLink(data?.["products_link_url"] as string);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          const e = new Error("Instacart took too long to respond. Please try again.");
          (e as Error & { statusCode: number }).statusCode = 504;
          throw e;
        }
        throw err;
      } finally {
        clearTimeout(timeout);
      }
    },
  });
}

export type InstacartService = NonNullable<ReturnType<typeof createInstacartService>>;
