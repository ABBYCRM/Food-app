import { createServer } from "vite";
import { writeFileSync, mkdirSync } from "node:fs";

const outDir = process.argv[2];
if (!outDir) {
  console.error("Usage: node scripts/qa-render-format-art.mjs <outDir>");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
const { BREAKFAST_FORMATS, breakfastArt } = await server.ssrLoadModule("/src/lib/breakfastArt.ts");

for (const format of BREAKFAST_FORMATS) {
  for (const size of ["hero", "thumb"]) {
    const dataUri = breakfastArt(format, size);
    const svgText = decodeURIComponent(dataUri.replace("data:image/svg+xml;utf8,", ""));
    writeFileSync(`${outDir}/${format}__${size}.svg`, svgText);
  }
}
console.log("wrote", BREAKFAST_FORMATS.length * 2, "svg files to", outDir);
await server.close();
