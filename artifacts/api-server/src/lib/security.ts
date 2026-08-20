/**
 * Security helpers: opaque cookies, AES-256-GCM encryption,
 * CSRF tokens, and client-identity detection.
 *
 * Ported faithfully from server/security.js on the
 * agent/production-security-billing-affiliates branch.
 */
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import type { Request, Response } from "express";

export const SESSION_COOKIE_BASE = "mu_session";
export const OIDC_COOKIE_BASE    = "mu_oidc_tx";

// ── Credentials ───────────────────────────────────────────────────────────────

export function randomCredential(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

// ── Hashing ───────────────────────────────────────────────────────────────────

export function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

// ── Constant-time comparison ──────────────────────────────────────────────────

export function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(String(left),  "utf8");
  const b = Buffer.from(String(right), "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

// ── AES-256-GCM encryption ────────────────────────────────────────────────────

export function encryptString(value: string | null | undefined, key: Buffer): string | null {
  if (value === undefined || value === null || value === "") return null;
  const iv         = randomBytes(12);
  const cipher     = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  const tag        = cipher.getAuthTag();
  return `v1.${iv.toString("base64url")}.${tag.toString("base64url")}.${ciphertext.toString("base64url")}`;
}

export function decryptString(value: string | null | undefined, key: Buffer): string | null {
  if (!value) return null;
  const parts = String(value).split(".");
  const [version, ivText, tagText, ciphertextText, extra] = parts;
  if (version !== "v1" || !ivText || !tagText || !ciphertextText || extra) {
    throw new Error("Invalid encrypted value");
  }
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivText, "base64url"));
  decipher.setAuthTag(Buffer.from(tagText, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextText, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

// ── CSRF tokens ───────────────────────────────────────────────────────────────

export function csrfToken(sessionCredential: string, secret: string): string {
  return createHmac("sha256", secret).update(sessionCredential, "utf8").digest("base64url");
}

// ── Cookie helpers ────────────────────────────────────────────────────────────

interface CookieConfig {
  cookieSecure: boolean;
  cookieSameSite: string;
}

export function cookieName(baseName: string, config: CookieConfig): string {
  return config.cookieSecure ? `__Host-${baseName}` : baseName;
}

export function parseCookies(header = ""): Record<string, string> {
  const cookies: Record<string, string> = {};
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index < 1) continue;
    const key = part.slice(0, index).trim();
    const raw = part.slice(index + 1).trim();
    try { cookies[key] = decodeURIComponent(raw); } catch { cookies[key] = raw; }
  }
  return cookies;
}

export function getCookie(req: Request, baseName: string, config: CookieConfig): string | null {
  return parseCookies(req.headers.cookie)[cookieName(baseName, config)] ?? null;
}

export function setOpaqueCookie(
  res: Response,
  baseName: string,
  value: string,
  maxAgeSeconds: number,
  config: CookieConfig,
): void {
  const parts = [
    `${cookieName(baseName, config)}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    `SameSite=${config.cookieSameSite}`,
    `Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`,
  ];
  if (config.cookieSecure) parts.push("Secure");
  res.append("Set-Cookie", parts.join("; "));
}

export function clearOpaqueCookie(res: Response, baseName: string, config: CookieConfig): void {
  setOpaqueCookie(res, baseName, "", 0, config);
}

export function normalizeReturnTo(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.includes("\\") || /[\r\n]/.test(value)) return "/";
  return value.slice(0, 2048);
}

// ── Client-identity detection ─────────────────────────────────────────────────

const FORBIDDEN_IDENTITY_KEYS = new Set([
  "userid", "tenantid", "organizationid", "ownerid", "subject", "sub", "email",
  "accountid", "connectedaccountid", "provideruserid", "composiouserid",
]);

export function containsClientIdentity(value: unknown, seen = new WeakSet<object>()): boolean {
  if (!value || typeof value !== "object") return false;
  if (seen.has(value as object)) return false;
  seen.add(value as object);
  if (Array.isArray(value)) return value.some((item) => containsClientIdentity(item, seen));
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    const normalized = key.toLowerCase().replaceAll("_", "").replaceAll("-", "");
    if (FORBIDDEN_IDENTITY_KEYS.has(normalized)) return true;
    if (containsClientIdentity(nested, seen)) return true;
  }
  return false;
}
