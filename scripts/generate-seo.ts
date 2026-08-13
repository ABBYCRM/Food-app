import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { allRecipesForCalendar } from "../src/data/calendar";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outputDirectory = path.join(projectRoot, "server", "generated");
const outputFile = path.join(outputDirectory, "seo-catalog.json");

const recipes = allRecipesForCalendar().map((recipe) => ({
  slug: recipe.slug,
  title: recipe.title.en,
  description: recipe.subtitle.en,
  origin: recipe.origin.en,
  image: recipe.hero,
  prepMinutes: recipe.prepMinutes,
  cookMinutes: recipe.cookMinutes,
  serves: recipe.serves,
  category: recipe.category,
  ingredients: recipe.ingredients.map((ingredient) => {
    const quantity = ingredient.qty?.en
      ?? [ingredient.amount, ingredient.unit].filter((value) => value !== undefined).join(" ");
    return `${quantity ? `${quantity} ` : ""}${ingredient.name.en}`.trim();
  }),
  instructions: recipe.method.en,
  dietary: recipe.dietary,
}));

const uniqueSlugs = new Set(recipes.map((recipe) => recipe.slug));
if (recipes.length !== 365 || uniqueSlugs.size !== recipes.length) {
  throw new Error(`SEO catalog expected 365 unique recipes; received ${recipes.length} recipes and ${uniqueSlugs.size} slugs`);
}

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputFile, `${JSON.stringify({ recipes }, null, 2)}\n`, "utf8");
process.stdout.write(`Generated SEO catalog for ${recipes.length} recipes.\n`);
