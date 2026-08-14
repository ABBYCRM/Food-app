import { chromium } from "playwright-core";

const baseURL = process.argv[2] || "http://127.0.0.1:4173";
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH,
  proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined,
  args: process.env.HTTPS_PROXY ? ["--ignore-certificate-errors", "--proxy-bypass-list=127.0.0.1;localhost"] : [],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(baseURL, { waitUntil: "load", timeout: 30000 });
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const grids = Array.from(document.querySelectorAll(".grid"));
  return grids.map((g) => {
    const cs = getComputedStyle(g);
    return {
      className: g.className,
      gridTemplateColumns: cs.gridTemplateColumns,
      width: g.getBoundingClientRect().width,
      childCount: g.children.length,
    };
  });
});
console.log(JSON.stringify(info, null, 2));
console.log("window innerWidth:", await page.evaluate(() => window.innerWidth));
await browser.close();
