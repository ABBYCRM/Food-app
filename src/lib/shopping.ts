import type { Ingredient, Recipe } from "@/data/recipes";

export type Retailer = "amazon" | "amazonFresh" | "wholeFoods" | "instacart" | "walmart" | "diy";

export function ingredientQuery(ing: Ingredient): string {
  return ing.shopQuery ?? ing.name.en;
}

export function retailerUrl(retailer: Retailer, query: string, zip?: string): string {
  const q = encodeURIComponent(query);
  switch (retailer) {
    case "amazon":
      return `https://www.amazon.com/s?k=${q}`;
    case "amazonFresh":
      return `https://www.amazon.com/alm/storefront?almBrandId=QW1hem9uIEZyZXNo&k=${q}`;
    case "wholeFoods":
      return `https://www.amazon.com/s?k=${q}&i=wholefoods`;
    case "instacart":
      return `https://www.instacart.com/store/s?k=${q}${zip ? `&zip=${encodeURIComponent(zip)}` : ""}`;
    case "walmart":
      return `https://www.walmart.com/search?q=${q}`;
    case "diy":
    default:
      return `https://www.google.com/search?q=${q}+near+me`;
  }
}

/* Instacart store-search deep-link. Opens a single tab on Instacart's
   store search with every ingredient packed into one query — the user
   sees the full list on a single results page, picks what they need,
   and adds to cart from there.

   Why not the shopping-list API? The `?add_items=` parameter is only
   available on Connect-API-generated shopping list pages
   (https://docs.instacart.com/developer_platform_api/...). The public
   site's /store/shopping_list path 404s, so we use the working public
   search endpoint. One tab, no popup blocker, no API approval. */
export function instacartShoppingListUrl(queries: string[], zip?: string): string {
  const cleaned = queries
    .map((q) => q.trim())
    .filter(Boolean)
    .slice(0, 8)
    .map((q) => q.replace(/[+&]/g, " "))  /* plus/ampersand break the k= search */
    .join(" ");
  const params = new URLSearchParams({ k: cleaned });
  if (zip) params.set("zip", zip);
  return `https://www.instacart.com/store/s?${params.toString()}`;
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
  const win = window.open(url, "_blank", "noopener,noreferrer");
  return win !== null;
}

/** Opens URLs synchronously inside the user's click gesture and reports any
 *  popup-blocker rejections. Delaying later calls loses gesture authorization
 *  and made the previous result object permanently report stale counters. */
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
