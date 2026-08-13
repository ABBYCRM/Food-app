import { describe, expect, it } from "vitest";
import { decodeSharedRecipe, encodeSharedRecipe, type SharedRecipe } from "./sharedRecipe";

const recipe: SharedRecipe = {
  title: "Miso Mole Ramen 🍜",
  subtitle: "A shared kitchen experiment",
  story: "Chile, fermentation, and broth.",
  ingredients: ["2 cups broth", "1 tbsp miso"],
  method: ["Simmer the broth.", "Whisk in miso off heat."],
  serves: 2,
  minutes: 25,
  forkedFrom: "ramen-pozole-rojo",
};

describe("shared recipe links", () => {
  it("round-trips UTF-8 data in a URL-safe fragment", () => {
    const encoded = encodeSharedRecipe(recipe);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(decodeSharedRecipe(encoded)).toEqual(recipe);
  });

  it("rejects malformed, oversized, and out-of-policy payloads", () => {
    expect(decodeSharedRecipe("not+url+safe")).toBeNull();
    expect(decodeSharedRecipe("a".repeat(300_001))).toBeNull();
    const invalid = encodeSharedRecipe({ ...recipe, serves: 0 });
    expect(decodeSharedRecipe(invalid)).toBeNull();
    expect(() => encodeSharedRecipe({
      ...recipe,
      ingredients: Array.from({ length: 200 }, () => "x".repeat(2_000)),
    })).toThrow(/too large/i);
  });
});
