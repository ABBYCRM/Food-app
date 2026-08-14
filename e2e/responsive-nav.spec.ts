import { test, expect } from "./fixtures";

test.describe("Navigation", () => {
  test("primary nav links reach every top-level page", async ({ page }) => {
    // exact:true throughout — the home page's quick-link tiles ("Open
    // notebook", "Find allergy-safe recipes"...) would otherwise collide
    // with these same-named nav buttons under substring matching.
    await page.goto("/");
    await page.getByRole("button", { name: "Recipes", exact: true }).click();
    await expect(page).toHaveURL(/\/recipes/);
    await page.getByRole("button", { name: "Planner", exact: true }).click();
    await expect(page).toHaveURL(/\/planner/);
    await page.getByRole("button", { name: "Notebook", exact: true }).click();
    await expect(page).toHaveURL(/\/notebook/);
    await page.getByRole("button", { name: "Home", exact: true }).click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("Responsive layout — no horizontal overflow", () => {
  // This suite sets its own viewport per test across the full width matrix,
  // so the per-project device emulation is redundant — run it once (on the
  // "desktop" project) instead of tripling ~50 navigations across all three.
  test.beforeEach(() => {
    test.skip(test.info().project.name !== "desktop", "width matrix runs once, not per project");
  });

  const routes = ["/", "/recipes?meal=breakfast", "/planner", "/notebook", "/allergy", "/search"];
  const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440];

  for (const route of routes) {
    for (const width of widths) {
      test(`${route || "home"} @ ${width}px has no horizontal scroll`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(scrollWidth, `${route} at ${width}px overflows horizontally`).toBeLessThanOrEqual(clientWidth + 1);
      });
    }
  }
});

test.describe("Mobile-specific chrome", () => {
  test.use({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true });

  test("bottom tab bar is visible and the desktop rail is not", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav.lang-bottom-nav")).toBeVisible();
    await expect(page.locator("nav.top-nav")).toBeHidden();
  });
});

test.describe("Desktop-specific chrome", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("top nav rail is visible and the mobile tab bar is not", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav.top-nav")).toBeVisible();
    await expect(page.locator("nav.lang-bottom-nav")).toBeHidden();
  });
});
