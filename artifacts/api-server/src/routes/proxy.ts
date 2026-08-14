import { Router, type IRouter } from "express";

const router: IRouter = Router();

// Proxy: ZIP → lat/lon via Nominatim (avoids browser CORS / rate-limit issues)
router.get("/geocode", async (req, res) => {
  const { zip } = req.query as { zip?: string };
  if (!zip || !/^\d{5}$/.test(zip)) {
    return res.status(400).json({ error: "A 5-digit ZIP code is required." });
  }
  try {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(zip)}&countrycodes=us&format=json&limit=1`;
    const r = await fetch(url, {
      headers: {
        "User-Agent": "MestizoUmami/1.0 (trilingual-kitchen-app)",
        "Accept-Language": "en",
      },
    });
    if (!r.ok) throw new Error(`Nominatim ${r.status}`);
    return res.json(await r.json());
  } catch (err: any) {
    return res.status(502).json({ error: err.message || "Geocoding failed." });
  }
});

// Proxy: lat/lon → nearby stores via Overpass (avoids browser CORS)
router.post("/stores", async (req, res) => {
  const { lat, lon } = req.body as { lat?: number; lon?: number };
  if (lat == null || lon == null) {
    return res.status(400).json({ error: "lat and lon are required." });
  }
  try {
    const query = [
      "[out:json][timeout:25];",
      "(",
      `node["shop"~"supermarket|grocery|specialty_food|health_food|asian_supermarket|food|organic"](around:8000,${lat},${lon});`,
      `way["shop"~"supermarket|grocery|food"](around:8000,${lat},${lon});`,
      ");out center;",
    ].join("");

    const r = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(30_000),
    });
    if (!r.ok) throw new Error(`Overpass ${r.status}`);
    return res.json(await r.json());
  } catch (err: any) {
    return res.status(502).json({ error: err.message || "Store lookup failed." });
  }
});

export default router;
