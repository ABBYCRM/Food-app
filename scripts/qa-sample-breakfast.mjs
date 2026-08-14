import { createServer } from "vite";
const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
const { BREAKFAST_RECIPES } = await server.ssrLoadModule("/src/data/breakfast.ts");
const indices = process.argv.slice(2).map(Number);
for (const i of indices.length ? indices : [0, 1, 50, 150, 300, 364]) {
  const r = BREAKFAST_RECIPES[i];
  console.log(`\n=== Day ${i + 1}: ${r.slug} ===`);
  console.log("Title EN:", r.title.en);
  console.log("Title ES:", r.title.es);
  console.log("Title PT:", r.title.pt);
  console.log("Origin:", r.origin.en, "| Category:", r.category, "| Difficulty:", r.difficulty, "| Spice:", r.spice, "Umami:", r.umami);
  console.log("Prep/Cook:", r.prepMinutes, "/", r.cookMinutes, "min | Serves:", r.serves, "| Season:", r.season, "| Healthy:", r.healthy);
  console.log("Subtitle:", r.subtitle.en);
  console.log("Ingredients:");
  for (const ing of r.ingredients) console.log("  -", ing.amount ?? ing.qty?.en ?? "", ing.unit ?? "", "|", ing.name.en, ing.allergens?.length ? `[${ing.allergens.join(",")}]` : "");
  console.log("Method EN:");
  r.method.en.forEach((s, idx) => console.log(`  ${idx + 1}.`, s));
  console.log("Allergens:", r.allergens.join(", ") || "none");
  console.log("Dietary:", r.dietary.join(", ") || "none");
  console.log("Tags EN:", r.tags.en.join(", "));
  console.log("Story:", r.story.en);
}
await server.close();
