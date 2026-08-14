import { chromium } from "playwright-core";

const [url, outPath, scrollY] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH,
  proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined,
  args: process.env.HTTPS_PROXY ? ["--ignore-certificate-errors", "--proxy-bypass-list=127.0.0.1;localhost"] : [],
});
const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
await page.waitForTimeout(1500);
if (scrollY) await page.evaluate((y) => window.scrollTo(0, Number(y)), scrollY);
await page.waitForTimeout(500);
await page.screenshot({ path: outPath });
await browser.close();
console.log("saved", outPath);
