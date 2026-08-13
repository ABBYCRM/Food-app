/**
 * Download real food photography from Wikimedia Commons (public domain / CC).
 *
 * Why this exists: Pollinations.ai's free tier produces AI-rendered images
 * that often miss the actual subject (a "mole taco" prompt returns a plate
 * of plain meat; an "elote" prompt returns unadorned corn on the cob).
 * Wikimedia Commons has millions of real photographer-taken food photos
 * released under free licenses, and the API is open with no key required.
 *
 * The downloader:
 *   1. Queries the Commons search API for each dish with a hand-tuned term
 *   2. Picks the first result whose title and dimensions look plausible
 *   3. Downloads a 1280-wide thumbnail (or original if smaller)
 *   4. Saves into public/img/{recipes,formats,pantry,techniques}/ like the
 *      Pollinations fetcher does, so the rest of the app needs no changes
 *
 * Re-run with:  node scripts/fetch-wikimedia.mjs [--force] [--only=slug]
 *
 * Implementation note: Node 22's global fetch (W3C-compliant) refuses to
 * override the User-Agent header, and Wikimedia's API 403s requests with
 * the default `Node/x.y.z` UA. We shell out to curl instead, which is the
 * documented Wikimedia-recommended approach for scripting their API.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "img");
const FORCE = process.argv.includes("--force");
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) ?? "")
  .replace("--only=", "")
  .split(",")
  .filter(Boolean);

const UA = "MestizoUmami/1.0 (https://food-app-locf2.ondigitalocean.app; contact@abbycrm.example) node-script";

/* Each entry: search queries in priority order, the first hit wins.
   Queries are written in Wikipedia's vocabulary so the search ranks real
   plates of the dish, not ingredient shots or restaurant logos. */
const SOURCES = {
  recipes: {
    "miso-mole-short-rib-tacos": ["mole_taco", "taco_mole", "tacos_al_pastor"],
    "kimchi-elote":               ["elote_mexican", "elote_grilled_corn", "mexican_corn_cob"],
    "yuzu-aguachile-hamachi":     ["ceviche_peruvian", "aguachile", "hamachi_sashimi"],
    "al-pastor-bao":              ["gua_bao", "bao_bun_steamed", "xiao_long_bao"],
    "ramen-pozole-rojo":          ["pozole_rojo", "pozole_mexican", "ramen_broth_bowl"],
    "chamoy-furikake-popcorn":    ["popcorn_bowl", "furikake", "snack_mix_bowl"],
    "miso-mezcal-flan":           ["flan_dessert", "creme_caramel", "mexican_flan"],
    "tamarindo-shoyu-glazed-wings": ["chicken_wings_glazed", "tamarind_chicken", "buffalo_wings_plate"],
    "horchata-tres-leches-matcha": ["tres_leches", "matcha_cake", "horchata_dessert"],
  },
  formats: {
    taco:            ["mexican_taco_plate", "tacos_al_pastor"],
    bao:             ["gua_bao", "bao_burger"],
    tostada:         ["tostada_mexican", "tostadas_sencillas"],
    bowl:            ["rice_bowl_japanese", "donburi"],
    dumpling:        ["gyoza_plate", "dumplings_plate", "jiaozi"],
    broth:           ["ramen_broth_bowl", "pho_broth"],
    ceviche:         ["ceviche_peruvian", "coctel_de_camaron"],
    skewer:          ["yakitori_skewer", "kebabs_grilled"],
    "stir-fry":      ["wok_stir_fry", "stir_fry_pan"],
    salad:           ["garden_salad_plated", "asian_salad"],
    "rice-cake":     ["tteokbokki", "korean_rice_cake"],
    tamale:          ["tamales_mexicanos", "tamal_plate"],
    "noodle-cold":   ["cold_noodles", "sesame_noodles_bowl"],
    sope:            ["sopes_mexican", "sopes_de_frijol"],
    "ice-cream":     ["ice_cream_scoops", "gelato_plate"],
    chilaquiles:     ["chilaquiles", "chilaquiles_rojos"],
    congee:          ["congee_bowl", "rice_porridge_chinese"],
    "breakfast-taco":["breakfast_taco", "huevos_taco"],
    "oat-bowl":      ["oatmeal_bowl", "porridge_bowl_fruit"],
    "fruit-acai":    ["acai_bowl", "smoothie_bowl"],
  },
  pantry: {
    "soy-sauce":     ["soy_sauce_bottle", "shoyu"],
    "dried-chiles":  ["dried_chiles", "chile_seco"],
    ginger:          ["ginger_root", "fresh_ginger"],
    "corn-masa":     ["corn_tortillas_stack", "masa_dough"],
    miso:            ["miso_paste_bowl", "miso_paste"],
    "lime-yuzu":     ["yuzu_citrus", "limes_cut"],
    kombu:           ["dashi_kombu", "dried_kelp"],
    agave:           ["agave_syrup", "agave_plant"],
  },
  techniques: {
    "chile-bloom":         ["dried_chiles_toasting", "tostado_chiles"],
    "dashi-meets-caldo":   ["dashi_pot", "broth_simmering_pot"],
    "tortilla-press":      ["tortilla_press", "tortilla_making"],
  },
};

/* Terms in a hit's title that mean the photo is NOT what we want.
   (e.g. a search for "elote" might return an image of an "elote" bus
   in Mexico, not corn on the cob.) */
const BLOCKLIST = [
  "logo", "map", "graph", "chart", "diagram", "icon", "sign ",
  "advert", "menu_card", "package", "carton", "tin", "t-shirt",
  "text", "wikipedia", "brand",
];

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function api(pathname, attempt = 1) {
  const url = `https://commons.wikimedia.org/w${pathname}`;
  try {
    const { stdout } = await exec("curl", [
      "-sSL", "--max-time", "30",
      "-A", UA,
      "-H", `Api-User-Agent: ${UA}`,
      url,
    ]);
    return JSON.parse(stdout);
  } catch (err) {
    const msg = err.message ?? "";
    if ((msg.includes("403") || msg.includes("429")) && attempt < 5) {
      const wait = attempt * 2000;
      process.stdout.write(`  wait  rate-limited — backing off ${wait}ms\n`);
      await new Promise((r) => setTimeout(r, wait));
      return api(pathname, attempt + 1);
    }
    throw err;
  }
}

async function download(url, outPath, attempt = 1) {
  try {
    /* Have curl write directly to the destination file — no shell
       escaping or string-decoding needed for binary JPEGs. */
    await mkdir(dirname(outPath), { recursive: true });
    await exec("curl", [
      "-sSL", "--max-time", "60",
      "-A", UA,
      "--output", outPath,
      url,
    ]);
    const stat = await (await import("node:fs/promises")).stat(outPath);
    if (stat.size < 5000) {
      /* Wikimedia returns a 2KB HTML "error" page when its CDN throttles
         anonymous clients — back off hard and retry. */
      await (await import("node:fs/promises")).unlink(outPath).catch(() => {});
      if (attempt < 4) {
        const wait = attempt * 3000;
        process.stdout.write(`  wait  CDN throttled — backing off ${wait}ms\n`);
        await new Promise((r) => setTimeout(r, wait));
        return download(url, outPath, attempt + 1);
      }
      throw new Error(`too small (${stat.size} bytes)`);
    }
  } catch (err) {
    if (attempt < 3 && !/too small/.test(err.message)) {
      await new Promise((r) => setTimeout(r, attempt * 1000));
      return download(url, outPath, attempt + 1);
    }
    throw err;
  }
}

/* Pick the first hit that isn't blocked and is a JPEG/PNG of plausible size. */
async function findPhoto(queries, widthHint = 1280) {
  for (const q of queries) {
    const json = await api(
      `/api.php?action=query&generator=search` +
      `&gsrsearch=${encodeURIComponent(q)}` +
      `&gsrnamespace=6&gsrlimit=10` +
      `&prop=imageinfo&iiprop=url|size&iiurlwidth=${widthHint}` +
      `&format=json`
    );
    const pages = json?.query?.pages ?? {};
    for (const page of Object.values(pages)) {
      const title = (page.title ?? "").replace(/^File:/, "").toLowerCase();
      if (!/\.(jpe?g|png)$/.test(title)) continue;
      if (BLOCKLIST.some((bad) => title.includes(bad))) continue;
      const info = page.imageinfo?.[0];
      if (!info) continue;
      const w = info.width ?? 0;
      const h = info.height ?? 0;
      /* Reject obvious non-photos: 1x1 logos, super-tall infographics, etc. */
      if (w < 600 || h < 400) continue;
      if (w / h < 0.6 || w / h > 2.2) continue;
      return { thumburl: info.thumburl ?? info.url, original: info.url, title };
    }
  }
  return null;
}

async function fetchOne(group, slug, queries, outPath) {
  const rel = outPath.replace(ROOT + "/", "");
  if (ONLY.length && !ONLY.some((k) => rel.includes(k))) return "skipped";
  if (!FORCE && (await exists(outPath))) {
    process.stdout.write(`  skip  ${rel}\n`);
    return "skipped";
  }
  /* Thumbs get a 640-wide render to keep card grids light; heroes get
     1280 so the recipe detail page stays crisp on retina. */
  const widthHint = outPath.endsWith("-thumb.jpg") ? 640 : 1280;
  const hit = await findPhoto(queries, widthHint);
  if (!hit) {
    process.stdout.write(`  MISS  ${rel} — no Wikimedia hit for any of: ${queries.join(", ")}\n`);
    return "missed";
  }
  try {
    await download(hit.thumburl, outPath);
    const stat = await (await import("node:fs/promises")).stat(outPath);
    process.stdout.write(`  ok    ${rel} ← ${hit.title} (${Math.round(stat.size / 1024)}KB)\n`);
    return "ok";
  } catch (err) {
    process.stdout.write(`  FAIL  ${rel} — ${err.message}\n`);
    return "failed";
  }
}

const jobs = [];
for (const [slug, queries] of Object.entries(SOURCES.recipes)) {
  jobs.push(() => fetchOne("recipes", slug, queries, join(OUT, "recipes", `${slug}-hero.jpg`)));
  jobs.push(() => fetchOne("recipes", slug, queries, join(OUT, "recipes", `${slug}-thumb.jpg`)));
}
for (const [slug, queries] of Object.entries(SOURCES.formats)) {
  jobs.push(() => fetchOne("formats", slug, queries, join(OUT, "formats", `${slug}-hero.jpg`)));
}
for (const [slug, queries] of Object.entries(SOURCES.pantry)) {
  jobs.push(() => fetchOne("pantry", slug, queries, join(OUT, "pantry", `${slug}.jpg`)));
}
for (const [slug, queries] of Object.entries(SOURCES.techniques)) {
  jobs.push(() => fetchOne("techniques", slug, queries, join(OUT, "techniques", `${slug}.jpg`)));
}

console.log(`Fetching ${jobs.length} photos from Wikimedia Commons …`);
/* Wikimedia's anon tier rate-limits after bursts. 1 in parallel + a small
   delay keeps us well under the cap. The download itself is 1-2s, so total
   runtime for 49 photos is ~2 minutes. */
const results = [];
let i = 0;
await Promise.all(
  Array.from({ length: 1 }, async () => {
    while (i < jobs.length) {
      const job = jobs[i++];
      results.push(await job());
      await new Promise((r) => setTimeout(r, 250));
    }
  })
);
const tally = results.reduce((a, r) => ((a[r] = (a[r] ?? 0) + 1), a), {});
console.log("\nDone:", JSON.stringify(tally));
if (tally.missed || tally.failed) process.exitCode = 1;
