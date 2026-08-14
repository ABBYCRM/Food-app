const supportedUnits = new Set([
  "cup", "milliliter", "liter", "tablespoon", "teaspoon", "gram", "kilogram",
  "ounce", "pound", "each", "bunch", "can", "ears", "head", "package", "packet",
]);

function linkback(value, config) {
  if (!value) return undefined;
  const url = new URL(value);
  if (url.origin !== new URL(config.publicBaseUrl).origin) {
    throw Object.assign(new Error("Shopping linkback must use this application's origin"), { statusCode: 400 });
  }
  url.username = "";
  url.password = "";
  url.hash = "";
  return url.toString();
}

function ingredientPayload(ingredient, measurementKey) {
  const measurement = ingredient.quantity && ingredient.unit
    ? { quantity: ingredient.quantity, unit: ingredient.unit }
    : null;
  if (measurement && !supportedUnits.has(measurement.unit)) {
    throw new Error("Unsupported Instacart measurement unit");
  }
  return {
    name: ingredient.name,
    ...(ingredient.displayText ? { display_text: ingredient.displayText } : {}),
    ...(measurement ? { [measurementKey]: [measurement] } : {}),
  };
}

export function buildInstacartRequest(input, config) {
  const partnerLinkbackUrl = linkback(input.partnerLinkbackUrl, config);
  const landingPageConfiguration = partnerLinkbackUrl
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
        ...(input.servings ? { servings: input.servings } : {}),
        ...(input.cookingTime ? { cooking_time: input.cookingTime } : {}),
        ...(input.externalReferenceId ? { external_reference_id: input.externalReferenceId } : {}),
        ...(input.instructions?.length ? { instructions: input.instructions } : {}),
        ingredients: input.ingredients.map((item) => ingredientPayload(item, "measurements")),
        landing_page_configuration: {
          ...(landingPageConfiguration ?? {}),
          enable_pantry_items: true,
        },
      },
    };
  }

  return {
    path: "/idp/v1/products/products_link",
    payload: {
      title: input.title,
      link_type: "shopping_list",
      expires_in: 365,
      line_items: input.ingredients.map((item) => ingredientPayload(item, "line_item_measurements")),
      ...(landingPageConfiguration ? { landing_page_configuration: landingPageConfiguration } : {}),
    },
  };
}

function safeProductsLink(value) {
  const url = new URL(value);
  const hostAllowed = url.hostname === "instacart.com" || url.hostname.endsWith(".instacart.com");
  if (url.protocol !== "https:" || !hostAllowed) {
    throw Object.assign(new Error("Instacart returned an invalid shopping link"), { statusCode: 502 });
  }
  return url.toString();
}

export function createInstacartService(config, fetchImplementation = fetch) {
  return Object.freeze({
    async createShoppingPage(input) {
      const request = buildInstacartRequest(input, config);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);
      try {
        const response = await fetchImplementation(`${config.instacart.apiBaseUrl}${request.path}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${config.instacart.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request.payload),
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          const error = new Error(response.status === 429
            ? "Instacart is receiving too many requests. Please try again."
            : "Instacart could not create the shopping page.");
          error.statusCode = response.status === 429 ? 429 : 502;
          throw error;
        }
        return safeProductsLink(data?.products_link_url);
      } catch (error) {
        if (error?.name === "AbortError") {
          const timeoutError = new Error("Instacart took too long to respond. Please try again.");
          timeoutError.statusCode = 504;
          throw timeoutError;
        }
        if (error?.statusCode) throw error;
        throw Object.assign(new Error("Could not reach Instacart. Please try again."), { statusCode: 502 });
      } finally {
        clearTimeout(timeout);
      }
    },
  });
}
