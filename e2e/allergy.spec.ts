import { test, expect } from "./fixtures";

test.describe("Allergy menu", () => {
  test("avoiding egg removes egg-containing recipes, including generated breakfast ones", async ({ page }) => {
    await page.goto("/allergy");
    await expect(page.getByText("Miso-Shoyu Breakfast Tacos with Salsa Roja")).toBeVisible();

    await page.getByRole("button", { name: "Egg", exact: true }).click();
    await expect(page.getByRole("button", { name: "✕ Egg" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Miso-Shoyu Breakfast Tacos with Salsa Roja")).not.toBeVisible();
  });

  test("reset clears all active filters", async ({ page }) => {
    await page.goto("/allergy");
    await page.getByRole("button", { name: "Egg", exact: true }).click();
    await expect(page.getByText("Miso-Shoyu Breakfast Tacos with Salsa Roja")).not.toBeVisible();

    await page.getByRole("button", { name: /reset|clear/i }).click();
    await expect(page.getByText("Miso-Shoyu Breakfast Tacos with Salsa Roja")).toBeVisible();
  });
});
