/**
 * Unit conversion for ingredient display.
 * EN → imperial (lb, oz, cups, tbsp, tsp, °F)
 * ES / PT → metric (kg, g, ml, L, °C)
 *
 * Neutral units (piece, clove, slice, sheet, can, bunch, etc.) are never converted.
 */

import type { UnitSystem } from "./locale";

// ─── Fraction / decimal helpers ───────────────────────────────────────────────

export function parseQtyNum(qty: string): number {
  const t = qty.trim();
  const mixed = t.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return +mixed[1] + +mixed[2] / +mixed[3];
  const simple = t.match(/^(\d+)\/(\d+)$/);
  if (simple) return +simple[1] / +simple[2];
  return parseFloat(t) || 0;
}

const VULGAR: [number, string][] = [
  [0.125, "⅛"], [0.167, "⅙"], [0.25, "¼"], [0.333, "⅓"],
  [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.667, "⅔"],
  [0.75, "¾"], [0.833, "⅚"], [0.875, "⅞"],
];

function toFraction(n: number): string {
  if (n <= 0) return "0";
  const whole = Math.floor(n);
  const frac = n - whole;
  if (frac < 0.04) return whole > 0 ? String(whole) : "0";
  if (frac > 0.96) return String(whole + 1);
  const best = VULGAR.reduce((a, b) =>
    Math.abs(b[0] - frac) < Math.abs(a[0] - frac) ? b : a
  );
  if (Math.abs(best[0] - frac) < 0.07) {
    return whole > 0 ? `${whole} ${best[1]}` : best[1];
  }
  // fallback: simple fraction
  const n8 = Math.round(frac * 8);
  if (n8 === 0) return String(whole);
  if (n8 === 8) return String(whole + 1);
  const g = gcd(n8, 8);
  const fStr = `${n8 / g}/${8 / g}`;
  return whole > 0 ? `${whole} ${fStr}` : fStr;
}

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

function roundMetric(val: number): string {
  if (val < 1) return val.toFixed(1).replace(/\.0$/, "");
  if (val < 10) return Number(val.toFixed(1)).toString();
  if (val < 100) return String(Math.round(val / 5) * 5);
  if (val < 1000) return String(Math.round(val / 10) * 10);
  return String(Math.round(val));
}

// ─── ml → best imperial volume unit ──────────────────────────────────────────

function mlToImperialUnit(ml: number): { qty: string; unit: string } {
  const cups = ml / 236.588;
  const tbsp = ml / 14.787;
  const tsp  = ml / 4.929;

  if (cups >= 0.25) {
    // express in cups (and qt if ≥ 4 cups)
    if (cups >= 4) {
      const qt = cups / 4;
      return { qty: toFraction(qt), unit: qt === 1 ? "qt" : "qt" };
    }
    return { qty: toFraction(cups), unit: "cup" };
  }
  if (tbsp >= 1) return { qty: toFraction(tbsp), unit: tbsp === 1 ? "tbsp" : "tbsp" };
  if (tsp >= 0.25) return { qty: toFraction(tsp), unit: "tsp" };
  // very small — keep ml
  return { qty: roundMetric(ml), unit: "ml" };
}

// ─── g/kg → best imperial weight unit ────────────────────────────────────────

function gramToImperialUnit(g: number): { qty: string; unit: string } {
  const oz = g / 28.3495;
  const lb = g / 453.592;
  if (lb >= 0.25) return { qty: toFraction(lb), unit: "lb" };
  if (oz >= 0.25) return { qty: toFraction(oz), unit: "oz" };
  return { qty: roundMetric(g), unit: "g" };
}

// ─── cup/tbsp/tsp → ml / L ───────────────────────────────────────────────────

function imperialVolumeToMetric(val: number, unit: string): { qty: string; unit: string } {
  const factors: Record<string, number> = {
    cup: 236.588, cups: 236.588,
    tbsp: 14.787, tbs: 14.787,
    tsp: 4.929,
    "fl oz": 29.574, floz: 29.574,
    "fl. oz": 29.574,
    qt: 946.353, quart: 946.353,
    pint: 473.176, pt: 473.176,
  };
  const ml = val * (factors[unit.toLowerCase()] ?? 1);
  if (ml >= 1000) return { qty: roundMetric(ml / 1000), unit: "L" };
  return { qty: roundMetric(ml), unit: "ml" };
}

// ─── lb / oz → g / kg ────────────────────────────────────────────────────────

function imperialWeightToMetric(val: number, unit: string): { qty: string; unit: string } {
  const g = unit.toLowerCase() === "lb" ? val * 453.592 : val * 28.3495;
  if (g >= 1000) return { qty: roundMetric(g / 1000), unit: "kg" };
  return { qty: roundMetric(g), unit: "g" };
}

// ─── Neutral units (never converted) ─────────────────────────────────────────

const NEUTRAL_UNITS = new Set([
  "", "piece", "pieces", "pcs", "pc",
  "clove", "cloves", "head", "heads",
  "slice", "slices",
  "sheet", "sheets",
  "can", "cans",
  "jar", "jars",
  "bunch", "bunches",
  "stalk", "stalks",
  "sprig", "sprigs",
  "leaf", "leaves",
  "pod", "pods",
  "strip", "strips",
  "portion", "portions",
  "package", "packages", "pkg",
  "block", "blocks",
  "stick", "sticks",
  "pinch", "pinches",
  "dash", "dashes",
  "handful", "handfuls",
  "whole", "large", "medium", "small",
  "to taste",
  "link", "links",
  "ear", "ears",
  "fillet", "fillets",
]);

function isNeutral(unit: string): boolean {
  return NEUTRAL_UNITS.has(unit.toLowerCase().trim());
}

// ─── Temperature conversion in method text ────────────────────────────────────

/**
 * Localizes temperature references in method step text.
 * Steps from enhanced recipes include both: "375°F (190°C)"
 * - For imperial: show "375°F" only (strip parenthetical °C)
 * - For metric:   show "190°C" only (strip leading °F)
 */
export function localizeTemp(text: string, system: UnitSystem): string {
  if (system === "imperial") {
    // Remove parenthetical Celsius: "375°F (190°C)" → "375°F"
    return text
      .replace(/(\d+(?:\.\d+)?°F)\s*\(\d+(?:\.\d+)?°C\)/g, "$1")
      .replace(/(\d+(?:\.\d+)?°C)\s*\((\d+(?:\.\d+)?°F)\)/g, "$2"); // reverse format
  } else {
    // Keep only Celsius: "375°F (190°C)" → "190°C"
    return text
      .replace(/\d+(?:\.\d+)?°F\s*\((\d+(?:\.\d+)?°C)\)/g, "$1")
      .replace(/(\d+(?:\.\d+)?°C)\s*\(\d+(?:\.\d+)?°F\)/g, "$1"); // reverse format
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Convert an already-scaled quantity+unit pair to the target measurement system.
 * Returns { qty: string, unit: string } for display.
 */
export function convertUnit(
  scaledQty: number,
  unit: string,
  system: UnitSystem,
): { qty: string; unit: string } {
  if (scaledQty <= 0) return { qty: "0", unit };
  const u = unit.trim();

  if (isNeutral(u)) return { qty: toFraction(scaledQty), unit: u };

  const uLower = u.toLowerCase();

  if (system === "imperial") {
    // Metric → Imperial
    switch (uLower) {
      case "kg":
        return gramToImperialUnit(scaledQty * 1000);
      case "g":
        return gramToImperialUnit(scaledQty);
      case "ml":
        return mlToImperialUnit(scaledQty);
      case "l":
        return mlToImperialUnit(scaledQty * 1000);
      default:
        // Already imperial or unknown → keep as-is
        return { qty: toFraction(scaledQty), unit: u };
    }
  } else {
    // Imperial → Metric
    switch (uLower) {
      case "lb":
      case "lbs":
        return imperialWeightToMetric(scaledQty, "lb");
      case "oz":
        return imperialWeightToMetric(scaledQty, "oz");
      case "cup":
      case "cups":
        return imperialVolumeToMetric(scaledQty, "cup");
      case "tbsp":
      case "tbs":
        return imperialVolumeToMetric(scaledQty, "tbsp");
      case "tsp":
        return imperialVolumeToMetric(scaledQty, "tsp");
      case "fl oz":
      case "fl. oz":
        return imperialVolumeToMetric(scaledQty, "fl oz");
      case "qt":
      case "quart":
        return imperialVolumeToMetric(scaledQty, "qt");
      case "pint":
      case "pt":
        return imperialVolumeToMetric(scaledQty, "pint");
      default:
        // Already metric or unknown → keep as-is
        return { qty: roundMetric(scaledQty), unit: u };
    }
  }
}
