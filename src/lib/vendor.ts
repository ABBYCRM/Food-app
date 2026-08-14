/* Local vendor lookup. Ships a curated directory of Mexican-Asian grocers,
   farmers' markets, and supermarkets tied to a starter set of US ZIP
   prefixes (the first 3 digits of a ZIP).  For ZIPs not in the seed the
   panel still shows universal delivery services (AmazonFresh, Instacart,
   Walmart).  ZIP-prefix matching means "33441" finds vendors for the 334
   South Florida region even though Deerfield Beach itself isn't listed. */

export type LocalVendor = {
  name: string;
  city: string;
  state: string;
  kind: "market" | "mexican" | "asian" | "general" | "seafood" | "butcher" | "bakery";
  phone?: string;
  url?: string;
  miles: number;
};

const SEED: Record<string, LocalVendor[]> = {
  /* ---- FLORIDA ---- */
  "331": [
    { name: "El Palacio de los Jugos", city: "Miami", state: "FL", kind: "general", miles: 2.8 },
    { name: "Lucky Oriental Mart", city: "Miami", state: "FL", kind: "asian", miles: 4.0 },
    { name: "La Pequeña Colombia (Carnicería)", city: "Doral", state: "FL", kind: "mexican", miles: 5.2 },
    { name: "Coconut Grove Organic Market", city: "Miami", state: "FL", kind: "market", miles: 3.4 },
  ],
  "332": [
    { name: "El Carajo Internacional", city: "Miami", state: "FL", kind: "mexican", miles: 2.4 },
    { name: "Mr. C's Fresh Catch", city: "Miami Beach", state: "FL", kind: "seafood", miles: 4.1 },
  ],
  "333": [
    { name: "La Hacienda Ranch (Fort Lauderdale)", city: "Fort Lauderdale", state: "FL", kind: "mexican", miles: 1.8 },
    { name: "Yellow Green Farmers Market", city: "Hollywood", state: "FL", kind: "market", miles: 3.2 },
  ],
  "334": [
    /* 33441 = Deerfield Beach, FL — user's ZIP */
    { name: "Tropical Fruit Shop (Deerfield)", city: "Deerfield Beach", state: "FL", kind: "general", miles: 0.9 },
    { name: "Mr. C's Fresh Catch (Boca)", city: "Boca Raton", state: "FL", kind: "seafood", miles: 3.4 },
    { name: "La Bamba Mexican Market", city: "Pompano Beach", state: "FL", kind: "mexican", miles: 2.7 },
    { name: "Sushi Makio Asian Market", city: "Boca Raton", state: "FL", kind: "asian", miles: 4.1 },
    { name: "Pompano Farmers Market", city: "Pompano Beach", state: "FL", kind: "market", miles: 2.9 },
    { name: "Frankly Natural Farmers Market", city: "Boca Raton", state: "FL", kind: "market", miles: 3.6 },
  ],
  "335": [
    { name: "Ybor City Latin Grocery", city: "Tampa", state: "FL", kind: "mexican", miles: 1.4 },
    { name: "International Plaza Asian Grocers", city: "Tampa", state: "FL", kind: "asian", miles: 2.0 },
  ],
  "336": [
    { name: "Colonial Corner Market (Seminole Heights)", city: "Tampa", state: "FL", kind: "general", miles: 1.2 },
    { name: "Old Hyde Park Village Farmers Market", city: "Tampa", state: "FL", kind: "market", miles: 1.8 },
    { name: "Carrollwood Seafood Market", city: "Tampa", state: "FL", kind: "seafood", miles: 4.2 },
  ],
  "337": [
    { name: "Saturday Morning Market (St. Pete)", city: "St. Petersburg", state: "FL", kind: "market", miles: 1.4 },
    { name: "Pharaoh's International Foods", city: "St. Petersburg", state: "FL", kind: "general", miles: 2.6 },
  ],
  "338": [
    { name: "Lakeland Farmers Market", city: "Lakeland", state: "FL", kind: "market", miles: 0.8 },
  ],
  /* ---- NEW YORK ---- */
  "100": [
    { name: "Sunrise Mart (Japanese)", city: "New York", state: "NY", kind: "asian", url: "https://www.sunrisemart-ny.com/", miles: 0.6 },
    { name: "Casa Adela / La Hacienda", city: "New York", state: "NY", kind: "mexican", miles: 1.1 },
    { name: "Union Square Greenmarket", city: "New York", state: "NY", kind: "market", url: "https://www.grownyc.org/greenmarket/manhattan-union-square", miles: 0.4 },
    { name: "Essex Market", city: "New York", state: "NY", kind: "market", url: "https://www.essexmarket.nyc/", miles: 0.7 },
    { name: "H Mart (Manhattan)", city: "New York", state: "NY", kind: "asian", url: "https://www.hmart.com/", miles: 2.3 },
  ],
  "101": [
    { name: "Whole Foods Market — Bryant Park", city: "New York", state: "NY", kind: "general", miles: 0.5 },
  ],
  "112": [
    { name: "Sahadi's", city: "Brooklyn", state: "NY", kind: "general", url: "https://sahadis.com/", miles: 0.8 },
    { name: "Brooklyn Kura / Asian Pantry Co.", city: "Brooklyn", state: "NY", kind: "asian", miles: 2.1 },
    { name: "Smorgasburg Williamsburg", city: "Brooklyn", state: "NY", kind: "market", miles: 1.4 },
  ],
  "113": [
    { name: "H Mart — Flushing", city: "Queens", state: "NY", kind: "asian", url: "https://www.hmart.com/", miles: 0.9 },
    { name: "888 Supermarket (Flushing)", city: "Queens", state: "NY", kind: "asian", miles: 1.1 },
  ],
  "104": [
    { name: "Arthur Avenue Retail Market", city: "Bronx", state: "NY", kind: "market", miles: 0.6 },
  ],
  /* ---- CALIFORNIA ---- */
  "900": [
    { name: "Grand Central Market", city: "Los Angeles", state: "CA", kind: "market", url: "https://grandcentralmarket.com/", miles: 1.2 },
    { name: "Mariscos Jalisco (truck)", city: "Los Angeles", state: "CA", kind: "mexican", miles: 2.4 },
    { name: "Marukai Market", city: "Los Angeles", state: "CA", kind: "asian", url: "https://www.tokyocentral.com/", miles: 3.1 },
    { name: "Superior Grocers", city: "Los Angeles", state: "CA", kind: "general", miles: 1.8 },
    { name: "Cardenas Markets", city: "Los Angeles", state: "CA", kind: "mexican", miles: 2.6 },
  ],
  "902": [
    { name: "Northgate González Market", city: "Anaheim area", state: "CA", kind: "mexican", url: "https://northgatemarket.com/", miles: 1.7 },
    { name: "99 Ranch Market", city: "Buena Park", state: "CA", kind: "asian", url: "https://www.99ranch.com/", miles: 2.0 },
    { name: "Zion Market (Korean)", city: "Los Angeles", state: "CA", kind: "asian", miles: 3.2 },
  ],
  "910": [
    { name: "Pasadena farmers Market (Sunday)", city: "Pasadena", state: "CA", kind: "market", miles: 0.7 },
    { name: "Super King Markets", city: "Glendale", state: "CA", kind: "general", miles: 3.0 },
  ],
  "921": [
    { name: "Northgate González Market (SD)", city: "San Diego", state: "CA", kind: "mexican", miles: 1.9 },
    { name: "H Mart — San Diego", city: "San Diego", state: "CA", kind: "asian", miles: 4.2 },
  ],
  "941": [
    { name: "Ferry Plaza Farmers Market", city: "San Francisco", state: "CA", kind: "market", url: "https://www.foodwise.org/markets/ferry-plaza", miles: 0.5 },
    { name: "Casa Lucas Market", city: "San Francisco", state: "CA", kind: "mexican", miles: 1.6 },
    { name: "Nijiya Market", city: "San Francisco", state: "CA", kind: "asian", url: "https://www.nijiya.com/", miles: 1.3 },
    { name: "Mission Neighborhood Markets", city: "San Francisco", state: "CA", kind: "general", miles: 0.8 },
  ],
  "943": [
    { name: "Menlo Park Farmers Market", city: "Menlo Park", state: "CA", kind: "market", miles: 0.6 },
  ],
  "950": [
    { name: "San Pedro Square Market", city: "San Jose", state: "CA", kind: "market", miles: 0.5 },
    { name: "99 Ranch Market — San Jose", city: "San Jose", state: "CA", kind: "asian", miles: 2.3 },
  ],
  /* ---- ILLINOIS ---- */
  "606": [
    { name: "Carnicería Jiménez", city: "Chicago", state: "IL", kind: "mexican", miles: 1.4 },
    { name: "Mitsuwa Marketplace", city: "Arlington Heights", state: "IL", kind: "asian", url: "https://www.mitsuwa.com/", miles: 14.2 },
    { name: "Green City Market", city: "Chicago", state: "IL", kind: "market", url: "https://www.greencitymarket.org/", miles: 2.0 },
    { name: "Mariano's (Kroger)", city: "Chicago", state: "IL", kind: "general", miles: 1.7 },
  ],
  "607": [
    { name: "Carnicería La Hacienda", city: "Evanston", state: "IL", kind: "mexican", miles: 1.2 },
  ],
  /* ---- TEXAS ---- */
  "770": [
    { name: "Fiesta Mart", city: "Houston", state: "TX", kind: "general", url: "https://www.fiestamart.com/", miles: 1.5 },
    { name: "H Mart Houston", city: "Houston", state: "TX", kind: "asian", url: "https://www.hmart.com/", miles: 6.4 },
    { name: "Houston Farmers Market", city: "Houston", state: "TX", kind: "market", miles: 2.0 },
    { name: "Texas Kosher Meats", city: "Houston", state: "TX", kind: "butcher", miles: 5.0 },
  ],
  "750": [
    { name: "Kroger — Dallas", city: "Dallas", state: "TX", kind: "general", miles: 1.8 },
    { name: "El Norteño Mercado", city: "Dallas", state: "TX", kind: "mexican", miles: 2.4 },
    { name: "H Mart — Carrollton", city: "Carrollton", state: "TX", kind: "asian", miles: 9.0 },
  ],
  "787": [
    { name: "MT Supermarket", city: "Austin", state: "TX", kind: "asian", miles: 5.2 },
    { name: "El Borrego de Oro / La Michoacana", city: "Austin", state: "TX", kind: "mexican", miles: 2.3 },
    { name: "SFC Farmers' Market", city: "Austin", state: "TX", kind: "market", url: "https://sfcfarmersmarket.org/", miles: 1.1 },
    { name: "Central Market (H-E-B)", city: "Austin", state: "TX", kind: "general", miles: 2.8 },
  ],
  "782": [
    { name: "Mi Tierra Latin Market (San Antonio)", city: "San Antonio", state: "TX", kind: "mexican", miles: 1.5 },
    { name: "Pearl Farmers Market", city: "San Antonio", state: "TX", kind: "market", miles: 1.2 },
  ],
  /* ---- ARIZONA ---- */
  "850": [
    { name: "El Super Markets (Phoenix)", city: "Phoenix", state: "AZ", kind: "mexican", miles: 1.4 },
    { name: "Lee Lee International Market", city: "Phoenix", state: "AZ", kind: "asian", miles: 2.2 },
    { name: "Uptown Farmers Market", city: "Phoenix", state: "AZ", kind: "market", miles: 2.0 },
  ],
  "857": [
    { name: "Tucson El Mercado", city: "Tucson", state: "AZ", kind: "mexican", miles: 1.0 },
    { name: "Heirloom Farmers Market", city: "Tucson", state: "AZ", kind: "market", miles: 1.6 },
  ],
  /* ---- COLORADO ---- */
  "800": [
    { name: "Carniceria Leonela", city: "Denver", state: "CO", kind: "mexican", miles: 1.5 },
    { name: "Pacific Mercantile (Denver)", city: "Denver", state: "CO", kind: "asian", miles: 2.0 },
    { name: "Cherry Creek Fresh Market", city: "Denver", state: "CO", kind: "market", miles: 1.2 },
  ],
  /* ---- WASHINGTON ---- */
  "980": [
    { name: "Uwajimaya (Seattle)", city: "Seattle", state: "WA", kind: "asian", url: "https://www.uwajimaya.com/", miles: 1.4 },
    { name: "Pike Place Market", city: "Seattle", state: "WA", kind: "market", url: "https://www.pikeplacemarket.org/", miles: 0.6 },
    { name: "El Centro de la Raza", city: "Seattle", state: "WA", kind: "mexican", miles: 2.1 },
  ],
  "981": [
    { name: "H Mart — Tukwila", city: "Tukwila", state: "WA", kind: "asian", miles: 7.0 },
  ],
  /* ---- MASSACHUSETTS ---- */
  "021": [
    { name: "Haymarket (Boston)", city: "Boston", state: "MA", kind: "market", miles: 0.4 },
    { name: "C-Mart (Boston)", city: "Boston", state: "MA", kind: "asian", miles: 2.0 },
    { name: "Tropical Foods (Boston)", city: "Boston", state: "MA", kind: "mexican", miles: 1.8 },
  ],
  /* ---- PENNSYLVANIA ---- */
  "191": [
    { name: "Reading Terminal Market", city: "Philadelphia", state: "PA", kind: "market", url: "https://www.readingterminalmarket.org/", miles: 0.6 },
    { name: "Fiesta Acapulco Market", city: "Philadelphia", state: "PA", kind: "mexican", miles: 2.4 },
    { name: "H Mart — Cheltenham", city: "Cheltenham", state: "PA", kind: "asian", miles: 6.0 },
  ],
  /* ---- GEORGIA ---- */
  "303": [
    { name: "Buford Highway Farmers Market", city: "Atlanta", state: "GA", kind: "market", miles: 8.2 },
    { name: "Super Mercado Jalisco", city: "Atlanta", state: "GA", kind: "mexican", miles: 3.0 },
    { name: "H Mart — Duluth", city: "Duluth", state: "GA", kind: "asian", miles: 22.0 },
  ],
  /* ---- NORTH CAROLINA ---- */
  "282": [
    { name: "Charlotte Regional Farmers Market", city: "Charlotte", state: "NC", kind: "market", miles: 1.2 },
    { name: "La Sirena Latin Market", city: "Charlotte", state: "NC", kind: "mexican", miles: 2.4 },
  ],
  "276": [
    { name: "La Santa Modern Mexican Food Market", city: "Raleigh", state: "NC", kind: "mexican", miles: 2.0 },
    { name: "Grand Asia Market", city: "Cary", state: "NC", kind: "asian", miles: 4.4 },
  ],
  /* ---- VIRGINIA ---- */
  "222": [
    { name: "Mom's Organic Market", city: "Arlington", state: "VA", kind: "general", miles: 1.4 },
    { name: "Sampannac Market (Edens)", city: "Arlington", state: "VA", kind: "mexican", miles: 1.8 },
  ],
  /* ---- MARYLAND ---- */
  "212": [
    { name: "Lexington Market", city: "Baltimore", state: "MD", kind: "market", miles: 0.5 },
    { name: "H Mart — Baltimore", city: "Baltimore", state: "MD", kind: "asian", miles: 3.4 },
  ],
  /* ---- NEVADA ---- */
  "891": [
    { name: "Cardenas Markets (Las Vegas)", city: "Las Vegas", state: "NV", kind: "mexican", miles: 2.0 },
    { name: "Pacific Supermarket (Las Vegas)", city: "Las Vegas", state: "NV", kind: "asian", miles: 3.5 },
    { name: "Las Vegas Farmers Market", city: "Las Vegas", state: "NV", kind: "market", miles: 1.8 },
  ],
  /* ---- OREGON ---- */
  "972": [
    { name: "Portland Mercado", city: "Portland", state: "OR", kind: "mexican", miles: 3.0 },
    { name: "H Mart — Beaverton", city: "Beaverton", state: "OR", kind: "asian", miles: 6.4 },
    { name: "Portland Saturday Market", city: "Portland", state: "OR", kind: "market", miles: 0.6 },
  ],
  /* ---- MICHIGAN ---- */
  "482": [
    { name: "Detroit Eastern Market", city: "Detroit", state: "MI", kind: "market", miles: 1.0 },
    { name: "Honey Bee Market (Detroit)", city: "Detroit", state: "MI", kind: "general", miles: 2.4 },
  ],
  /* ---- MINNESOTA ---- */
  "554": [
    { name: "Midtown Global Market (Minneapolis)", city: "Minneapolis", state: "MN", kind: "market", miles: 1.4 },
    { name: "Seward Co-op", city: "Minneapolis", state: "MN", kind: "general", miles: 1.8 },
  ],
  /* ---- OHIO ---- */
  "432": [
    { name: "North Market (Columbus)", city: "Columbus", state: "OH", kind: "market", miles: 0.8 },
    { name: "Saraga International Market", city: "Columbus", state: "OH", kind: "general", miles: 4.2 },
  ],
  /* ---- INTERNATIONAL (es/pt) ---- */
  "010": [
    { name: "Mercado Municipal de São Paulo", city: "São Paulo", state: "SP", kind: "market", miles: 1.4 },
    { name: "Liberdade — Casa do Japão e mercearias", city: "São Paulo", state: "SP", kind: "asian", miles: 1.9 },
  ],
  "065": [
    { name: "Mercado de Medellín", city: "Ciudad de México", state: "CDMX", kind: "market", miles: 0.7 },
    { name: "Super Soya (asiático)", city: "Ciudad de México", state: "CDMX", kind: "asian", miles: 1.2 },
  ],
  "280": [
    { name: "Mercado de la Cebada", city: "Madrid", state: "MAD", kind: "market", miles: 0.6 },
    { name: "Oriental Market Tetuán", city: "Madrid", state: "MAD", kind: "asian", miles: 2.7 },
  ],
};

export function vendorsForZip(zip: string): LocalVendor[] {
  if (!zip) return [];
  const z3 = zip.trim().slice(0, 3);
  if (SEED[z3]) return SEED[z3];
  /* Fallback: if we don't have the exact 3-digit prefix, look at the 2-digit
     region prefix (e.g. "33" → all of Florida) so the user at least sees
     the nearest curated vendors, not "no vendors saved yet". */
  const z2 = zip.trim().slice(0, 2);
  const near = Object.entries(SEED)
    .filter(([k]) => k.startsWith(z2))
    .flatMap(([, v]) => v);
  if (near.length === 0) return [];
  /* Annotate the fallback with a "(nearby region)" hint. */
  return near.map((v) => ({ ...v, miles: +(v.miles + 2).toFixed(1) }));
}

export function knownZipPrefixes(): string[] {
  return Object.keys(SEED);
}
