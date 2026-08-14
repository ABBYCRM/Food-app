/* Local vendor lookup. Hits OpenStreetMap in real time via the free
   public Overpass API (https://overpass-api.de/) and the free public
   Nominatim geocoder (https://nominatim.org/release-docs/latest/) — no
   API key required, no signup, no rate-limit anxiety.  Returns
   supermarkets, convenience stores, greengrocers, butchers, seafood
   shops, bakeries, organic stores, and farmers' markets within ~8 mi
   (12 km) of any US ZIP code.  Stores are real, named, and currently
   operating (OSM is community-maintained and updated continuously). */

export type LocalVendor = {
  name: string;
  brand?: string;
  city: string;
  state: string;
  kind:
    | "market"
    | "mexican"
    | "asian"
    | "general"
    | "seafood"
    | "butcher"
    | "bakery"
    | "organic"
    | "greengrocer";
  phone?: string;
  url?: string;
  address?: string;
  hours?: string;
  miles: number;
  lat: number;
  lon: number;
};

/* --- free public APIs --- */
const NOMINATIM = "https://nominatim.openstreetmap.org";
const OVERPASS = "https://overpass-api.de/api/interpreter";
const UA = "MestizoUmami/1.0 (https://food-app-locf2.ondigitalocean.app; food-app vendor-finder)";

/* --- distance helper (haversine, miles) --- */
function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

/* --- geocode a ZIP via Nominatim (free, no key) --- */
async function geocodeZip(zip: string): Promise<{ lat: number; lon: number; city: string; state: string } | null> {
  const url = `${NOMINATIM}/search?postalcode=${encodeURIComponent(zip)}&country=US&format=json&limit=1`;
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "en" } });
  if (!res.ok) return null;
  const arr = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;
  if (arr.length === 0) return null;
  const { lat, lon, display_name } = arr[0];
  /* display_name looks like:
     "33441, Deerfield Beach, Broward County, Florida, United States" */
  const parts = display_name.split(",").map((p) => p.trim());
  const city = parts[1] ?? "";
  const state = parts[3] ?? "";
  return { lat: parseFloat(lat), lon: parseFloat(lon), city, state };
}

/* --- fetch the radius around (lat,lon) via Overpass --- */
async function fetchStores(
  lat: number,
  lon: number,
  radiusKm = 12,
): Promise<Array<{
  name: string;
  brand?: string;
  kind: LocalVendor["kind"];
  phone?: string;
  url?: string;
  address?: string;
  hours?: string;
  lat: number;
  lon: number;
}>> {
  /* Bounding box for the Overpass `bbox` filter: (S, W, N, E) */
  const dLat = radiusKm / 111;
  const dLon = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));
  const s = lat - dLat;
  const n = lat + dLat;
  const w = lon - dLon;
  const e = lon + dLon;
  const bbox = `${s},${w},${n},${e}`;

  const query = `[out:json][timeout:20];
(
  node["shop"~"supermarket|convenience|greengrocer|butcher|seafood|bakery|organic|deli|health_food"](${bbox});
  way["shop"~"supermarket|convenience|greengrocer|butcher|seafood|bakery|organic|deli|health_food"](${bbox});
  node["amenity"="marketplace"](${bbox});
  way["amenity"="marketplace"](${bbox});
);
out body center 60;`;

  const res = await fetch(OVERPASS, {
    method: "POST",
    headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ data: query }).toString(),
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { elements?: Array<{
    type: string;
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags?: Record<string, string>;
  }> };
  const elements = json.elements ?? [];
  return elements
    .map((el) => {
      const tags = el.tags ?? {};
      const name = tags.name || tags.brand || tags.operator || "Local market";
      const shop = tags.shop || tags.amenity || "";
      const kind: LocalVendor["kind"] =
        shop === "supermarket" ? "general" :
        shop === "greengrocer" ? "greengrocer" :
        shop === "butcher" ? "butcher" :
        shop === "seafood" ? "seafood" :
        shop === "bakery" ? "bakery" :
        shop === "organic" || shop === "health_food" ? "organic" :
        shop === "deli" ? "mexican" :     /* deli is closest to ethnic/independent */
        tags.amenity === "marketplace" ? "market" :
        "general";
      const lat = el.lat ?? el.center?.lat ?? 0;
      const lon = el.lon ?? el.center?.lon ?? 0;
      const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
      return {
        name,
        brand: tags.brand,
        kind,
        phone: tags.phone,
        url: tags.website,
        address: street || undefined,
        hours: tags.opening_hours,
        lat,
        lon,
      };
    })
    /* dedupe by name+lat (Overpass sometimes returns the same store twice
       as both node and way centroid). */
    .filter((s, i, arr) => arr.findIndex((x) => x.name === s.name && Math.abs(x.lat - s.lat) < 0.001) === i)
    .filter((s) => s.name !== "Local market");
}

/* --- public API used by the panel --- */
export type VendorsResult = {
  vendors: LocalVendor[];
  city: string;
  state: string;
  cached: boolean;
  fetchedAt: number;
};

const MEMORY_CACHE = new Map<string, VendorsResult>();
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;   /* 6h — OSM data doesn't change fast */

export async function searchVendorsByZip(zip: string): Promise<VendorsResult> {
  const key = zip.trim();
  if (!key) return { vendors: [], city: "", state: "", cached: false, fetchedAt: 0 };
  const cached = MEMORY_CACHE.get(key);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return { ...cached, cached: true };
  }
  const geo = await geocodeZip(key);
  if (!geo) return { vendors: [], city: "", state: "", cached: false, fetchedAt: Date.now() };
  const stores = await fetchStores(geo.lat, geo.lon);
  const vendors: LocalVendor[] = stores
    .map((s) => ({
      ...s,
      city: geo.city,
      state: geo.state,
      miles: +haversineMiles(geo.lat, geo.lon, s.lat, s.lon).toFixed(1),
    }))
    .sort((a, b) => a.miles - b.miles)
    .slice(0, 30);
  const result: VendorsResult = {
    vendors,
    city: geo.city,
    state: geo.state,
    cached: false,
    fetchedAt: Date.now(),
  };
  MEMORY_CACHE.set(key, result);
  return result;
}

/* --- kept for back-compat with VendorPanel.tsx (which expects a sync return) --- */
export function vendorsForZip(_zip: string): LocalVendor[] {
  return [];
}
export function knownZipPrefixes(): string[] {
  return [];
}
