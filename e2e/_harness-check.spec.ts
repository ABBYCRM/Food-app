import { test, expect } from "./fixtures";

test("harness sanity: home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Mestizo Umami").first()).toBeVisible();
});
