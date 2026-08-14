// Ad-hoc visual QA screenshotter used during development.
// Usage: node scripts/qa-screenshot.mjs <outDir> <baseURL> route1:name1 route2:name2 ...
// Captures each route at mobile (390x844), tablet (834x1194), desktop (1440x900).
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const [outDir, baseURL, ...routeArgs] = process.argv.slice(2);
if (!outDir || !baseURL || routeArgs.length === 0) {
  console.error("Usage: node scripts/qa-screenshot.mjs <outDir> <baseURL> route:name ...");
  process.exit(1);
}

const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 834, height: 1194 },
  desktop: { width: 1440, height: 900 },
};

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
  proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined,
  args: process.env.HTTPS_PROXY ? ["--ignore-certificate-errors", "--proxy-bypass-list=127.0.0.1;localhost"] : [],
});

const consoleErrors = [];

for (const arg of routeArgs) {
  const [route, name] = arg.split(":");
  const label = name || route.replace(/\//g, "_") || "root";
  for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(String(err)));
    const url = new URL(route, baseURL).toString();
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
      await page.waitForTimeout(250);
      const file = path.join(outDir, `${label}__${vpName}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`OK  ${url} [${vpName}] -> ${file}`);
    } catch (err) {
      console.log(`ERR ${url} [${vpName}] -> ${err.message}`);
    }
    if (errors.length) {
      consoleErrors.push({ url, vpName, errors });
    }
    await context.close();
  }
}

await browser.close();

if (consoleErrors.length) {
  console.log("\n=== Console/page errors ===");
  for (const e of consoleErrors) {
    console.log(`${e.url} [${e.vpName}]:`);
    for (const line of e.errors) console.log(`  ${line}`);
  }
} else {
  console.log("\nNo console/page errors observed.");
}
