import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";
import { Router } from "wouter";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});

const failures = [];
let routeCount = 0;

function check(condition, message) {
  if (!condition) failures.push(message);
}

function hasNestedButtons(html) {
  let depth = 0;
  for (const match of html.matchAll(/<\/?button\b[^>]*>/gi)) {
    const closing = match[0].startsWith("</");
    if (closing) depth = Math.max(0, depth - 1);
    else {
      if (depth > 0) return true;
      depth += 1;
    }
  }
  return false;
}

try {
  const [{ default: App }, recipeData, breakfastData, calendarData] = await Promise.all([
    server.ssrLoadModule("/src/App.tsx"),
    server.ssrLoadModule("/src/data/recipes.ts"),
    server.ssrLoadModule("/src/data/breakfast.ts"),
    server.ssrLoadModule("/src/data/calendar.ts"),
  ]);

  const { recipes } = recipeData;
  const { BREAKFAST_RECIPES } = breakfastData;
  const { allRecipesForCalendar, recipeForCalendarIndex, breakfastForCalendarIndex } = calendarData;

  check(recipes.length === 9, `expected 9 curated recipes, found ${recipes.length}`);
  check(BREAKFAST_RECIPES.length === 365, `expected 365 breakfast recipes, found ${BREAKFAST_RECIPES.length}`);
  check(
    allRecipesForCalendar().length === recipes.length + BREAKFAST_RECIPES.length,
    "calendar does not expose curated + breakfast recipes",
  );
  check(new Set(recipes.map((recipe) => recipe.slug)).size === recipes.length, "recipe slugs are not unique");
  check(new Set(recipes.map((recipe) => recipe.hero)).size === recipes.length, "recipe hero images are reused");
  check(new Set(recipes.map((recipe) => recipe.thumb)).size === recipes.length, "recipe thumbnail images are reused");
  check(new Set(BREAKFAST_RECIPES.map((recipe) => recipe.slug)).size === BREAKFAST_RECIPES.length, "breakfast recipe slugs are not unique");

  for (const [index, recipe] of recipes.entries()) {
    check(recipe.hero.endsWith(`/img/recipes/${recipe.slug}-hero.jpg`), `${recipe.slug}: hero filename does not match recipe`);
    check(recipe.thumb.endsWith(`/img/recipes/${recipe.slug}-thumb.jpg`), `${recipe.slug}: thumbnail filename does not match recipe`);
    check(recipeForCalendarIndex(index).slug === recipe.slug, `${recipe.slug}: calendar order mismatch`);
    for (const locale of ["en", "es", "pt"]) {
      check(Boolean(recipe.title[locale]?.trim()), `${recipe.slug}: missing ${locale} title`);
      check(Boolean(recipe.subtitle[locale]?.trim()), `${recipe.slug}: missing ${locale} subtitle`);
      check(Boolean(recipe.origin[locale]?.trim()), `${recipe.slug}: missing ${locale} origin`);
      check(Boolean(recipe.story[locale]?.trim()), `${recipe.slug}: missing ${locale} story`);
      check(recipe.method[locale]?.length > 0, `${recipe.slug}: missing ${locale} method`);
    }
  }

  for (const day of [0, 1, 90, 180, 270, 364]) {
    const recipe = breakfastForCalendarIndex(day);
    check(recipe.meals.includes("breakfast"), `breakfast day ${day + 1}: not tagged breakfast`);
    check(recipe.hero.startsWith("data:image/svg+xml"), `breakfast day ${day + 1}: hero is not an inline SVG`);
  }

  // Sample of breakfast recipes for the SSR route-rendering pass below —
  // validate-breakfast.mjs already checks all 365 for data-shape correctness,
  // this checks a spread of them actually render through React without error.
  const breakfastSample = [0, 50, 100, 150, 200, 250, 300, 364].map((i) => BREAKFAST_RECIPES[i]);

  const routes = [
    "/", "/philosophy", "/pantry", "/recipes", "/recipes?meal=breakfast", "/planner", "/notebook",
    "/allergy", "/vendor", "/chefs", "/search",
    ...recipes.map((recipe) => `/recipe/${recipe.slug}`),
    ...breakfastSample.map((recipe) => `/recipe/${recipe.slug}`),
  ];
  routeCount = routes.length;

  const reactErrors = [];
  const originalError = console.error;
  console.error = (...args) => reactErrors.push(args.map(String).join(" "));
  try {
    for (const route of routes) {
      const html = renderToString(
        React.createElement(Router, { ssrPath: route }, React.createElement(App)),
      );
      check(html.includes("app-shell"), `${route}: app shell did not render`);
      check(!html.includes("day-"), `${route}: generated draft leaked into public UI`);
      check(!hasNestedButtons(html), `${route}: contains nested button elements`);

      if (route.startsWith("/recipe/")) {
        const slug = route.slice("/recipe/".length);
        const curated = recipes.find((entry) => entry.slug === slug);
        const recipe = curated ?? BREAKFAST_RECIPES.find((entry) => entry.slug === slug);
        check(Boolean(recipe && html.includes(recipe.title.en)), `${route}: recipe detail did not render`);
        if (curated) {
          check(html.includes(`/img/recipes/${slug}-hero.jpg`), `${route}: matching hero image did not render`);
        } else if (recipe) {
          check(html.includes("data:image/svg+xml"), `${route}: matching inline hero image did not render`);
        }
      }
    }
  } finally {
    console.error = originalError;
  }
  check(reactErrors.length === 0, `React emitted render errors: ${reactErrors.join(" | ")}`);
} finally {
  await server.close();
}

if (failures.length > 0) {
  console.error("App smoke test failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`App smoke test passed: data integrity, ${routeCount} routes, image mapping, and interactive markup.`);
}
