export type VendorSearchKind = "asian" | "mexican" | "market" | "international";

export type VendorSearch = {
  kind: VendorSearchKind;
  url: string;
};

const SEARCH_TERMS: Array<[VendorSearchKind, string]> = [
  ["asian", "Asian grocery store"],
  ["mexican", "Mexican grocery store"],
  ["market", "farmers market"],
  ["international", "international grocery store"],
];

/**
 * Creates live, universal Google Maps searches. Results and distance are owned
 * by the maps provider, so the app never presents a hard-coded listing as live.
 */
export function vendorSearchesForLocation(location: string): VendorSearch[] {
  const normalized = location.trim().replace(/\s+/g, " ").slice(0, 80);
  if (!normalized) return [];

  return SEARCH_TERMS.map(([kind, term]) => {
    const url = new URL("https://www.google.com/maps/search/");
    url.searchParams.set("api", "1");
    url.searchParams.set("query", `${term} near ${normalized}`);
    url.searchParams.set("utm_source", "mestizo_umami");
    url.searchParams.set("utm_campaign", "vendor_search");
    return { kind, url: url.toString() };
  });
}
