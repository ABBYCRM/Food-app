import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH });
const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
await page.goto("http://127.0.0.1:4173/recipes?meal=breakfast", { waitUntil: "load" });
await page.waitForTimeout(1000);
const info = await page.evaluate(() => {
  const rows = Array.from(document.querySelectorAll(".scrollbar-stable"));
  return rows.map((row) => ({
    rowRect: row.getBoundingClientRect(),
    scrollWidth: row.scrollWidth,
    clientWidth: row.clientWidth,
    children: Array.from(row.children).map((c) => {
      const r = c.getBoundingClientRect();
      return { text: c.textContent, top: r.top, left: r.left, width: r.width, height: r.height };
    }),
  }));
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
