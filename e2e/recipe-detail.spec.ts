import { test, expect } from "./fixtures";

test.describe("Recipe detail — curated dish", () => {
  test("miso-mole-short-rib-tacos renders title, ingredients, method, and allergens", async ({ page }) => {
    await page.goto("/recipe/miso-mole-short-rib-tacos");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Short Rib Tacos/);
    await expect(page.getByText("Ingredients")).toBeVisible();
    // "beef short rib, bone-in" appears twice — once in the ingredients list,
    // once again in the shopping panel — so this only asserts at least one
    // is visible rather than picking a container arbitrarily.
    await expect(page.getByText("beef short rib, bone-in").first()).toBeVisible();
    await expect(page.getByText("The Method")).toBeVisible();
    // Scoped to the allergen pill specifically — "soy"/"egg" also appear
    // in the free-text story/method prose, which a plain text match picks up too.
    await expect(page.locator(".pill-tag").getByText("Soy", { exact: true })).toBeVisible();

    const hero = page.locator("img").first();
    const naturalWidth = await hero.evaluate((el: HTMLImageElement) => el.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });
});

test.describe("Recipe detail — generated breakfast dish", () => {
  const slug = "miso-shoyu-breakfast-tacos-with-salsa-roja-1";

  test("renders title, scaled ingredients, allergens derived from real ingredients, and method steps", async ({ page }) => {
    await page.goto(`/recipe/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Miso-Shoyu Breakfast Tacos/);
    // Also appears in the shopping panel — same reasoning as above.
    await expect(page.getByText("small corn tortillas").first()).toBeVisible();
    await expect(page.getByText("white miso paste").first()).toBeVisible();
    // Allergens are unioned from the actual ingredient list (egg, soy, gluten, sesame) —
    // not fabricated, so this is a real regression guard on that derivation.
    // Scoped to the allergen pills — plain text matches also hit the
    // generated story/subtitle/method prose, which legitimately mentions
    // "egg" and "soy" too.
    await expect(page.locator(".pill-tag").getByText("Egg", { exact: true })).toBeVisible();
    await expect(page.locator(".pill-tag").getByText("Soy", { exact: true })).toBeVisible();

    const methodSteps = page.locator("ol li");
    await expect(methodSteps).toHaveCount(4);

    const hero = page.locator("img").first();
    const src = await hero.getAttribute("src");
    expect(src).toMatch(/^data:image\/svg\+xml/);
    const naturalWidth = await hero.evaluate((el: HTMLImageElement) => el.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test("servings scaler doubles ingredient amounts", async ({ page }) => {
    await page.goto(`/recipe/${slug}`);
    // Base recipe serves 4 with 3 eggs; the ×2 preset should scale both the
    // servings readout and the ingredient quantity.
    const eggRow = page.getByText("eggs", { exact: true }).locator("xpath=ancestor::li[1]");
    await expect(eggRow.getByText("3", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "2×" }).click();
    await expect(eggRow.getByText("6", { exact: true })).toBeVisible();
    await expect(page.getByText("8 servings", { exact: true })).toBeVisible();
  });

  test("back button returns to the previous page", async ({ page }) => {
    await page.goto("/recipes?meal=breakfast");
    await page.getByRole("button", { name: /miso-shoyu breakfast tacos/i }).first().click();
    await expect(page).toHaveURL(/\/recipe\//);
    await page.getByRole("button", { name: /back/i }).click();
    await expect(page).toHaveURL(/\/recipes/);
  });
});

test.describe("Recipe detail — 404", () => {
  test("unknown slug shows a not-found state instead of crashing", async ({ page }) => {
    await page.goto("/recipe/does-not-exist-at-all");
    await expect(page.getByText("Recipe not found.")).toBeVisible();
  });
});
