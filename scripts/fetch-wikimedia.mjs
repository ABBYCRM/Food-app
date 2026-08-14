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
   plates of the dish, not ingredient shots or restaurant logos. The longer
   the list, the higher the chance of a perfect match — extra queries are
   cheap (~1s each), the cost is in the absence of a real photo at all. */
const SOURCES = {
  recipes: {
    "miso-mole-short-rib-tacos": [
      "mole_taco", "taco_mole", "tacos_al_pastor", "mole_poblano_plate",
      "mexican_braised_short_ribs", "taco_plate_mexican",
    ],
    "kimchi-elote": [
      "elote_mexican", "elote_grilled_corn", "mexican_corn_cob",
      "elote_chile_lime", "mexican_street_corn", "grilled_corn_cob",
    ],
    "yuzu-aguachile-hamachi": [
      "aguachile_verde", "aguachile_mexican", "shrimp_aguachile",
      "hamachi_sashimi", "yellowtail_citrus", "tiradito_peruvian",
      "hamachi_yuzu_ceviche", "ceviche_peruvian",
    ],
    "al-pastor-bao": [
      "gua_bao", "bao_bun_steamed", "xiao_long_bao", "bao_pork",
      "stuffed_bao", "bao_burger",
    ],
    "ramen-pozole-rojo": [
      "pozole_rojo", "pozole_mexican", "pozole_bowl", "pozole_hominy",
      "ramen_broth_bowl", "ramen_red",
    ],
    "chamoy-furikake-popcorn": [
      "flavored_popcorn", "spicy_popcorn", "tajin_popcorn",
      "mexican_popcorn", "furikake_rice", "japanese_seasoning",
      "snack_bowl", "chili_popcorn",
    ],
    "miso-mezcal-flan": [
      "flan_dessert", "creme_caramel", "mexican_flan",
      "flan_plate", "homemade_flan", "caramel_custard",
    ],
    "tamarindo-shoyu-glazed-wings": [
      "asian_chicken_wings", "glazed_wings", "korean_wings",
      "tamarind_chicken", "sticky_wings", "chicken_wings_plate",
      "buffalo_wings",
    ],
    "horchata-tres-leches-matcha": [
      "tres_leches_cake", "tres_leches_slice", "matcha_cake",
      "horchata_dessert", "milk_cake_slice", "mexican_pastry",
    ],
  },
  formats: {
    taco:            ["mexican_taco_plate", "tacos_al_pastor", "taco_truck"],
    bao:             ["gua_bao", "bao_burger", "bao_stuffed", "bao_pork"],
    tostada:         ["tostada_mexican", "tostadas_sencillas", "tostada_plate"],
    bowl:            ["rice_bowl_japanese", "donburi", "grain_bowl"],
    dumpling:        ["gyoza_plate", "dumplings_plate", "jiaozi", "potsticker"],
    broth:           ["ramen_broth_bowl", "pho_broth", "noodle_soup_bowl"],
    ceviche:         ["ceviche_peruvian", "coctel_de_camaron", "shrimp_ceviche"],
    skewer:          ["yakitori_skewer", "kebabs_grilled", "satay_skewer"],
    "stir-fry":      ["wok_stir_fry", "stir_fry_pan", "asian_stir_fry"],
    salad:           ["garden_salad_plated", "asian_salad", "noodle_salad"],
    "rice-cake":     ["tteokbokki", "korean_rice_cake", "rice_cake_dish"],
    tamale:          ["tamales_mexicanos", "tamal_plate", "mexican_tamale"],
    "noodle-cold":   ["cold_noodles", "sesame_noodles_bowl", "cold_noodle_dish"],
    sope:            ["sopes_mexican", "sopes_de_frijol", "mexican_sopes"],
    "ice-cream":     ["ice_cream_scoops", "gelato_plate", "ice_cream_bowl"],
    chilaquiles:     ["chilaquiles", "chilaquiles_rojos", "mexican_chilaquiles"],
    congee:          ["congee_bowl", "rice_porridge_chinese", "jook"],
    "breakfast-taco":["breakfast_taco", "huevos_taco", "egg_taco"],
    "oat-bowl":      ["oatmeal_bowl", "porridge_bowl_fruit", "oats_breakfast"],
    "fruit-acai":    ["acai_bowl", "smoothie_bowl", "pitaya_bowl"],
  },
  pantry: {
    "soy-sauce":     ["soy_sauce_bottle", "shoyu", "soy_sauce_dish"],
    "dried-chiles":  ["dried_chiles", "chile_seco", "mexican_dried_peppers"],
    ginger:          ["ginger_root", "fresh_ginger", "ginger_pile"],
    "corn-masa":     ["corn_tortillas_stack", "masa_dough", "tortilla_dough"],
    miso:            ["miso_paste_bowl", "miso_paste", "miso_jar"],
    "lime-yuzu":     ["yuzu_citrus", "limes_cut", "citrus_fruit"],
    kombu:           ["dashi_kombu", "dried_kelp", "kombu_seaweed"],
    agave:           ["agave_syrup", "agave_plant", "blue_agave"],
  },
  techniques: {
    "chile-bloom":         ["dried_chiles_toasting", "tostado_chiles", "roasting_chiles"],
    "dashi-meets-caldo":   ["dashi_pot", "broth_simmering_pot", "caldo_pollo"],
    "tortilla-press":      ["tortilla_press", "tortilla_making", "making_tortillas"],
  },
};

/* Terms in a hit's title that mean the photo is NOT what we want.
   (e.g. a search for "elote" might return an image of an "elote" bus
   in Mexico, not corn on the cob.) */
const BLOCKLIST = [
  "logo", "brand", "map", "graph", "chart", "diagram", "icon", "sign ",
  "advert", "menu_card", "package", "carton", "tin", "t-shirt",
  "text", "wikipedia", "sponsor", "comic", "cartoon",
  "_bag", "pack_", "wrap_", "label_", "tag_", "sticker", "mascot",
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

/* Fallback to the Pollinations AI renders from the previously-merged
   claude/build-harmonize-imagery-2yd3ag branch. The git working tree
   is the source of truth, so this expects the operator to have run
   `git checkout origin/claude/build-harmonize-imagery-2yd3ag -- public/img/`
   at some point and the resulting tree to live at FALLBACK_ROOT. */
const FALLBACK_ROOT = "/tmp/pollinations-fallback";

async function copyFallback(outPath) {
  /* Map public/img/recipes/miso-mole-short-rib-tacos-hero.jpg →
     /tmp/pollinations-fallback/recipes/miso-mole-short-rib-tacos-hero.jpg */
  const rel = outPath.split("/img/").pop();
  const src = join(FALLBACK_ROOT, rel);
  try {
    await access(src);
    await mkdir(dirname(outPath), { recursive: true });
    const { copyFile } = await import("node:fs/promises");
    await copyFile(src, outPath);
    return true;
  } catch {
    return false;
  }
}

/* Pick the first hit that isn't blocked and is a JPEG/PNG of plausible size. */
async function findPhoto(queries, widthHint = 1280) {
  for (const q of queries) {
    const json = await api(
      `/api.php?action=query&generator=search` +
      `&gsrsearch=${encodeURIComponent(q)}` +
      `&gsrnamespace=6&gsrlimit=20` +
      `&prop=imageinfo&iiprop=url|size&iiurlwidth=${widthHint}` +
      `&format=json`
    );
    const pages = json?.query?.pages ?? {};
    /* Sort by title length ascending — shorter titles like "Taco al pastor.jpg"
       tend to be on-subject photo files; long descriptive titles tend to be
       press / event / academic images. */
    const sorted = Object.values(pages).sort(
      (a, b) => (a.title?.length ?? 99) - (b.title?.length ?? 99)
    );
    for (const page of sorted) {
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
      return { thumburl: info.thumburl ?? info.url, original: info.url, title, query: q };
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
  if (hit) {
    try {
      await download(hit.thumburl, outPath);
      const stat = await (await import("node:fs/promises")).stat(outPath);
      process.stdout.write(`  ok    ${rel} ← ${hit.title} via '${hit.query}' (${Math.round(stat.size / 1024)}KB)\n`);
      return "ok";
    } catch (err) {
      process.stdout.write(`  fail  ${rel} (download) — ${err.message}\n`);
      /* fall through to fallback */
    }
  } else {
    process.stdout.write(`  miss  ${rel} — no Wikimedia hit for any of: ${queries.slice(0, 3).join(", ")}${queries.length > 3 ? `, +${queries.length - 3} more` : ""}\n`);
  }
  /* Wikimedia failed → fall back to the Pollinations AI render from the
     previously-merged branch. These are hyper-real in style even if the
     model sometimes misses the exact subject. */
  const copied = await copyFallback(outPath);
  if (copied) {
    process.stdout.write(`  fall  ${rel} ← Pollinations AI render\n`);
    return "fallback";
  }
  process.stdout.write(`  NONE  ${rel} — no Wikimedia hit and no fallback image\n`);
  return "none";
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
if (tally.none) process.exitCode = 1;
