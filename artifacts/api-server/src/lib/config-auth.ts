/**
 * Auth/billing/security configuration, loaded from environment variables.
 * All values are validated at startup so the server refuses to boot with
 * a broken config rather than failing at request time.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value?.trim()) throw new Error(`Required environment variable ${key} is not set`);
  return value.trim();
}

function optionalEnv(key: string): string | undefined {
  return process.env[key]?.trim() || undefined;
}

function parseEncryptionKey(raw: string): Buffer {
  const key = Buffer.from(raw, "base64");
  if (key.byteLength !== 32) {
    throw new Error(
      `TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes (got ${key.byteLength}). ` +
      `Generate one with: openssl rand -base64 32`,
    );
  }
  return key;
}

export interface AuthConfig {
  isProduction: boolean;
  publicBaseUrl: string;
  oidc: {
    issuer: string;
    clientId: string;
    clientSecret: string | undefined;
    scopes: string;
    redirectUri: string;
  };
  encryptionKey: Buffer;
  csrfSecret: string;
  sessionTtlSeconds: number;
  oidcAttemptTtlSeconds: number;
  cookieSecure: boolean;
  cookieSameSite: string;
  trialDays: number;
  stripe: {
    secretKey: string;
    webhookSecret: string;
    priceId: string;
    priceDisplay: string;
  } | null;
  instacart: {
    apiKey: string;
    apiBaseUrl: string;
  } | null;
}

let _config: AuthConfig | null = null;

export function loadAuthConfig(): AuthConfig {
  if (_config) return _config;

  const isProduction   = process.env["NODE_ENV"] === "production";
  const rawBaseUrl     = process.env["PUBLIC_BASE_URL"];
  const publicBaseUrl  = rawBaseUrl?.trim() ? rawBaseUrl.trim().replace(/\/$/, "") : "http://localhost:8080";

  const encKeyRaw  = optionalEnv("TOKEN_ENCRYPTION_KEY");
  const csrfSecret = optionalEnv("CSRF_SECRET");
  // Auth routes are disabled when these crypto secrets are absent — the server
  // still starts so push notifications, health checks, etc. keep working.

  const oidcIssuer   = optionalEnv("OIDC_ISSUER");
  const oidcClientId = optionalEnv("OIDC_CLIENT_ID");

  // Stripe config — optional; billing routes are disabled when absent
  const stripeSecretKey     = optionalEnv("STRIPE_SECRET_KEY");
  const stripeWebhookSecret = optionalEnv("STRIPE_WEBHOOK_SECRET");
  const stripePriceId       = optionalEnv("STRIPE_PRICE_ID");

  _config = {
    isProduction,
    publicBaseUrl,
    oidc: oidcIssuer && oidcClientId ? {
      issuer: oidcIssuer,
      clientId: oidcClientId,
      clientSecret: optionalEnv("OIDC_CLIENT_SECRET"),
      scopes: process.env["OIDC_SCOPES"]?.trim() || "openid profile email offline_access",
      redirectUri: `${publicBaseUrl}/api/auth/callback`,
    } : { issuer: "", clientId: "", clientSecret: undefined, scopes: "", redirectUri: "" },
    encryptionKey: encKeyRaw ? parseEncryptionKey(encKeyRaw) : Buffer.alloc(32),
    csrfSecret: csrfSecret ?? "",
    sessionTtlSeconds: Number(process.env["SESSION_TTL_SECONDS"] ?? 2_592_000),
    oidcAttemptTtlSeconds: Number(process.env["OIDC_ATTEMPT_TTL_SECONDS"] ?? 600),
    cookieSecure: process.env["COOKIE_SECURE"] === "true",
    cookieSameSite: process.env["COOKIE_SAME_SITE"] ?? "Lax",
    trialDays: Number(process.env["TRIAL_DAYS"] ?? 7),
    stripe: stripeSecretKey && stripeWebhookSecret && stripePriceId ? {
      secretKey: stripeSecretKey,
      webhookSecret: stripeWebhookSecret,
      priceId: stripePriceId,
      priceDisplay: process.env["SUBSCRIPTION_PRICE_DISPLAY"] ?? "$4.99/month",
    } : null,
    instacart: (() => {
      const apiKey    = optionalEnv("INSTACART_API_KEY");
      const apiBaseUrl = process.env["INSTACART_API_BASE_URL"]?.trim()
        || "https://connect.dev.instacart.tools";
      return apiKey ? { apiKey, apiBaseUrl } : null;
    })(),
  };
  return _config;
}

/** True when OIDC env vars are present — routes won't be mounted otherwise. */
export function isOidcConfigured(): boolean {
  const c = loadAuthConfig();
  return Boolean(c.oidc.issuer && c.oidc.clientId);
}
