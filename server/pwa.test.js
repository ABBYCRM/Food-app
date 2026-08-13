import { access, readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("installable PWA assets", () => {
  it("has a complete standalone manifest and every declared icon", async () => {
    const manifest = JSON.parse(await readFile("public/manifest.webmanifest", "utf8"));
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toMatch(/^\//);
    expect(manifest.icons.some((icon) => icon.sizes === "192x192" && icon.purpose === "any")).toBe(true);
    expect(manifest.icons.some((icon) => icon.sizes === "512x512" && icon.purpose === "maskable")).toBe(true);
    await Promise.all(manifest.icons.map((icon) => access(`public${icon.src}`)));
  });

  it("never intercepts API, session, billing, or health requests in the service worker", async () => {
    const worker = await readFile("public/sw.js", "utf8");
    expect(worker).toContain('url.pathname.startsWith("/api/")');
    expect(worker).toContain('url.pathname === "/healthz"');
    expect(worker).not.toMatch(/cache\.put\([^\n]*api/i);
  });
});

