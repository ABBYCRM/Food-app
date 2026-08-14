import { describe, expect, it } from "vitest";
import { loadConfig } from "./config.js";
import {
  containsClientIdentity,
  decryptString,
  encryptString,
  setOpaqueCookie,
} from "./security.js";

function productionEnvironment(overrides = {}) {
  return {
    NODE_ENV: "production",
    PORT: "8080",
    PUBLIC_BASE_URL: "https://food.example",
    DATABASE_URL: "postgres://app:password@database.example:25060/app?sslmode=require",
    OIDC_ISSUER: "https://identity.example/",
    OIDC_CLIENT_ID: "food-web",
    OIDC_CLIENT_SECRET: "oidc-client-secret",
    TOKEN_ENCRYPTION_KEY: Buffer.alloc(32, 7).toString("base64"),
    CSRF_SECRET: "a-separate-csrf-secret-with-more-than-32-characters",
    COOKIE_SECURE: "true",
    COOKIE_SAME_SITE: "Lax",
    STRIPE_SECRET_KEY: "stripe-secret-for-test-configuration",
    STRIPE_WEBHOOK_SECRET: "stripe-webhook-secret-for-test-configuration",
    STRIPE_PRICE_ID: "price_recurring",
    INSTACART_API_KEY: "instacart-production-test-key",
    INSTACART_API_BASE_URL: "https://connect.instacart.com",
    ...overrides,
  };
}

describe("runtime security boundaries", () => {
  it("creates a host-only opaque production cookie with every required flag", () => {
    const values = [];
    setOpaqueCookie(
      { append: (_name, value) => values.push(value) },
      "mu_session",
      "opaque-credential-only",
      3_600,
      { cookieSecure: true, cookieSameSite: "Lax" },
    );
    expect(values).toHaveLength(1);
    expect(values[0]).toContain("__Host-mu_session=opaque-credential-only");
    expect(values[0]).toContain("Path=/");
    expect(values[0]).toContain("HttpOnly");
    expect(values[0]).toContain("Secure");
    expect(values[0]).toContain("SameSite=Lax");
    expect(values[0]).toContain("Max-Age=3600");
    expect(values[0]).not.toContain("Domain=");
  });

  it("encrypts provider material with authenticated encryption", () => {
    const key = Buffer.alloc(32, 3);
    const ciphertext = encryptString("provider-token", key);
    expect(ciphertext).not.toContain("provider-token");
    expect(decryptString(ciphertext, key)).toBe("provider-token");
    expect(() => decryptString(`${ciphertext.slice(0, -1)}x`, key)).toThrow();
  });

  it("rejects nested client ownership claims", () => {
    expect(containsClientIdentity({ payload: [{ metadata: { ownerId: "another-user" } }] })).toBe(true);
    expect(containsClientIdentity({ payload: { "tenant-id": "another-tenant" } })).toBe(true);
    expect(containsClientIdentity({ resourceId: "recipe-id", title: "Allowed" })).toBe(false);
  });

  it("loads a complete HTTPS production configuration and rejects insecure variants", () => {
    const config = loadConfig(productionEnvironment());
    expect(config.oidc.redirectUri).toBe("https://food.example/api/auth/callback");
    expect(config.encryptionKey).toHaveLength(32);
    expect(config.cookieSecure).toBe(true);

    expect(() => loadConfig(productionEnvironment({ PUBLIC_BASE_URL: "http://food.example" }))).toThrow(/HTTPS/i);
    expect(() => loadConfig(productionEnvironment({ COOKIE_SECURE: "false" }))).toThrow(/COOKIE_SECURE/);
    expect(() => loadConfig(productionEnvironment({ TOKEN_ENCRYPTION_KEY: "too-short" }))).toThrow(/32 bytes/);
    expect(() => loadConfig(productionEnvironment({ INSTACART_API_BASE_URL: "https://attacker.example" }))).toThrow(/official Instacart/i);
    expect(() => loadConfig(productionEnvironment({ OIDC_SCOPES: "profile email" }))).toThrow(/include openid/i);
    expect(() => loadConfig(productionEnvironment({ OIDC_ISSUER: "https://identity.example/?tenant=evil" }))).toThrow(/query/i);
  });
});
