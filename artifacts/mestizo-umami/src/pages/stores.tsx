import { useState } from "react";
import { Search, MapPin, ExternalLink, ShoppingCart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Store {
  id: number;
  name: string;
  type: string;
  lat: number;
  lon: number;
  distance: number;
}

function distanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function StoresPage() {
  const { toast } = useToast();
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length !== 5) {
      setError("Please enter a valid 5-digit ZIP code.");
      return;
    }

    setLoading(true);
    setError(null);
    setStores([]);
    setHasSearched(true);

    try {
      // 1. Geocode ZIP via server-side proxy (avoids CORS / User-Agent issues)
      const geoRes = await fetch(`/api/geocode?zip=${encodeURIComponent(zip)}`);
      if (!geoRes.ok) {
        const body = await geoRes.json().catch(() => ({}));
        throw new Error(body.error || "Failed to find location.");
      }
      const geoData = await geoRes.json();
      if (!Array.isArray(geoData) || geoData.length === 0) {
        throw new Error("No location found for this ZIP code. Try another.");
      }

      const lat = parseFloat(geoData[0].lat);
      const lon = parseFloat(geoData[0].lon);

      // 2. Find nearby stores via server-side Overpass proxy
      const storeRes = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon }),
      });
      if (!storeRes.ok) {
        const body = await storeRes.json().catch(() => ({}));
        throw new Error(body.error || "Failed to fetch nearby stores.");
      }
      const storeData = await storeRes.json();

      // 3. Process results
      const results: Store[] = [];
      for (const el of storeData.elements ?? []) {
        const storeLat = el.lat ?? el.center?.lat;
        const storeLon = el.lon ?? el.center?.lon;
        if (!storeLat || !storeLon) continue;
        results.push({
          id: el.id,
          name: el.tags?.name || "Unnamed Store",
          type: el.tags?.shop || "grocery",
          lat: storeLat,
          lon: storeLon,
          distance: distanceMiles(lat, lon, storeLat, storeLon),
        });
      }

      results.sort((a, b) => a.distance - b.distance);
      const top = results.slice(0, 20);
      setStores(top);

      if (top.length === 0) {
        setError("No stores found within 5 miles. Try a different ZIP code.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWaitlist = () => {
    toast({
      title: "You're on the list!",
      description: "We'll notify you when Instant Cart Integration is live.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-12 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl text-primary mb-4">Find Ingredients Near You</h1>
        <p className="text-muted-foreground text-lg">Locate supermarkets and specialty food stores by ZIP code.</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-16 flex gap-3 relative z-10">
        <Input
          type="text"
          pattern="[0-9]{5}"
          maxLength={5}
          placeholder="e.g. 90210"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, ''))}
          className="h-14 text-lg bg-black/40 border-white/10 text-white placeholder:text-muted-foreground"
          required
        />
        <Button
          type="submit"
          disabled={loading}
          className="h-14 px-8 text-sm uppercase tracking-widest font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              Searching
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </span>
          )}
        </Button>
      </form>

      {error && (
        <div className="text-center p-6 bg-destructive/10 border border-destructive/30 rounded-xl mb-12 text-destructive">
          {error}
        </div>
      )}

      {hasSearched && !loading && !error && stores.length === 0 && (
        <div className="text-center p-12 bg-white/5 rounded-2xl mb-12 border border-white/5">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-2xl text-foreground mb-2">No stores found</h3>
          <p className="text-muted-foreground">Try a different ZIP code or expanding your search area.</p>
        </div>
      )}

      {stores.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {stores.map((store, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={store.id}
              className="p-5 rounded-xl border border-white/10 bg-card/50 hover:bg-card/80 transition-colors flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium text-lg text-foreground mb-1 line-clamp-1" title={store.name}>
                  {store.name}
                </h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="uppercase tracking-widest text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {store.type.replace(/_/g, ' ')}
                  </span>
                  <span>{store.distance.toFixed(1)} miles</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                asChild
                className="shrink-0 hover:text-primary hover:bg-primary/10 rounded-full h-10 w-10"
              >
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.name)},${store.lat},${store.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open in Google Maps"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Coming Soon Section */}
      <section className="mt-20 pt-16 border-t border-white/10 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 p-8 md:p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <ShoppingBag className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl text-primary mb-4">
            Instant Cart Integration Coming Soon
          </h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Add all ingredients from any recipe directly to your cart at your nearest store — with one tap.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div className="relative group">
              <Button
                variant="outline"
                size="lg"
                disabled
                className="w-full sm:w-auto h-14 px-8 border-white/10 bg-white/5 opacity-50 text-white cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add All Ingredients
              </Button>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-md backdrop-blur-sm">
                <span className="text-xs uppercase tracking-widest text-primary font-medium">Coming Soon</span>
              </div>
            </div>
            <Button
              onClick={handleWaitlist}
              size="lg"
              className="w-full sm:w-auto h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest text-sm font-medium transition-colors"
            >
              Join the Waitlist
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
