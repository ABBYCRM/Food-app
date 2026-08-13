import type { Ingredient, Recipe } from "@/data/recipes";
import {
  applyAffiliateAttribution,
  type AffiliateRetailer,
} from "@/lib/affiliate";

export type Retailer = AffiliateRetailer;

export function ingredientQuery(ing: Ingredient): string {
  return ing.shopQuery ?? ing.name.en;
}

export function retailerUrl(retailer: Retailer, query: string, zip?: string): string {
  const q = encodeURIComponent(query);
  let destination: string;
  switch (retailer) {
    case "amazon":
      destination = `https://www.amazon.com/s?k=${q}`;
      break;
    case "amazonFresh":
      destination = `https://www.amazon.com/alm/storefront?almBrandId=QW1hem9uIEZyZXNo&k=${q}`;
      break;
    case "wholeFoods":
      destination = `https://www.amazon.com/s?k=${q}&i=wholefoods`;
      break;
    case "instacart":
      destination = `https://www.instacart.com/store/s?k=${q}${zip ? `&zip=${encodeURIComponent(zip)}` : ""}`;
      break;
    case "walmart":
      destination = `https://www.walmart.com/search?q=${q}`;
      break;
    case "diy":
    default:
      destination = `https://www.google.com/search?q=${q}+near+me`;
      break;
  }
  return applyAffiliateAttribution(retailer, destination);
}

export function multiRetailerUrls(retailer: Retailer, ingredients: Ingredient[], zip?: string): string[] {
  return ingredients.map((i) => retailerUrl(retailer, ingredientQuery(i), zip));
}

export type ConsolidatedItem = {
  query: string;
  display: string;
  sources: string[];
};

export function consolidateForWeek(recipes: Recipe[], locale: "en" | "es" | "pt" = "en"): ConsolidatedItem[] {
  const map = new Map<string, ConsolidatedItem>();
  for (const r of recipes) {
    for (const ing of r.ingredients) {
      const q = ingredientQuery(ing);
      const key = q.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          query: q,
          display: ing.name[locale] ?? ing.name.en,
          sources: [r.slug],
        });
      } else {
        map.get(key)!.sources.push(r.slug);
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.display.localeCompare(b.display));
}

export type OpenResult = { opened: number; blocked: number; total: number };

export function openInNewTab(url: string): boolean {
  if (typeof window === "undefined") return false;
  const win = window.open("about:blank", "_blank");
  if (!win) return false;

  // Sever the opener before navigation so the destination cannot control the
  // application tab. Opening the blank tab first also gives popup blockers an
  // accurate success signal; browsers may return null when `noopener` is used
  // directly even though the destination opened successfully.
  win.opener = null;
  win.location.replace(url);
  return true;
}

/** Opens all URLs during the click gesture and reports popup-blocker rejections. */
export function openMany(urls: string[]): OpenResult {
  if (typeof window === "undefined" || urls.length === 0) {
    return { opened: 0, blocked: 0, total: urls.length };
  }
  let opened = 0;
  let blocked = 0;
  for (const url of urls) {
    if (openInNewTab(url)) opened++;
    else blocked++;
  }
  return { opened, blocked, total: urls.length };
}

/** Build a single URL that searches for many ingredients at once — used as a
 *  popup-blocker fallback so the user can still complete shopping in one tab. */
export function combinedSearchUrl(retailer: Retailer, ingredients: Ingredient[], zip?: string): string {
  const combined = ingredients
    .map(ingredientQuery)
    .filter(Boolean)
    .slice(0, 12)
    .join(", ");
  return retailerUrl(retailer, combined, zip);
}
