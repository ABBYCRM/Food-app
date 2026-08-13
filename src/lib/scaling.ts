import type { Ingredient, Unit } from "@/data/recipes";
import type { Locale } from "@/i18n";
import { dict } from "@/i18n";

export function formatAmount(amount: number): string {
  if (Number.isInteger(amount)) return String(amount);
  // Try to render simple fractions
  const fractions: Array<[number, string]> = [
    [0.125, "⅛"], [0.25, "¼"], [0.333, "⅓"], [0.375, "⅜"],
    [0.5, "½"], [0.625, "⅝"], [0.666, "⅔"], [0.75, "¾"], [0.875, "⅞"],
  ];
  const whole = Math.floor(amount);
  const frac = amount - whole;
  for (const [v, glyph] of fractions) {
    if (Math.abs(frac - v) < 0.04) {
      return whole > 0 ? `${whole}${glyph}` : glyph;
    }
  }
  return amount.toFixed(amount < 1 ? 2 : 1).replace(/\.?0+$/, "");
}

export function unitLabel(unit: Unit | undefined, locale: Locale): string {
  if (!unit) return "";
  const d = dict[locale];
  return d.units[unit] ?? unit;
}

export function scaledIngredientText(ing: Ingredient, multiplier: number, locale: Locale): string {
  const name = ing.name[locale];
  if (typeof ing.amount === "number") {
    const u = unitLabel(ing.unit, locale);
    const amt = ing.amount * multiplier;
    const unitSeparator = u && (ing.unit !== "piece") ? " " : "";
    const sep = u ? " · " : " · ";
    return `${formatAmount(amt)}${unitSeparator}${u}${sep}${name}`.replace(/^\s+/, "").replace("  ", " ");
  }
  if (ing.qty) return `${ing.qty[locale]} · ${name}`;
  return name;
}

export function scaledIngredientParts(
  ing: Ingredient,
  multiplier: number,
  locale: Locale,
): { qty: string; name: string } {
  const name = ing.name[locale];
  if (typeof ing.amount === "number") {
    const u = unitLabel(ing.unit, locale);
    const amt = ing.amount * multiplier;
    const qty = `${formatAmount(amt)}${u && ing.unit !== "piece" ? " " : ""}${u}`.trim();
    return { qty, name };
  }
  if (ing.qty) return { qty: ing.qty[locale], name };
  return { qty: "", name };
}
