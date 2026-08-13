import { describe, expect, it } from "vitest";
import { createSeoService } from "./seo.js";

describe("SEO and answer-engine discovery", () => {
  it("publishes OAI-SearchBot rules, all recipe URLs, canonical metadata, and honest Recipe schema", async () => {
    const seo = await createSeoService({ publicBaseUrl: "https://food.example" });
    expect(seo.robots()).toContain("User-agent: OAI-SearchBot");
    expect(seo.robots()).toContain("Sitemap: https://food.example/sitemap.xml");
    expect(seo.sitemap()).toContain("<loc>https://food.example/</loc>");
    expect((seo.sitemap().match(/<url>/g) ?? []).length).toBeGreaterThanOrEqual(365);
    const html = seo.render(
      "<html><head><title>Old</title><meta name=\"description\" content=\"Old\" /></head><body></body></html>",
      "/recipe/kimchi-elote",
    );
    expect(html).toContain('<link rel="canonical" href="https://food.example/recipe/kimchi-elote" />');
    expect(html).toContain('"@type":"Recipe"');
    expect(html).toContain("Kimchi Elote");
    expect(html).not.toContain("aggregateRating");
    expect(html).not.toContain("reviewCount");
    expect(html).not.toContain("LowLactoseDiet");
  });

  it("marks account-owned routes noindex", async () => {
    const seo = await createSeoService({ publicBaseUrl: "https://food.example" });
    const html = seo.render(
      "<html><head><title>Old</title><meta name=\"description\" content=\"Old\" /></head><body></body></html>",
      "/notebook",
    );
    expect(html).toContain('<meta name="robots" content="noindex,nofollow" />');
    const shared = seo.render(
      "<html><head><title>Old</title><meta name=\"description\" content=\"Old\" /></head><body></body></html>",
      "/recipe-shared",
    );
    expect(shared).toContain('<meta name="robots" content="noindex,nofollow" />');
    expect(seo.robots()).toContain("Disallow: /recipe-shared");
  });

  it("fails closed to noindex metadata for malformed recipe paths", async () => {
    const seo = await createSeoService({ publicBaseUrl: "https://food.example" });
    expect(() => seo.render(
      "<html><head><title>Old</title><meta name=\"description\" content=\"Old\" /></head><body></body></html>",
      "/recipe/%E0%A4%A",
    )).not.toThrow();
    expect(seo.statusCode("/recipe/%E0%A4%A")).toBe(404);
    expect(seo.statusCode("/recipe/not-a-real-recipe")).toBe(404);
    expect(seo.statusCode("/recipe/kimchi-elote")).toBe(200);
    expect(seo.statusCode("/billing/cancelled")).toBe(200);
    expect(seo.statusCode("/unknown-page")).toBe(404);
  });
});
