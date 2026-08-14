/**
 * Converts a scaled ingredient quantity into a supermarket-friendly label.
 * e.g. qty=2, unit="cup", item="coconut milk" → "2 cans (13.5 oz each) coconut milk"
 *
 * Falls back to the plain "qty unit item" string for items without a known
 * store packaging convention.
 */

interface Ing {
  qty: string;
  unit: string;
  item: string;
  note?: string;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function parseNum(s: string): number {
  const t = s.trim();
  if (t.includes("/")) {
    const p = t.split("/").map(Number);
    if (t.match(/^\d+ \d+\//)) {
      const ws = t.split(" ");
      return Number(ws[0]) + Number(ws[1].split("/")[0]) / Number(ws[1].split("/")[1]);
    }
    return p[0] / p[1];
  }
  return parseFloat(t) || 0;
}

function plural(n: number, word: string) {
  return n === 1 ? `1 ${word}` : `${fmt(n)} ${word}s`;
}

function fmt(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const fracs: [number, string][] = [
    [0.125, "⅛"], [0.25, "¼"], [0.333, "⅓"], [0.5, "½"],
    [0.667, "⅔"], [0.75, "¾"],
  ];
  const whole = Math.floor(n);
  const frac = n - whole;
  const best = fracs.reduce((a, b) => Math.abs(b[0] - frac) < Math.abs(a[0] - frac) ? b : a);
  if (Math.abs(best[0] - frac) < 0.09) {
    return whole > 0 ? `${whole} ${best[1]}` : best[1];
  }
  return n.toFixed(1).replace(/\.0$/, "");
}

function cans(totalCups: number, ozPerCan: number, ozPerCup = 8): string {
  const cupsPerCan = ozPerCan / ozPerCup;
  const n = Math.ceil(totalCups / cupsPerCan);
  return plural(n, `can`) + ` (${ozPerCan} oz each)`;
}

function match(item: string, ...keywords: string[]): boolean {
  const lower = item.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

// ── main export ──────────────────────────────────────────────────────────────

/**
 * Returns the store-friendly quantity label for an ingredient.
 * `scaledQty` is the already-scaled numeric quantity.
 */
export function toStoreLabel(ing: Ing, scaledQty: number): string {
  const unit = ing.unit.toLowerCase().trim();
  const item = ing.item;

  // ── Canned / jarred liquids & sauces ────────────────────────────────────
  if (match(item, "coconut milk", "coconut cream")) {
    const n = Math.ceil(scaledQty / (unit === "can" ? 1 : 1.69)); // 13.5 oz ≈ 1⅔ cups
    return `${plural(n, "can")} (13.5 oz each) ${item}`;
  }

  if (match(item, "coconut water")) {
    const n = Math.ceil(scaledQty / (unit === "can" ? 1 : 1.25));
    return `${plural(n, "can")} (10 oz each) ${item}`;
  }

  // ── Canned beans & legumes ───────────────────────────────────────────────
  if (match(item, "black bean", "white bean", "pinto bean", "kidney bean",
    "cannellini", "chickpea", "garbanzo", "lentil")) {
    if (unit === "can") return `${plural(scaledQty, "can")} (15 oz each) ${item}`;
    if (unit === "cup" || unit === "cups") {
      const n = Math.ceil(scaledQty / 1.75); // 15 oz can ≈ 1¾ cups drained
      return `${plural(n, "can")} (15 oz each) ${item}`;
    }
  }

  // ── Hominy ───────────────────────────────────────────────────────────────
  if (match(item, "hominy")) {
    if (unit === "g" || unit === "kg") {
      const grams = unit === "kg" ? scaledQty * 1000 : scaledQty;
      const n = Math.ceil(grams / 425); // 15 oz ≈ 425 g
      return `${plural(n, "can")} (15 oz / 425 g each) ${item}`;
    }
    if (unit === "can") return `${plural(scaledQty, "can")} (15 oz each) ${item}`;
  }

  // ── Canned tomatoes ──────────────────────────────────────────────────────
  if (match(item, "diced tomato", "crushed tomato", "fire-roasted tomato")) {
    if (unit === "cup" || unit === "cups") {
      const n = Math.ceil(scaledQty / 1.75);
      return `${plural(n, "can")} (14.5 oz each) ${item}`;
    }
    if (unit === "can") return `${plural(scaledQty, "can")} (14.5 oz each) ${item}`;
  }

  if (match(item, "tomato paste")) {
    const tbsp = unit === "tbsp" ? scaledQty : unit === "cup" ? scaledQty * 16 : scaledQty;
    const n = Math.ceil(tbsp / 10); // 6 oz can ≈ 10 tbsp
    return n <= 1 ? `1 can (6 oz) ${item}` : `${n} cans (6 oz each) ${item}`;
  }

  if (match(item, "tomato sauce")) {
    if (unit === "cup" || unit === "cups") {
      const n = Math.ceil(scaledQty / 1.75);
      return `${plural(n, "can")} (15 oz each) ${item}`;
    }
  }

  if (match(item, "chipotle")) {
    return `1 can (7 oz) chipotle chiles in adobo`;
  }

  // ── Broths & stocks ──────────────────────────────────────────────────────
  if (match(item, "chicken broth", "chicken stock", "vegetable broth",
    "vegetable stock", "beef broth", "beef stock", "dashi")) {
    if (unit === "cup" || unit === "cups") {
      const cartons = Math.ceil(scaledQty / 4); // 32 oz carton = 4 cups
      return `${plural(cartons, "carton")} (32 oz each) ${item}`;
    }
    if (unit === "ml") {
      const cartons = Math.ceil(scaledQty / 946); // 32 fl oz ≈ 946 ml
      return `${plural(cartons, "carton")} (32 oz each) ${item}`;
    }
  }

  // ── Mole & pastes ────────────────────────────────────────────────────────
  if (match(item, "mole negro", "mole paste", "mole verde", "mole rojo")) {
    if (unit === "cup" || unit === "cups") {
      const n = Math.ceil(scaledQty / 2);
      return n <= 1 ? `1 jar (16 oz) ${item}` : `${n} jars (16 oz each) ${item}`;
    }
    return `1 jar (16 oz) ${item}`;
  }

  if (match(item, "miso paste", "miso")) {
    return `1 tub (17.6 oz) ${item} — you'll use ${fmt(scaledQty)} ${unit || "tbsp"}`;
  }

  // ── Dairy ────────────────────────────────────────────────────────────────
  if (match(item, "heavy cream", "heavy whipping cream", "whipping cream")) {
    if (unit === "cup" || unit === "cups") {
      const n = Math.ceil(scaledQty / 2);
      return n <= 1 ? `1 pint (16 oz) ${item}` : `${n} pints (16 oz each) ${item}`;
    }
  }

  if (match(item, "whole milk", "whole milk", "oat milk", "almond milk", "soy milk")) {
    if (unit === "cup" || unit === "cups") {
      const n = Math.ceil(scaledQty / 4);
      return n <= 1 ? `1 quart ${item}` : `${n} quarts ${item}`;
    }
  }

  if (match(item, "mexican crema", "sour cream", "crème fraîche")) {
    if (unit === "cup" || unit === "cups") {
      const n = Math.ceil(scaledQty / 2);
      return n <= 1 ? `1 container (16 oz) ${item}` : `${n} containers (16 oz each) ${item}`;
    }
  }

  if (match(item, "cream cheese")) {
    const oz = unit === "oz" ? scaledQty : unit === "tbsp" ? scaledQty * 0.5 : scaledQty * 8;
    const n = Math.ceil(oz / 8);
    return n <= 1 ? `1 block (8 oz) ${item}` : `${n} blocks (8 oz each) ${item}`;
  }

  if (match(item, "butter", "unsalted butter", "salted butter")) {
    if (unit === "cup" || unit === "cups") {
      const sticks = Math.ceil(scaledQty * 2);
      return `${plural(sticks, "stick")} butter (½ cup each)`;
    }
    if (unit === "tbsp") {
      const sticks = Math.ceil(scaledQty / 8);
      return sticks <= 1 ? `1 stick (8 tbsp) butter` : `${sticks} sticks butter`;
    }
  }

  if (match(item, "cotija", "queso fresco", "monterey jack", "oaxacan cheese",
    "pepper jack", "cheddar cheese", "parmesan")) {
    if (unit === "cup" || unit === "cups") {
      const oz = Math.ceil(scaledQty * 4);
      return `${oz} oz ${item} (shredded or block)`;
    }
  }

  // ── Eggs ─────────────────────────────────────────────────────────────────
  if (match(item, "egg") && (unit === "" || unit === "large" || unit === "whole")) {
    const n = Math.ceil(scaledQty);
    const dozens = Math.ceil(n / 12);
    return n <= 6
      ? `${n} large eggs (from 1 dozen)`
      : `${plural(dozens, "dozen")} large eggs`;
  }

  // ── Tortillas & wrappers ─────────────────────────────────────────────────
  if (match(item, "corn tortilla")) {
    const n = Math.ceil(scaledQty);
    const pkgs = Math.ceil(n / 24);
    return pkgs <= 1
      ? `1 package corn tortillas (24 ct) — use ${n}`
      : `${pkgs} packages corn tortillas (24 ct each)`;
  }

  if (match(item, "flour tortilla")) {
    const n = Math.ceil(scaledQty);
    const pkgs = Math.ceil(n / 10);
    return pkgs <= 1
      ? `1 package flour tortillas (10 ct) — use ${n}`
      : `${pkgs} packages flour tortillas (10 ct each)`;
  }

  if (match(item, "tostada")) {
    const n = Math.ceil(scaledQty);
    const pkgs = Math.ceil(n / 12);
    return pkgs <= 1
      ? `1 bag tostadas (12 ct) — use ${n}`
      : `${pkgs} bags tostadas (12 ct each)`;
  }

  if (match(item, "gyoza wrapper", "dumpling wrapper", "wonton wrapper")) {
    const n = Math.ceil(scaledQty);
    const pkgs = Math.ceil(n / 40);
    return pkgs <= 1
      ? `1 package ${item} (40 ct) — use ${n}`
      : `${pkgs} packages ${item} (40 ct each)`;
  }

  if (match(item, "nori", "roasted seaweed")) {
    const n = Math.ceil(scaledQty);
    return n <= 5
      ? `1 package roasted nori (10 sheets) — use ${n}`
      : `${Math.ceil(n / 10)} packages roasted nori (10 sheets each)`;
  }

  // ── Noodles ──────────────────────────────────────────────────────────────
  if (match(item, "ramen noodle", "instant ramen")) {
    const n = Math.ceil(scaledQty);
    return `${plural(n, "package")} ramen noodles (3 oz each)`;
  }

  if (match(item, "soba noodle", "buckwheat noodle")) {
    const n = match(item, "bundle") ? scaledQty : Math.ceil(scaledQty);
    return `${plural(Math.ceil(n), "bundle")} soba noodles (from a 14 oz package)`;
  }

  if (match(item, "yakisoba", "udon")) {
    const n = Math.ceil(scaledQty);
    return `${plural(n, "portion")} ${item} (fresh or refrigerated package)`;
  }

  // ── Rice ─────────────────────────────────────────────────────────────────
  if (match(item, "sushi rice", "jasmine rice", "white rice", "brown rice",
    "basmati rice")) {
    if (unit === "cup" || unit === "cups") {
      const bags = Math.ceil(scaledQty / 9); // 2 lb bag ≈ 9 cups dry
      return bags <= 1 ? `1 bag (2 lb) ${item}` : `${bags} bags (2 lb each) ${item}`;
    }
    if (unit === "g" || unit === "kg") {
      const g = unit === "kg" ? scaledQty * 1000 : scaledQty;
      const bags = Math.ceil(g / 900);
      return bags <= 1 ? `1 bag (2 lb) ${item}` : `${bags} bags (2 lb each) ${item}`;
    }
  }

  // ── Oats ─────────────────────────────────────────────────────────────────
  if (match(item, "rolled oat", "old-fashioned oat", "quick oat")) {
    if (unit === "cup" || unit === "cups") {
      return `1 canister (42 oz) rolled oats — use ${fmt(scaledQty)} cup${scaledQty !== 1 ? "s" : ""}`;
    }
  }

  // ── Dried chiles ─────────────────────────────────────────────────────────
  if (match(item, "guajillo", "ancho", "pasilla", "mulato", "morita",
    "chile de árbol", "cascabel", "dried chile")) {
    const n = Math.ceil(scaledQty);
    return `${n} dried ${item} (sold loose or in a 2 oz bag)`;
  }

  // ── Produce sold by count ────────────────────────────────────────────────
  if (match(item, "lime", "lemon") && (unit === "" || unit === "fresh")) {
    const n = Math.ceil(scaledQty);
    const bags = Math.ceil(n / 5);
    return n <= 3
      ? `${n} fresh ${n === 1 ? item.replace(/s$/, "") : item}`
      : bags <= 1 ? `1 bag ${item}s (5 ct)` : `${bags} bags ${item}s (5 ct each)`;
  }

  if (match(item, "avocado")) {
    const n = Math.ceil(scaledQty);
    return `${plural(n, "avocado")}`;
  }

  // ── Oils ─────────────────────────────────────────────────────────────────
  if (match(item, "vegetable oil", "canola oil", "olive oil", "sesame oil",
    "chili oil")) {
    return `1 bottle ${item} — use ${fmt(scaledQty)} ${unit || "tbsp"}`;
  }

  // ── Soy sauce / tamari ───────────────────────────────────────────────────
  if (match(item, "soy sauce", "tamari", "shoyu")) {
    return `1 bottle ${item} — use ${fmt(scaledQty)} ${unit || "tbsp"}`;
  }

  // ── Default: plain label ─────────────────────────────────────────────────
  return `${fmt(scaledQty)} ${ing.unit} ${item}`.trim();
}
