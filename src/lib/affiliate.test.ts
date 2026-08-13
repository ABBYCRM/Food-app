import { describe, expect, it } from "vitest";
import { applyAffiliateAttribution } from "@/lib/affiliate";

describe("applyAffiliateAttribution", () => {
  it("adds the Amazon tag without losing existing Fresh parameters", () => {
    const result = applyAffiliateAttribution(
      "amazonFresh",
      "https://www.amazon.com/alm/storefront?almBrandId=fresh&k=miso",
      { amazonAssociateTag: "mestizo-20" },
    );
    const url = new URL(result);

    expect(url.searchParams.get("almBrandId")).toBe("fresh");
    expect(url.searchParams.get("k")).toBe("miso");
    expect(url.searchParams.get("tag")).toBe("mestizo-20");
  });

  it("replaces a stale Amazon tag with the configured publisher tag", () => {
    const result = applyAffiliateAttribution(
      "amazon",
      "https://www.amazon.com/s?k=rice&tag=someone-else-20",
      { amazonAssociateTag: "owner-20" },
    );

    expect(new URL(result).searchParams.getAll("tag")).toEqual(["owner-20"]);
  });

  it("does not attach an Amazon tag to a non-Amazon host", () => {
    const destination = "https://example.com/?q=miso";
    expect(
      applyAffiliateAttribution("amazon", destination, {
        amazonAssociateTag: "owner-20",
      }),
    ).toBe(destination);
  });

  it("wraps Walmart destinations in the configured qualifying-link template", () => {
    const destination = "https://www.walmart.com/search?q=rice+vinegar";
    const result = applyAffiliateAttribution("walmart", destination, {
      walmartAffiliateLinkTemplate:
        "https://tracking.example/click?campaign=mestizo&destination={url}",
    });
    const url = new URL(result);

    expect(url.hostname).toBe("tracking.example");
    expect(url.searchParams.get("campaign")).toBe("mestizo");
    expect(url.searchParams.get("destination")).toBe(destination);
  });

  it("fails safely when the Walmart template is missing its destination token", () => {
    const destination = "https://www.walmart.com/search?q=yuzu";
    expect(
      applyAffiliateAttribution("walmart", destination, {
        walmartAffiliateLinkTemplate: "https://tracking.example/click",
      }),
    ).toBe(destination);
  });

  it("leaves Instacart URLs untouched because IDP supplies attribution", () => {
    const destination = "https://www.instacart.com/store/s?k=miso";
    expect(
      applyAffiliateAttribution("instacart", destination, {
        amazonAssociateTag: "owner-20",
        walmartAffiliateLinkTemplate: "https://tracking.example/?url={url}",
      }),
    ).toBe(destination);
  });
});
