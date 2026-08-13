import { afterEach, describe, expect, it, vi } from "vitest";
import type { Ingredient } from "@/data/recipes";
import {
  combinedSearchUrl,
  openInNewTab,
  openMany,
  retailerUrl,
} from "@/lib/shopping";

const ingredients: Ingredient[] = [
  {
    amount: 2,
    unit: "tbsp",
    name: { en: "rice vinegar", es: "vinagre de arroz", pt: "vinagre de arroz" },
  },
  {
    amount: 1,
    unit: "tbsp",
    name: { en: "miso", es: "miso", pt: "miso" },
    shopQuery: "white miso paste",
  },
];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("retailer shopping handoff", () => {
  it("builds HTTPS vendor searches without putting ZIP data in unrelated URLs", () => {
    const amazon = new URL(retailerUrl("amazon", "white miso paste", "10001"));
    const instacart = new URL(retailerUrl("instacart", "white miso paste", "10001"));

    expect(amazon.protocol).toBe("https:");
    expect(amazon.hostname).toBe("www.amazon.com");
    expect(amazon.searchParams.get("k")).toBe("white miso paste");
    expect(amazon.searchParams.has("zip")).toBe(false);
    expect(instacart.hostname).toBe("www.instacart.com");
    expect(instacart.searchParams.get("zip")).toBe("10001");
  });

  it("creates one popup-safe fallback search for the selected ingredients", () => {
    const url = new URL(combinedSearchUrl("walmart", ingredients));
    expect(url.hostname).toBe("www.walmart.com");
    expect(url.searchParams.get("q")).toBe("rice vinegar, white miso paste");
  });

  it("severs the opener before navigating a newly opened tab", () => {
    const replace = vi.fn();
    const openedWindow = { opener: {} as unknown, location: { replace } };
    const open = vi.fn(() => openedWindow);
    vi.stubGlobal("window", { open });

    expect(openInNewTab("https://www.amazon.com/s?k=miso")).toBe(true);
    expect(open).toHaveBeenCalledWith("about:blank", "_blank");
    expect(openedWindow.opener).toBeNull();
    expect(replace).toHaveBeenCalledWith("https://www.amazon.com/s?k=miso");
  });

  it("reports every popup rejected by the browser", () => {
    vi.stubGlobal("window", { open: vi.fn(() => null) });
    expect(openMany(["https://example.com/a", "https://example.com/b"])).toEqual({
      opened: 0,
      blocked: 2,
      total: 2,
    });
  });
});
