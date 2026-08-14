import { chromium } from "playwright-core";
import { readdirSync } from "node:fs";
import path from "node:path";

const dir = process.argv[2];
const files = readdirSync(dir).filter((f) => f.endsWith(".svg"));

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH });
const page = await browser.newPage({ viewport: { width: 500, height: 500 } });

for (const f of files) {
  const svgPath = path.join(dir, f);
  await page.goto(`file://${svgPath}`);
  await page.screenshot({ path: path.join(dir, f.replace(".svg", ".png")) });
}
console.log(`Converted ${files.length} svgs to png in ${dir}`);
await browser.close();
