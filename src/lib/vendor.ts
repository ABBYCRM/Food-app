/* Local vendor lookup. We ship a curated seed of farmers-market & Mexican-Asian
   grocers tied to a small starter set of major-metro ZIP prefixes. For ZIPs
   not in the seed, we still expose the universal delivery services. */

export type LocalVendor = {
  name: string;
  city: string;
  state: string;
  kind: "market" | "mexican" | "asian" | "general";
  phone?: string;
  url?: string;
  miles: number;
};

const SEED: Record<string, LocalVendor[]> = {
  "100": [
    { name: "Sunrise Mart (Japanese)", city: "New York", state: "NY", kind: "asian", url: "https://www.sunrisemart-ny.com/", miles: 0.6 },
    { name: "Casa Adela / La Hacienda", city: "New York", state: "NY", kind: "mexican", miles: 1.1 },
    { name: "Union Square Greenmarket", city: "New York", state: "NY", kind: "market", url: "https://www.grownyc.org/greenmarket/manhattan-union-square", miles: 0.4 },
  ],
  "112": [
    { name: "Sahadi's", city: "Brooklyn", state: "NY", kind: "general", url: "https://sahadis.com/", miles: 0.8 },
    { name: "Brooklyn Kura / Asian Pantry Co.", city: "Brooklyn", state: "NY", kind: "asian", miles: 2.1 },
  ],
  "900": [
    { name: "Grand Central Market", city: "Los Angeles", state: "CA", kind: "market", url: "https://grandcentralmarket.com/", miles: 1.2 },
    { name: "Mariscos Jalisco (truck)", city: "Los Angeles", state: "CA", kind: "mexican", miles: 2.4 },
    { name: "Marukai Market", city: "Los Angeles", state: "CA", kind: "asian", url: "https://www.tokyocentral.com/", miles: 3.1 },
  ],
  "902": [
    { name: "Northgate González Market", city: "Anaheim area", state: "CA", kind: "mexican", url: "https://northgatemarket.com/", miles: 1.7 },
    { name: "99 Ranch Market", city: "Buena Park", state: "CA", kind: "asian", url: "https://www.99ranch.com/", miles: 2.0 },
  ],
  "941": [
    { name: "Ferry Plaza Farmers Market", city: "San Francisco", state: "CA", kind: "market", url: "https://www.foodwise.org/markets/ferry-plaza", miles: 0.5 },
    { name: "Casa Lucas Market", city: "San Francisco", state: "CA", kind: "mexican", miles: 1.6 },
    { name: "Nijiya Market", city: "San Francisco", state: "CA", kind: "asian", url: "https://www.nijiya.com/", miles: 1.3 },
  ],
  "606": [
    { name: "Carnicería Jiménez", city: "Chicago", state: "IL", kind: "mexican", miles: 1.4 },
    { name: "Mitsuwa Marketplace", city: "Arlington Heights", state: "IL", kind: "asian", url: "https://www.mitsuwa.com/", miles: 14.2 },
    { name: "Green City Market", city: "Chicago", state: "IL", kind: "market", url: "https://www.greencitymarket.org/", miles: 2.0 },
  ],
  "331": [
    { name: "El Palacio de los Jugos", city: "Miami", state: "FL", kind: "general", miles: 2.8 },
    { name: "Lucky Oriental Mart", city: "Miami", state: "FL", kind: "asian", miles: 4.0 },
  ],
  "770": [
    { name: "Fiesta Mart", city: "Houston", state: "TX", kind: "general", url: "https://www.fiestamart.com/", miles: 1.5 },
    { name: "H Mart Houston", city: "Houston", state: "TX", kind: "asian", url: "https://www.hmart.com/", miles: 6.4 },
  ],
  "787": [
    { name: "MT Supermarket", city: "Austin", state: "TX", kind: "asian", miles: 5.2 },
    { name: "El Borrego de Oro / La Michoacana", city: "Austin", state: "TX", kind: "mexican", miles: 2.3 },
    { name: "SFC Farmers' Market", city: "Austin", state: "TX", kind: "market", url: "https://sfcfarmersmarket.org/", miles: 1.1 },
  ],
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
  return SEED[z3] ?? [];
}

export function knownZipPrefixes(): string[] {
  return Object.keys(SEED);
}
