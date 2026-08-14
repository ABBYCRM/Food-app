import { test as base, expect } from "@playwright/test";

/**
 * The app loads Fraunces/Inter from Google Fonts (index.html). In this
 * sandboxed environment that request resets rather than failing fast,
 * which makes every `waitForLoadState("networkidle")` (and Playwright's own
 * navigation wait) sit for ~13s per test waiting on a request that was
 * never going to resolve. Blocking it outright is also just correct
 * practice for e2e tests: they shouldn't depend on a third-party network
 * fetch that has nothing to do with the behavior under test, and the app
 * already degrades to system fonts via `display=swap` when it fails.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => route.abort());
    await use(page);
  },
});

export { expect };
