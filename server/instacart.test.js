import { describe, expect, it } from "vitest";
import { buildInstacartRequest, createInstacartService } from "./instacart.js";

const config = {
  publicBaseUrl: "https://food.example",
  instacart: { apiBaseUrl: "https://connect.instacart.com", apiKey: "test-key" },
};

describe("Instacart supported shopping-page integration", () => {
  it("builds an IDP recipe page with measurements and same-origin linkback", () => {
    const request = buildInstacartRequest({
      mode: "recipe",
      title: "Miso tacos",
      servings: 4,
      cookingTime: 45,
      externalReferenceId: "miso-tacos:4",
      instructions: ["Mix.", "Cook."],
      ingredients: [{
        name: "red miso paste",
        displayText: "2 tbsp · red miso paste",
        quantity: 2,
        unit: "tablespoon",
      }],
      partnerLinkbackUrl: "https://food.example/recipe/miso-tacos#shopping",
    }, config);
    expect(request.path).toBe("/idp/v1/products/recipe");
    expect(request.payload).toMatchObject({
      title: "Miso tacos",
      ingredients: [{
        name: "red miso paste",
        display_text: "2 tbsp · red miso paste",
        measurements: [{ quantity: 2, unit: "tablespoon" }],
      }],
      landing_page_configuration: {
        partner_linkback_url: "https://food.example/recipe/miso-tacos",
        enable_pantry_items: true,
      },
    });
  });

  it("builds a consolidated shopping-list page without invented quantities", () => {
    const request = buildInstacartRequest({
      mode: "list",
      title: "Week of August 10",
      ingredients: [{ name: "yuzu juice", displayText: "Yuzu juice" }],
    }, config);
    expect(request).toEqual({
      path: "/idp/v1/products/products_link",
      payload: {
        title: "Week of August 10",
        link_type: "shopping_list",
        expires_in: 365,
        line_items: [{ name: "yuzu juice", display_text: "Yuzu juice" }],
      },
    });
  });

  it("rejects cross-origin partner linkbacks", () => {
    expect(() => buildInstacartRequest({
      mode: "list",
      title: "Unsafe",
      ingredients: [{ name: "salt" }],
      partnerLinkbackUrl: "https://evil.example/steal",
    }, config)).toThrow("application's origin");
  });

  it("rejects insecure or non-Instacart links returned upstream", async () => {
    const service = createInstacartService(config, async () => new Response(JSON.stringify({
      products_link_url: "https://evil.example/not-instacart",
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    await expect(service.createShoppingPage({
      mode: "list",
      title: "List",
      ingredients: [{ name: "salt" }],
    })).rejects.toThrow("invalid shopping link");
  });
});

