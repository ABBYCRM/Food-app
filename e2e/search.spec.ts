import { test, expect } from "./fixtures";

test.describe("Search", () => {
  test("searching for a real ingredient returns matches from the breakfast collection", async ({ page }) => {
    await page.goto("/search");
    const input = page.getByPlaceholder("Search recipes, ingredients, techniques…");
    await input.fill("gochujang");
    await expect(page.getByText(/\d+ results?/)).toBeVisible();
    await expect(page.locator("article").first()).toBeVisible();
  });

  test("searching for nonsense shows the empty state, not a blank screen", async ({ page }) => {
    await page.goto("/search");
    const input = page.getByPlaceholder("Search recipes, ingredients, techniques…");
    await input.fill("zzzznonexistentdish9999");
    await expect(page.getByText('No matches yet. Try "miso", "chile", or "masa".')).toBeVisible();
  });

  test("clearing the query hides the results count and shows the default set", async ({ page }) => {
    await page.goto("/search");
    const input = page.getByPlaceholder("Search recipes, ingredients, techniques…");
    await input.fill("miso");
    await expect(page.getByText(/\d+ results?/)).toBeVisible();
    await input.fill("");
    await expect(page.getByText(/\d+ results?/)).not.toBeVisible();
    await expect(page.locator("article").first()).toBeVisible();
  });

  test("whitespace-only query behaves like an empty query", async ({ page }) => {
    await page.goto("/search");
    const input = page.getByPlaceholder("Search recipes, ingredients, techniques…");
    await input.fill("   ");
    await expect(page.getByText(/\d+ results?/)).not.toBeVisible();
  });
});
