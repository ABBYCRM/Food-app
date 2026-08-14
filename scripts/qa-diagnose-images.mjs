import { chromium } from "playwright-core";

const baseURL = process.argv[2] || "http://127.0.0.1:4173";
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH,
  proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined,
  args: process.env.HTTPS_PROXY ? ["--ignore-certificate-errors", "--proxy-bypass-list=127.0.0.1;localhost"] : [],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const failedRequests = [];
page.on("requestfailed", (req) => {
  failedRequests.push({ url: req.url(), reason: req.failure()?.errorText });
});
page.on("response", (res) => {
  if (res.status() >= 400) failedRequests.push({ url: res.url(), status: res.status() });
});

await page.goto(baseURL, { waitUntil: "load", timeout: 30000 });
await page.waitForTimeout(4000);

const images = await page.$$eval("img", (imgs) =>
  imgs.map((img) => ({
    src: img.currentSrc || img.src,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    complete: img.complete,
    alt: img.alt,
  }))
);

const broken = images.filter((i) => i.complete && i.naturalWidth === 0);
console.log(`Total <img> elements: ${images.length}`);
console.log(`Broken (complete but naturalWidth=0): ${broken.length}`);
for (const b of broken) console.log("  BROKEN:", b.src.slice(0, 120), "alt=", JSON.stringify(b.alt));

console.log(`\nFailed/errored network requests: ${failedRequests.length}`);
for (const f of failedRequests) console.log(" ", f.status ?? f.reason, f.url);

await browser.close();
