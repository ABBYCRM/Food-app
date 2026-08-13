/**
 * Renders the app's food photography and vendors it into public/img/.
 *
 * Why vendored instead of hot-linked at runtime: the app previously pointed
 * every <img> straight at image.pollinations.ai, which meant each card was a
 * cold render request — slow first paint, 429s under a grid of concurrent
 * cards, and an 8s timeout that dumped the user onto SVG fallback art. Baking
 * the images into the build makes them deterministic, instantly cacheable by
 * the service worker, and available offline.
 *
 * Re-run with:  node scripts/fetch-imagery.mjs [--force]
 * Existing files are skipped unless --force is passed.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "img");
const FORCE = process.argv.includes("--force");
/* --only=flan,kombu  → re-render just the assets whose output path matches. */
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) ?? "")
  .replace("--only=", "")
  .split(",")
  .filter(Boolean);

/**
 * Seed revisions. The renderer is a lottery: a given seed sometimes returns a
 * picture that isn't the dish at all (the first flan pass produced a bare
 * plate, the first kombu pass a houseplant). Bumping the number here re-rolls
 * that asset deterministically without disturbing any of the others.
 */
const REV = {
  "miso-mezcal-flan": 7, "chamoy-furikake-popcorn": 14, "kimchi-elote": 22,
  "ramen-pozole-rojo": 6, "horchata-tres-leches-matcha": 14,
  "yuzu-aguachile-hamachi": 11,
  "fmt-bao": 7, "fmt-rice-cake": 6, "fmt-tamale": 6, "fmt-congee": 6,
  "fmt-noodle-cold": 6, "fmt-ice-cream": 6, "fmt-broth": 6,
  "fmt-chilaquiles": 6, "fmt-sope": 6,
  "pantry-kombu": 12, "pantry-lime-yuzu": 6, "pantry-agave": 6,
  "pantry-ginger": 12, "pantry-corn-masa": 10,
  "tech-tortilla-press": 6,
};

/* Shared realism suffix. Tuned for hyper-real food photography:
   - editorial food-magazine style (controlled, recognizable, appetizing)
   - shallow depth of field on the hero subject
   - warm side light to bring out texture
   - no text, no watermark, no plate edge artifacts
   - 'enhance' is NOT used: it rewrites the prompt server-side and drops specifics. */
const REAL =
  "professional food magazine photograph, Canon EOS R5, 100mm macro lens, " +
  "f/2.8 shallow depth of field, warm directional side light, " +
  "rich realistic texture, crisp sharp focus, 8K detail, " +
  "no text, no watermark, no people, no hands, no utensils in foreground";

/* The nine hand-authored signature dishes. */
const RECIPES = {
  "miso-mole-short-rib-tacos":
    "Three open small white corn tortillas on a dark slate plate, glossy lacquered braised beef short rib, " +
    "scattered toasted sesame seeds, magenta yuzu-pickled red onion ribbons, fresh cilantro leaves, flaky sea salt, " +
    "candlelit dark wood table, Michelin star plating",
  "kimchi-elote":
    "Authentic Mexican street elote, two ears of grilled yellow corn on the cob held on wooden sticks, " +
    "thick coat of white Mexican crema, crumbled cotija cheese, red chile powder dusting, chopped cilantro, " +
    "lime wedge, dark plate, side view",
  "yuzu-aguachile-hamachi":
    "Ceviche aguachile, raw translucent white hamachi sashimi slices in a pale green yuzu-cilantro marinade, " +
    "thin cucumber slices, diced red onion, sliced green chile, served in a shallow white ceramic bowl, " +
    "overhead view, Japanese-Peruvian fusion",
  "al-pastor-bao":
    "Fluffy white pillowy steamed bao buns filled with deep red-glazed al pastor pork shoulder, charred caramelized " +
    "pineapple cubes, cilantro, diced white onion, vivid red salsa macha drizzle, dark slate board, warm tungsten light",
  "ramen-pozole-rojo":
    "A big bowl of red chile pozole soup, large white hominy kernels in deep red broth, shredded chicken, " +
    "sliced radish, shredded cabbage, lime wedge, dried oregano, dark wooden table, side view",
  "chamoy-furikake-popcorn":
    "A black bowl heaped with fluffy white popped popcorn, bright red-orange chamoy sauce drizzled over, " +
    "dark green nori seaweed flakes, sesame seeds, Tajin chile powder, white plate, side view",
  "miso-mezcal-flan":
    "A classic round creme caramel flan dessert unmolded on a white plate, smooth pale custard dome, " +
    "glossy dark amber caramel sauce pooling around the base, sesame brittle shards on top, side view",
  "tamarindo-shoyu-glazed-wings":
    "Pile of glossy mahogany chicken wings lacquered in sticky tamarind-shoyu glaze, toasted white sesame seeds, " +
    "thin green scallion rings, sliced red Fresno chile, lime wedges, black slate board, moody side light",
  "horchata-tres-leches-matcha":
    "A square slice of tres leches cake on a white plate, soaked white sponge layers visible on the side, " +
    "thick layer of white whipped cream on top, a single bold diagonal stripe of bright green matcha powder, " +
    "cinnamon dust, side view",
};

/* One image per generated-calendar format. The 356 generated dishes all share
   a format key in their slug, so a per-format photo gives them real imagery
   instead of one repeated placeholder. */
const FORMATS = {
  taco: "Mexican-Asian fusion street tacos on small corn tortillas, charred protein, pickled vegetables, cilantro, lime, dark slate",
  bao: "Two Chinese gua bao sandwiches, soft white folded steamed buns each holding a slice of braised pork belly, pickled mustard greens, crushed peanuts and cilantro, on a bamboo steamer, side view",
  tostada: "Crisp flat tostada topped with marinated seafood, avocado, thin radish, sesame, chile oil, pale ceramic plate",
  bowl: "Composed rice bowl with glazed protein, pickled vegetables, avocado, sesame, scallion, dark ceramic bowl",
  dumpling: "Pan-seared crescent dumplings with crisp golden bottoms, chile-soy dipping sauce, scallion, sesame, dark plate",
  broth: "A deep bowl of clear golden noodle soup, tangle of noodles, sliced braised meat, halved soft boiled egg, green scallion, steam rising, dark table, overhead view",
  ceviche: "Bright citrus ceviche of raw white fish in cloudy lime marinade, red onion, cucumber, chile, cilantro, chilled bowl",
  skewer: "Charred grilled skewers with glossy glaze, sesame, scallion, lime wedge, dark grill board, smoke",
  "stir-fry": "Glossy wok stir-fry of seared protein and vegetables, visible wok char, chile, sesame, dark pan",
  salad: "Fresh crunchy salad with citrus dressing, herbs, chile threads, toasted seeds, pale ceramic bowl, bright daylight",
  "rice-cake": "Korean tteokbokki, many white cylindrical rice cake tubes coated in thick glossy red chile sauce in a black pan, sesame seeds, sliced scallion",
  tamale: "Mexican tamales in opened dried corn husks on a plate, soft corn masa filled with shredded meat, red sauce spooned over, crema drizzle, cilantro",
  "noodle-cold": "Cold sesame noodles, tangle of pale wheat noodles in a shallow bowl with brown sesame sauce, julienned cucumber, red chile oil, sesame seeds, overhead view",
  sope: "Mexican sopes, thick round corn masa cakes with pinched raised edges, topped with refried beans, shredded meat, lettuce, white crema and crumbled cheese, rustic plate",
  "ice-cream": "Three round scoops of ice cream in a glass dish, visible creamy scoop texture, glossy caramel sauce drizzled over, brittle shards, soft daylight",
  chilaquiles: "Mexican chilaquiles, a pile of triangular fried tortilla chips coated in red salsa on a plate, fried egg on top, white crema drizzle, crumbled cheese, red onion, cilantro",
  congee: "A bowl of thick white rice porridge congee, visible soft rice grains, topped with a swirl of red chile oil, sliced scallion, crispy fried shallots, steam",
  "breakfast-taco": "Breakfast tacos with fluffy scrambled egg, salsa, avocado, cilantro, warm morning light, rustic plate",
  "oat-bowl": "Creamy oat porridge bowl topped with fruit, toasted seeds, honey drizzle, bright morning light",
  "fruit-acai": "Vibrant purple acai bowl topped with sliced fruit, granola, coconut, seeds, bright fresh daylight",
};

const PANTRY = {
  "soy-sauce": "Dark soy sauce pouring into a small ceramic dish on a wooden board, rich glossy liquid, moody light",
  "dried-chiles": "Pile of whole dried Mexican chiles guajillo ancho and arbol, deep red wrinkled skins, rustic surface",
  ginger: "Fresh ginger roots piled on a rustic wooden kitchen table, pale brown papery skin, knobbly finger-like shapes, a knife and a few cut slices, warm daylight",
  "corn-masa": "A stack of raw uncooked corn tortillas and a ball of yellow masa dough on a wooden board, overhead view",
  miso: "Bowl of red and white miso paste with a wooden spoon, thick fermented texture, soft daylight, rustic board",
  "lime-yuzu": "A pile of whole and halved green limes and yellow yuzu citrus fruit on a board, cut faces showing juicy segmented flesh, water droplets, bright daylight",
  kombu: "Dried kombu kelp strips for Japanese dashi, long leathery dark olive sheets with white salt bloom, piled on a dark stone kitchen counter beside a bowl of water, moody light",
  agave: "Thick golden agave syrup drizzling in a slow ribbon from a spoon into a small glass jar on a wooden table, warm backlight, glossy amber liquid",
};

const TECHNIQUES = {
  "chile-bloom": "Dried chiles toasting in a hot dry cast iron pan, wisps of smoke, deep red skins blistering, moody kitchen",
  "dashi-meets-caldo": "Kombu kelp and dried chiles steeping in a clear pot of golden broth on a stove, gentle steam, warm light",
  "tortilla-press": "A round cast iron tortilla press open on a kitchen counter with a flattened disc of corn masa dough inside, a stack of fresh tortillas beside it, warm rustic kitchen",
};

function url(prompt, seed, w, h) {
  const p = encodeURIComponent(`${prompt}. ${REAL}`);
  /* Pollinations `quality=hd` ups the inference steps and the model sticks
     closer to the prompt. `private=true` keeps the URL out of the public
     gallery so the seed stays stable. `nologo=true` strips the watermark. */
  return `https://image.pollinations.ai/prompt/${p}` +
    `?width=${w}&height=${h}&model=flux&nologo=true&private=true` +
    `&seed=${seed}&enhance=true&quality=hd`;
}

/* Stable per-slug seed so re-runs reproduce the same photo. */
function seedFromSlug(slug) {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h | 0) || 1;
}

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function fetchOne(prompt, slug, w, h, outPath, attempt = 1) {
  const rel = outPath.replace(ROOT + "/", "");
  if (ONLY.length && !ONLY.some((k) => rel.includes(k))) return "skipped";
  if (!FORCE && (await exists(outPath))) {
    process.stdout.write(`  skip  ${rel}\n`);
    return "skipped";
  }
  /* A REV entry re-rolls just this asset; the base key is the slug minus the
     size suffix so a hero and its thumb re-roll together. */
  const revKey = slug.replace(/-t$/, "");
  const target = url(prompt, seedFromSlug(slug) + (REV[revKey] ?? 0) * 7919, w, h);
  try {
    const res = await fetch(target, { signal: AbortSignal.timeout(120000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    /* Pollinations occasionally answers 200 with an HTML error page. A
       true 1920x1280 photo is well over 30KB, so 10KB is a safe lower bound. */
    if (buf.length < 10000 || buf[0] !== 0xff || buf[1] !== 0xd8) {
      throw new Error(`not a JPEG (${buf.length} bytes)`);
    }
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, buf);
    process.stdout.write(`  ok    ${outPath.replace(ROOT + "/", "")} (${Math.round(buf.length / 1024)}KB)\n`);
    return "ok";
  } catch (err) {
    if (attempt < 6) {
      /* 429 is the common failure — back off hard and widen with each retry. */
      await new Promise((r) => setTimeout(r, attempt * 12000));
      return fetchOne(prompt, slug, w, h, outPath, attempt + 1);
    }
    process.stdout.write(`  FAIL  ${outPath.replace(ROOT + "/", "")} — ${err.message}\n`);
    return "failed";
  }
}

/* Serial by default — Pollinations 429s readily even at 3 parallel renders,
   and a re-run only has to fill the gaps, so throughput matters less than
   landing every asset. */
async function runPool(jobs, size = 1) {
  const results = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (i < jobs.length) {
        const job = jobs[i++];
        results.push(await job());
      }
    })
  );
  return results;
}

const jobs = [];
for (const [slug, prompt] of Object.entries(RECIPES)) {
  /* Hero: 1920x1280, the highest fidelity the renderer serves well.
     Thumb: 960x720, sharp on mobile grids (the user said "crisp"). */
  jobs.push(() => fetchOne(prompt, slug, 1920, 1280, join(OUT, "recipes", `${slug}-hero.jpg`)));
  jobs.push(() => fetchOne(prompt, `${slug}-t`, 960, 720, join(OUT, "recipes", `${slug}-thumb.jpg`)));
}
for (const [key, prompt] of Object.entries(FORMATS)) {
  jobs.push(() => fetchOne(prompt, `fmt-${key}`, 1920, 1280, join(OUT, "formats", `${key}-hero.jpg`)));
  jobs.push(() => fetchOne(prompt, `fmt-${key}-t`, 960, 720, join(OUT, "formats", `${key}-thumb.jpg`)));
}
for (const [slug, prompt] of Object.entries(PANTRY)) {
  jobs.push(() => fetchOne(prompt, `pantry-${slug}`, 1200, 800, join(OUT, "pantry", `${slug}.jpg`)));
}
for (const [slug, prompt] of Object.entries(TECHNIQUES)) {
  jobs.push(() => fetchOne(prompt, `tech-${slug}`, 1440, 900, join(OUT, "techniques", `${slug}.jpg`)));
}

console.log(`Rendering ${jobs.length} images into public/img/ …`);
/* Run 2 in parallel. 3+ reliably 429s on Pollinations' free tier; 2 keeps the
   cold-render window short without tripping the rate limit. */
const results = await runPool(jobs, 2);
const tally = results.reduce((a, r) => ((a[r] = (a[r] ?? 0) + 1), a), {});
console.log("\nDone:", JSON.stringify(tally));
if (tally.failed) process.exitCode = 1;
