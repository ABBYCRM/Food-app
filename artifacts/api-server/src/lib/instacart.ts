/** Composio-backed Instacart service. Instacart is a NO_AUTH toolkit, but every
 * execution is still tagged with a server-derived Mestizo user ID and cached
 * per user so browser input can never select another tenant. */
import { createHash } from "node:crypto";
import type { AuthConfig } from "./config-auth.js";

const TOOL_VERSION = "20260618_00";
const TOOL_CREATE_RECIPE = "INSTACART_CREATE_RECIPE_PAGE";
const TOOL_CREATE_LIST = "INSTACART_CREATE_SHOPPING_LIST_PAGE";
const TOOL_NEARBY_RETAILERS = "INSTACART_GET_NEARBY_RETAILERS";

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

export interface InstacartRetailer {
  key: string;
  name: string;
  logoUrl: string | null;
}

const COMPOSIO_UNITS: Record<string, string> = {
  cup: "cup",
  cups: "cup",
  milliliter: "ml",
  milliliters: "ml",
  ml: "ml",
  liter: "L",
  liters: "L",
  l: "L",
  tablespoon: "tbsp",
  tablespoons: "tbsp",
  tbsp: "tbsp",
  teaspoon: "tsp",
  teaspoons: "tsp",
  tsp: "tsp",
  gram: "g",
  grams: "g",
  g: "g",
  kilogram: "kg",
  kilograms: "kg",
  kg: "kg",
  ounce: "oz",
  ounces: "oz",
  oz: "oz",
  pound: "lb",
  pounds: "lb",
  lb: "lb",
  lbs: "lb",
  each: "each",
  bunch: "bunch",
  bunches: "bunch",
  can: "can",
  cans: "can",
  ear: "each",
  ears: "each",
  head: "each",
  heads: "each",
  package: "each",
  packages: "each",
  pack: "each",
  packs: "each",
  packet: "each",
  packets: "each",
  clove: "each",
  cloves: "each",
  slice: "each",
  slices: "each",
  sheet: "each",
  sheets: "each",
  piece: "each",
  pieces: "each",
  portion: "each",
  portions: "each",
  block: "each",
  blocks: "each",
  stick: "each",
  sticks: "each",
  box: "each",
  boxes: "each",
  bundle: "each",
  bundles: "each",
};

export function normalizeComposioUnit(unit: string | undefined): string | undefined {
  if (!unit) return undefined;
  return COMPOSIO_UNITS[unit.trim().toLowerCase()];
}

function ingredientPayload(ingredient: InstacartIngredient) {
  const unit = normalizeComposioUnit(ingredient.unit);
  return {
    name: ingredient.name,
    ...(ingredient.quantity ? { quantity: ingredient.quantity } : {}),
    ...(unit ? { unit } : {}),
    ...(ingredient.displayText ? { display_text: ingredient.displayText } : {}),
  };
}

export function buildInstacartRequest(input: InstacartInput) {
  if (input.mode === "recipe") {
    return {
      toolSlug: TOOL_CREATE_RECIPE,
      arguments: {
        title: input.title,
        author: "Mestizo Umami",
        expires_in: 365,
        ...(input.servings ? { servings: input.servings } : {}),
        ...(input.instructions?.length ? { instructions: input.instructions.join("\n\n") } : {}),
        ingredients: input.ingredients.map(ingredientPayload),
      },
    };
  }

  return {
    toolSlug: TOOL_CREATE_LIST,
    arguments: {
      title: input.title,
      expires_in: 365,
      line_items: input.ingredients.map(({ displayText: _displayText, ...ingredient }) =>
        ingredientPayload(ingredient)
      ),
    },
  };
}

export function requestHash(input: InstacartInput): string {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

export function safeProductsLink(value: unknown): string {
  try {
    if (typeof value !== "string") throw new Error("Missing URL");
    const url = new URL(value);
    const hostOk = url.hostname === "instacart.com"
      || url.hostname.endsWith(".instacart.com")
      || url.hostname === "instacart.tools"
      || url.hostname.endsWith(".instacart.tools");
    if (url.protocol !== "https:" || !hostOk) throw new Error("Invalid URL");
    return url.toString();
  } catch {
    const err = new Error("Instacart returned an invalid shopping link");
    (err as Error & { statusCode: number }).statusCode = 502;
    throw err;
  }
}

function safeLogoUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

interface ComposioResponse {
  successful?: boolean;
  data?: unknown;
  error?: unknown;
}

export function createInstacartService(config: AuthConfig) {
  if (!config.composio) return null;
  const { apiKey, apiBaseUrl } = config.composio;

  async function executeTool(
    userId: string,
    toolSlug: string,
    args: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch(`${apiBaseUrl}/tools/execute/${toolSlug}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          user_id: `mestizo-${userId}`,
          version: TOOL_VERSION,
          arguments: args,
        }),
        signal: controller.signal,
      });
      const body = await response.json().catch(() => null) as ComposioResponse | null;
      const validData = body?.data
        && typeof body.data === "object"
        && !Array.isArray(body.data);
      if (!response.ok || body?.successful !== true || !validData) {
        const message = response.status === 429
          ? "Instacart is receiving too many requests. Please try again."
          : "Instacart could not complete this request.";
        const error = new Error(message);
        (error as Error & { statusCode: number }).statusCode = response.status === 429 ? 429 : 502;
        throw error;
      }
      return body.data as Record<string, unknown>;
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        const timeoutError = new Error("Instacart took too long to respond. Please try again.");
        (timeoutError as Error & { statusCode: number }).statusCode = 504;
        throw timeoutError;
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  return Object.freeze({
    async createShoppingPage(userId: string, input: InstacartInput): Promise<string> {
      const request = buildInstacartRequest(input);
      const data = await executeTool(userId, request.toolSlug, request.arguments);
      return safeProductsLink(data["url"] as string);
    },

    async getNearbyRetailers(
      userId: string,
      postalCode: string,
      countryCode: "US" | "CA",
    ): Promise<InstacartRetailer[]> {
      const data = await executeTool(userId, TOOL_NEARBY_RETAILERS, {
        postal_code: postalCode,
        country_code: countryCode,
      });
      const retailers = Array.isArray(data["retailers"]) ? data["retailers"] : [];
      return retailers.flatMap((value) => {
        if (!value || typeof value !== "object") return [];
        const retailer = value as Record<string, unknown>;
        const key = retailer["retailer_key"];
        const name = retailer["retailer_name"] ?? retailer["name"];
        if (typeof key !== "string" || typeof name !== "string") return [];
        return [{
          key,
          name,
          logoUrl: safeLogoUrl(retailer["retailer_logo_url"]),
        }];
      });
    },
  });
}

export type InstacartService = NonNullable<ReturnType<typeof createInstacartService>>;
