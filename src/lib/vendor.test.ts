import { describe, expect, it } from "vitest";
import { vendorSearchesForLocation } from "@/lib/vendor";

describe("live vendor searches", () => {
  it("returns no pretend listings without a location", () => {
    expect(vendorSearchesForLocation("  ")).toEqual([]);
  });

  it("creates encoded HTTPS Google Maps searches for the submitted postal code", () => {
    const results = vendorSearchesForLocation("SW1A 1AA");
    expect(results.map((result) => result.kind)).toEqual([
      "asian", "mexican", "market", "international",
    ]);
    for (const result of results) {
      const url = new URL(result.url);
      expect(url.protocol).toBe("https:");
      expect(url.hostname).toBe("www.google.com");
      expect(url.pathname).toBe("/maps/search/");
      expect(url.searchParams.get("api")).toBe("1");
      expect(url.searchParams.get("query")).toContain("near SW1A 1AA");
    }
  });
});
