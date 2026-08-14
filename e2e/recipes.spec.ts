import { test, expect } from "./fixtures";

test.describe("Recipe listing and filters", () => {
  test("breakfast filter surfaces the 365-day collection, not an empty state", async ({ page }) => {
    await page.goto("/recipes?meal=breakfast");
    await expect(page.getByText(/showing \d+ of 365/i)).toBeVisible();
    await expect(page.getByText("No recipes match your filters.")).not.toBeVisible();
  });

  test("lunch and dinner filters still show the curated recipes", async ({ page }) => {
    await page.goto("/recipes");
    await page.getByRole("button", { name: /lunch/i }).click();
    await expect(page.getByText(/showing \d+ of \d+/i)).toBeVisible();
    await expect(page.getByText("No recipes match your filters.")).not.toBeVisible();
  });

  test("meal filter toggles off when clicked again", async ({ page }) => {
    await page.goto("/recipes?meal=breakfast");
    // exact:true, since dozens of breakfast recipe cards on this very page
    // also have "Breakfast" in their accessible name.
    const breakfastPill = page.getByRole("button", { name: "Breakfast", exact: true });
    await expect(breakfastPill).toHaveAttribute("aria-pressed", "true");
    await breakfastPill.click();
    await expect(breakfastPill).toHaveAttribute("aria-pressed", "false");
  });

  test("load more reveals additional breakfast recipes", async ({ page }) => {
    await page.goto("/recipes?meal=breakfast");
    const cardsLocator = page.locator("article");
    const initialCount = await cardsLocator.count();
    expect(initialCount).toBeGreaterThan(0);
    await page.getByRole("button", { name: "+24" }).click();
    await expect(cardsLocator).toHaveCount(initialCount + 24);
  });

  test("no horizontal overflow on the recipe grid at mobile width", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/recipes?meal=breakfast");
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test("clicking a breakfast card navigates to the matching detail page", async ({ page }) => {
    await page.goto("/recipes?meal=breakfast");
    const firstCard = page.locator("article").first();
    const title = await firstCard.locator("h3").innerText();
    await firstCard.getByRole("button").first().click();
    await expect(page).toHaveURL(/\/recipe\//);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
  });
});
