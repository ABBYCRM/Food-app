import { test, expect } from "./fixtures";

test.describe("Home page", () => {
  test("renders the hero, welcome copy, and all four meal rows", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Mestizo Umami").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Welcome to the Trilingual Kitchen." })).toBeVisible();

    // Breakfast row previously rendered nothing at all (no curated recipe was
    // tagged "breakfast") — this is the regression test for that fix.
    await expect(page.getByText("Breakfast", { exact: true })).toBeVisible();
    await expect(page.getByText("Lunch", { exact: true })).toBeVisible();
    await expect(page.getByText("Dinner", { exact: true })).toBeVisible();

    const breakfastHeading = page.getByText("Breakfast", { exact: true });
    const breakfastSection = breakfastHeading.locator("xpath=ancestor::section[1]");
    await expect(breakfastSection.locator("article, button").first()).toBeVisible();
  });

  test("every hero and card image actually loads (nonzero natural size)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const images = page.locator("img");
    const count = await images.count();
    expect(count).toBeGreaterThan(5);
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toHaveJSProperty("complete", true);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth, `image ${i} (${await img.getAttribute("src")}) failed to decode`).toBeGreaterThan(0);
    }
  });

  test("today's recipe card links to a working recipe detail page", async ({ page }) => {
    await page.goto("/");
    const todayLink = page.getByText("Today's Recipe", { exact: false }).locator("xpath=ancestor::section[1]//button").first();
    await todayLink.click();
    await expect(page).toHaveURL(/\/recipe\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
