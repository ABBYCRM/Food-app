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

/* Single-tab multi-item search. The user lands on a results page with all
   the items at once — no popup blocker, no API approval. Works for
   Instacart and Walmart (both accept free-text multi-word queries).

   Why not the Instacart shopping-list API? The `?add_items=` parameter
   is only valid on Connect-API-generated pages
   (https://docs.instacart.com/developer_platform_api/...). The public
   site's /store/shopping_list path 404s. */
export function singleTabSearchUrl(
  retailer: "instacart" | "walmart",
  queries: string[],
  zip?: string
): string {
  const cleaned = queries
    .map((q) => q.trim())
    .filter(Boolean)
    .slice(0, 8)
    .map((q) => q.replace(/[+&]/g, " "))  /* + and & break query strings */
    .join(" ");
  if (retailer === "instacart") {
    const params = new URLSearchParams({ k: cleaned });
    if (zip) params.set("zip", zip);
    return `https://www.instacart.com/store/s?${params.toString()}`;
  }
  /* Walmart */
  const params = new URLSearchParams({ q: cleaned });
  return `https://www.walmart.com/search?${params.toString()}`;
}

/* Backwards-compat alias for the older single-retailer name. */
export const instacartShoppingListUrl = (
  queries: string[],
  zip?: string
) => singleTabSearchUrl("instacart", queries, zip);

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

/* Build a clean plain-text shopping list. One ingredient per line, with the
   amount + unit + display name. Pastes cleanly into Notes, email, or any
   retailer's search bar. No commas, no ampersands, no special chars. */
export function shoppingListAsText(items: ConsolidatedItem[]): string {
  return items
    .map((item) => {
      /* Drop the "×N" — it's a planner-internal count, not shopping info. */
      return `• ${item.display}`;
    })
    .join("\n");
}

/* Copy to clipboard. Returns true on success, false if the browser blocks
   the Clipboard API (e.g. insecure context, denied permission). The caller
   shows a toast on success. */
export async function copyShoppingListToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* Build a mailto: link with the shopping list pre-filled. Works on every
   device with an email app — iOS, Android, desktop. No backend, no API. */
export function emailShoppingListUrl(subject: string, body: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
