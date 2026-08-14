import { createServer } from "vite";

const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
const errors = [];

function check(cond, msg) {
  if (!cond) errors.push(msg);
}

try {
  const { BREAKFAST_RECIPES } = await server.ssrLoadModule("/src/data/breakfast.ts");

  check(BREAKFAST_RECIPES.length === 365, `expected 365 recipes, found ${BREAKFAST_RECIPES.length}`);

  const slugs = new Set();
  const titlesEn = new Set();
  const titlesEs = new Set();
  const titlesPt = new Set();
  const ingredientSignatures = new Set();
  let duplicateSlugs = 0, duplicateTitles = 0, duplicateIngredientLists = 0;
  let missingFields = 0, missingBreakfastMeal = 0, missingFusionTags = 0, missingImage = 0;
  const asianTagPool = ["japanese", "korean", "cantonese", "sichuan", "vietnamese", "thai", "filipino", "indonesian", "malaysian", "indian", "taiwanese", "japonés", "coreano", "cantonés", "sichuanés", "vietnamita", "tailandés", "filipino", "indonesio", "malasio", "indio", "taiwanés", "japonês", "coreano", "cantonês", "sichuanês", "vietnamita", "tailandês", "filipino", "indonésio", "malaio", "indiano", "taiwanês"];
  const mexicanTagPool = ["salsa roja", "salsa verde", "mole", "tamarind-chile", "tamarindo-chile", "tamarindo-pimenta", "elote", "chile-lime crema", "crema chile-limón", "creme pimenta-limão", "epazote-black bean", "epazote-frijol", "epazote-feijão", "achiote", "chile morita", "pico de gallo"];

  for (const r of BREAKFAST_RECIPES) {
    if (slugs.has(r.slug)) { duplicateSlugs++; } else slugs.add(r.slug);
    if (titlesEn.has(r.title.en)) { duplicateTitles++; } else titlesEn.add(r.title.en);
    titlesEs.add(r.title.es);
    titlesPt.add(r.title.pt);

    const sig = r.ingredients.map((i) => i.name.en).sort().join("|");
    if (ingredientSignatures.has(sig)) duplicateIngredientLists++; else ingredientSignatures.add(sig);

    const requiredOk =
      r.slug && r.title?.en && r.title?.es && r.title?.pt &&
      r.ingredients?.length > 0 && r.method?.en?.length > 0 && r.method?.es?.length > 0 && r.method?.pt?.length > 0 &&
      typeof r.prepMinutes === "number" && r.prepMinutes > 0 &&
      typeof r.cookMinutes === "number" && r.cookMinutes >= 0 &&
      typeof r.serves === "number" && r.serves > 0 &&
      r.origin?.en && r.story?.en && r.notes?.en && r.pairing?.en;
    if (!requiredOk) missingFields++;

    if (!r.meals?.includes("breakfast")) missingBreakfastMeal++;

    const hasAsian = r.tags?.en?.some((t) => asianTagPool.includes(t));
    const hasMexican = r.tags?.en?.some((t) => mexicanTagPool.includes(t));
    if (!hasAsian || !hasMexican) missingFusionTags++;

    if (!r.hero || !r.thumb || !r.hero.startsWith("data:image/svg+xml")) missingImage++;
  }

  check(duplicateSlugs === 0, `${duplicateSlugs} duplicate slugs`);
  check(duplicateTitles === 0, `${duplicateTitles} duplicate English titles`);
  check(titlesEs.size === BREAKFAST_RECIPES.length, `${BREAKFAST_RECIPES.length - titlesEs.size} duplicate Spanish titles`);
  check(titlesPt.size === BREAKFAST_RECIPES.length, `${BREAKFAST_RECIPES.length - titlesPt.size} duplicate Portuguese titles`);
  check(duplicateIngredientLists === 0, `${duplicateIngredientLists} recipes share an identical ingredient list`);
  check(missingFields === 0, `${missingFields} recipes missing required fields`);
  check(missingBreakfastMeal === 0, `${missingBreakfastMeal} recipes not tagged meals:["breakfast"]`);
  check(missingFusionTags === 0, `${missingFusionTags} recipes missing an Asian and/or Mexican fusion tag`);
  check(missingImage === 0, `${missingImage} recipes missing a valid inline image`);

  // Calendar mapping: also check against the day-of-year wiring, once present.
  try {
    const cal = await server.ssrLoadModule("/src/data/calendar.ts");
    if (typeof cal.breakfastForDate === "function") {
      const seen = new Set();
      for (let d = 0; d < 365; d++) {
        const date = new Date(2025, 0, 1 + d);
        const r = cal.breakfastForDate(date);
        check(!!r, `no breakfast recipe resolved for day ${d + 1}`);
        if (r) seen.add(r.slug);
      }
      check(seen.size === 365, `calendar mapping only reaches ${seen.size}/365 distinct breakfast recipes`);
    }
  } catch { /* calendar wiring checked once it exists */ }

  if (errors.length > 0) {
    console.error("Breakfast collection validation failed:\n");
    for (const e of errors) console.error(`- ${e}`);
    process.exitCode = 1;
  } else {
    console.log(`Breakfast collection validation passed: 365 recipes, unique slugs/titles (en/es/pt), fusion tags present, no duplicate ingredient lists.`);
  }
} catch (error) {
  console.error("Breakfast validation crashed:", error);
  process.exitCode = 1;
} finally {
  await server.close();
}
