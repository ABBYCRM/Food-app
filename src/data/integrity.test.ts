import { describe, expect, it, vi } from "vitest";
import { allRecipesForCalendar, CALENDAR_LENGTH, recipeForCalendarIndex, relatedCalendarRecipes } from "./calendar";

const locales = ["en", "es", "pt"] as const;

describe("365-day recipe catalog integrity", () => {
  it("contains 365 stable, unique, routable recipes", () => {
    const catalog = allRecipesForCalendar();
    expect(catalog).toHaveLength(CALENDAR_LENGTH);
    expect(new Set(catalog.map((recipe) => recipe.slug)).size).toBe(CALENDAR_LENGTH);

    for (const [index, recipe] of catalog.entries()) {
      expect(recipeForCalendarIndex(index).slug).toBe(recipe.slug);
      expect(recipe.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(recipe.hero).toMatch(/^https:\/\//);
      expect(recipe.thumb).toMatch(/^https:\/\//);
      expect(recipe.serves).toBeGreaterThan(0);
      expect(recipe.prepMinutes).toBeGreaterThanOrEqual(0);
      expect(recipe.cookMinutes).toBeGreaterThanOrEqual(0);
      expect(recipe.ingredients.length).toBeGreaterThan(0);

      for (const locale of locales) {
        expect(recipe.title[locale].trim()).not.toBe("");
        expect(recipe.subtitle[locale].trim()).not.toBe("");
        expect(recipe.origin[locale].trim()).not.toBe("");
        expect(recipe.story[locale].trim()).not.toBe("");
        expect(recipe.notes[locale].trim()).not.toBe("");
        expect(recipe.pairing[locale].trim()).not.toBe("");
        expect(recipe.method[locale].length).toBeGreaterThan(0);
        expect(recipe.method[locale].every((step) => step.trim().length > 0)).toBe(true);
      }

      for (const ingredient of recipe.ingredients) {
        for (const locale of locales) expect(ingredient.name[locale].trim()).not.toBe("");
        if (ingredient.amount !== undefined) expect(ingredient.amount).toBeGreaterThan(0);
        for (const allergen of ingredient.allergens ?? []) {
          expect(recipe.allergens).toContain(allergen);
        }
      }

      expect(JSON.stringify(recipe)).not.toMatch(/\{(?:protein|marinade|finish)\}/);
    }
  });

  it("produces identical routes when a late calendar day is opened first", async () => {
    vi.resetModules();
    const lateFirst = await import("./calendar");
    lateFirst.recipeForCalendarIndex(300);
    const lateFirstSlugs = lateFirst.allRecipesForCalendar().map((recipe) => recipe.slug);

    vi.resetModules();
    const sequential = await import("./calendar");
    const sequentialSlugs = sequential.allRecipesForCalendar().map((recipe) => recipe.slug);

    expect(lateFirstSlugs).toEqual(sequentialSlugs);
  });

  it("returns distinct related dishes for generated calendar recipes", () => {
    const current = recipeForCalendarIndex(300);
    const related = relatedCalendarRecipes(current, 3);
    expect(related).toHaveLength(3);
    expect(related.every((recipe) => recipe.slug !== current.slug)).toBe(true);
    expect(new Set(related.map((recipe) => recipe.slug)).size).toBe(3);
  });
});
