import { test, expect } from "@playwright/test";

test("harness sanity: home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Mestizo Umami").first()).toBeVisible();
});
