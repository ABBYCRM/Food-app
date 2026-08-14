const fs = require('fs');

const d1 = fs.readFileSync('artifacts/mestizo-umami/src/data/d1.ts', 'utf8');
const d2 = fs.readFileSync('artifacts/mestizo-umami/src/data/d2.ts', 'utf8');
const d3 = fs.readFileSync('artifacts/mestizo-umami/src/data/d3.ts', 'utf8');
const d4 = fs.readFileSync('artifacts/mestizo-umami/src/data/d4.ts', 'utf8');
const d5 = fs.readFileSync('artifacts/mestizo-umami/src/data/d5.ts', 'utf8');
const d6 = fs.readFileSync('artifacts/mestizo-umami/src/data/d6.ts', 'utf8');

function extractArrayItems(content, arrayName) {
  const startStr = `export const ${arrayName}: Recipe[] = [`;
  const startIndex = content.indexOf(startStr) + startStr.length;
  const endIndex = content.lastIndexOf('];');
  return content.substring(startIndex, endIndex).trim();
}

const c1 = extractArrayItems(d1, 'chunk1');
const c2 = extractArrayItems(d2, 'chunk2');
const c3 = extractArrayItems(d3, 'chunk3');
const c4 = extractArrayItems(d4, 'chunk4');
const c5 = extractArrayItems(d5, 'chunk5');
const c6 = extractArrayItems(d6, 'chunk6');

const header = `import type { Recipe } from "./recipes";
import dinnerPastaHero from "@assets/generated_images/dinner-pasta.jpg";
import dinnerSteakHero from "@assets/generated_images/dinner-steak.jpg";
import dinnerChickenHero from "@assets/generated_images/dinner-chicken.jpg";
import dinnerCurryHero from "@assets/generated_images/dinner-curry.jpg";
import dinnerSeafoodHero from "@assets/generated_images/dinner-seafood.jpg";

export const dinnerRecipes: Recipe[] = [\n`;

const footer = `\n];\n`;

const fullContent = header + c1 + ',\n' + c2 + ',\n' + c3 + ',\n' + c4 + ',\n' + c5 + ',\n' + c6 + footer;

fs.writeFileSync('artifacts/mestizo-umami/src/data/dinner-recipes.ts', fullContent);
console.log("Combined successfully. File size:", fullContent.length);

fs.unlinkSync('artifacts/mestizo-umami/src/data/d1.ts');
fs.unlinkSync('artifacts/mestizo-umami/src/data/d2.ts');
fs.unlinkSync('artifacts/mestizo-umami/src/data/d3.ts');
fs.unlinkSync('artifacts/mestizo-umami/src/data/d4.ts');
fs.unlinkSync('artifacts/mestizo-umami/src/data/d5.ts');
fs.unlinkSync('artifacts/mestizo-umami/src/data/d6.ts');
