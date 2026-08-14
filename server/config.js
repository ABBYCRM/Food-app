import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(8080),
  PUBLIC_BASE_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  DATABASE_MAX_CONNECTIONS: z.coerce.number().int().min(1).max(50).default(10),
  OIDC_ISSUER: z.string().url(),
  OIDC_CLIENT_ID: z.string().min(1),
  OIDC_CLIENT_SECRET: z.string().optional(),
  OIDC_SCOPES: z.string().default("openid profile email offline_access"),
  TOKEN_ENCRYPTION_KEY: z.string().min(1),
  CSRF_SECRET: z.string().min(32),
  SESSION_TTL_SECONDS: z.coerce.number().int().min(900).max(60 * 60 * 24 * 90).default(60 * 60 * 24 * 30),
  OIDC_ATTEMPT_TTL_SECONDS: z.coerce.number().int().min(120).max(1800).default(600),
  COOKIE_SECURE: z.enum(["true", "false"]).default("true"),
  COOKIE_SAME_SITE: z.enum(["Lax", "Strict", "None"]).default("Lax"),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_PRICE_ID: z.string().min(1),
  SUBSCRIPTION_PRICE_DISPLAY: z.string().min(1).default("$4.99/month"),
  TRIAL_DAYS: z.coerce.number().int().min(1).max(90).default(7),
  INSTACART_API_KEY: z.string().min(1),
  INSTACART_API_BASE_URL: z.string().url().default("https://connect.instacart.com"),
  TRUST_PROXY: z.enum(["true", "false"]).default("true"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

function parseEncryptionKey(value) {
  const isHex = /^[0-9a-f]{64}$/i.test(value);
  const key = Buffer.from(value, isHex ? "hex" : "base64");
  if (key.length !== 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes");
  }
  return key;
}

export function loadConfig(env = process.env) {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "environment"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid server configuration: ${details}`);
  }

  const values = parsed.data;
  const publicBaseUrl = new URL(values.PUBLIC_BASE_URL);
  if (
    publicBaseUrl.pathname !== "/"
    || publicBaseUrl.search
    || publicBaseUrl.hash
    || publicBaseUrl.username
    || publicBaseUrl.password
  ) {
    throw new Error("PUBLIC_BASE_URL must be an origin without a path, credentials, query, or fragment");
  }
  if (values.NODE_ENV === "production" && publicBaseUrl.protocol !== "https:") {
    throw new Error("PUBLIC_BASE_URL must use HTTPS in production");
  }
  if (values.NODE_ENV === "production" && values.COOKIE_SECURE !== "true") {
    throw new Error("COOKIE_SECURE must be true in production");
  }
  if (values.COOKIE_SAME_SITE === "None" && values.COOKIE_SECURE !== "true") {
    throw new Error("SameSite=None cookies require COOKIE_SECURE=true");
  }
  const oidcIssuer = new URL(values.OIDC_ISSUER);
  if (oidcIssuer.username || oidcIssuer.password || oidcIssuer.search || oidcIssuer.hash) {
    throw new Error("OIDC_ISSUER must not contain credentials, a query, or a fragment");
  }
  if (values.NODE_ENV === "production" && oidcIssuer.protocol !== "https:") {
    throw new Error("OIDC_ISSUER must use HTTPS in production");
  }
  const oidcScopes = values.OIDC_SCOPES.trim().split(/\s+/).filter(Boolean);
  if (!oidcScopes.includes("openid")) {
    throw new Error("OIDC_SCOPES must include openid");
  }
  const instacartBaseUrl = new URL(values.INSTACART_API_BASE_URL).origin;
  const instacartOrigins = new Set([
    "https://connect.instacart.com",
    "https://connect.dev.instacart.tools",
  ]);
  if (!instacartOrigins.has(instacartBaseUrl)) {
    throw new Error("INSTACART_API_BASE_URL must be an official Instacart Developer Platform origin");
  }
  if (values.NODE_ENV === "production" && instacartBaseUrl !== "https://connect.instacart.com") {
    throw new Error("Production must use the Instacart production API origin");
  }

  return Object.freeze({
    nodeEnv: values.NODE_ENV,
    isProduction: values.NODE_ENV === "production",
    port: values.PORT,
    publicBaseUrl: publicBaseUrl.toString().replace(/\/$/, ""),
    databaseUrl: values.DATABASE_URL,
    databaseMaxConnections: values.DATABASE_MAX_CONNECTIONS,
    oidc: Object.freeze({
      issuer: oidcIssuer.toString(),
      clientId: values.OIDC_CLIENT_ID,
      clientSecret: values.OIDC_CLIENT_SECRET?.trim() || undefined,
      scopes: oidcScopes.join(" "),
      redirectUri: `${publicBaseUrl.toString().replace(/\/$/, "")}/api/auth/callback`,
    }),
    encryptionKey: parseEncryptionKey(values.TOKEN_ENCRYPTION_KEY),
    csrfSecret: values.CSRF_SECRET,
    sessionTtlSeconds: values.SESSION_TTL_SECONDS,
    oidcAttemptTtlSeconds: values.OIDC_ATTEMPT_TTL_SECONDS,
    cookieSecure: values.COOKIE_SECURE === "true",
    cookieSameSite: values.COOKIE_SAME_SITE,
    stripe: Object.freeze({
      secretKey: values.STRIPE_SECRET_KEY,
      webhookSecret: values.STRIPE_WEBHOOK_SECRET,
      priceId: values.STRIPE_PRICE_ID,
      priceDisplay: values.SUBSCRIPTION_PRICE_DISPLAY,
    }),
    trialDays: values.TRIAL_DAYS,
    instacart: Object.freeze({
      apiKey: values.INSTACART_API_KEY,
      apiBaseUrl: instacartBaseUrl,
    }),
    trustProxy: values.TRUST_PROXY === "true",
    logLevel: values.LOG_LEVEL,
  });
}

export function loadDatabaseConfig(env = process.env) {
  const databaseUrl = z.string().min(1).safeParse(env.DATABASE_URL);
  const maxConnections = z.coerce.number().int().min(1).max(50).default(10).safeParse(env.DATABASE_MAX_CONNECTIONS);
  if (!databaseUrl.success || !maxConnections.success) {
    throw new Error("DATABASE_URL and a valid DATABASE_MAX_CONNECTIONS are required");
  }
  return Object.freeze({
    databaseUrl: databaseUrl.data,
    databaseMaxConnections: maxConnections.data,
  });
}
