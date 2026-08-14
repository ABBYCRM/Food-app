import { test, expect } from "./fixtures";

test.describe("Planner", () => {
  test("every day card shows all four meal slots: breakfast, lunch, dinner, snack", async ({ page }) => {
    await page.goto("/planner");
    const firstDay = page.locator("article").first();
    await expect(firstDay.getByText("Tap to add a breakfast")).toBeVisible();
    await expect(firstDay.getByText("Tap to add a lunch")).toBeVisible();
    await expect(firstDay.getByText("Tap to add a dinner")).toBeVisible();
    await expect(firstDay.getByText("Tap to add a snack")).toBeVisible();
  });

  test("assigning a breakfast recipe to a day slot shows it in that slot", async ({ page }) => {
    await page.goto("/planner");
    const firstDay = page.locator("article").first();
    await firstDay.getByText("Tap to add a breakfast").click();

    const dialog = page.getByRole("dialog", { name: /breakfast recipe/i });
    await expect(dialog).toBeVisible();
    await dialog.getByPlaceholder("Search recipes, ingredients, techniques…").fill("Miso-Shoyu Breakfast Tacos");
    await dialog.getByText("Miso-Shoyu Breakfast Tacos with Salsa Roja").first().click();

    await expect(dialog).not.toBeVisible();
    await expect(firstDay.getByText("Miso-Shoyu Breakfast Tacos with Salsa Roja")).toBeVisible();
    await expect(firstDay.getByText("Tap to add a breakfast")).not.toBeVisible();
  });

  test("clearing an assigned slot removes the recipe", async ({ page }) => {
    await page.goto("/planner");
    const firstDay = page.locator("article").first();
    await firstDay.getByText("Tap to add a lunch").click();
    const dialog = page.getByRole("dialog", { name: /lunch recipe/i });
    await dialog.getByText("Kimchi Elote").first().click();
    await expect(firstDay.getByText("Kimchi Elote")).toBeVisible();

    await firstDay.getByLabel("Clear lunch").click();
    await expect(firstDay.getByText("Kimchi Elote")).not.toBeVisible();
    await expect(firstDay.getByText("Tap to add a lunch")).toBeVisible();
  });
});
