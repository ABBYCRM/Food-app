import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

export const SESSION_COOKIE_BASE = "mu_session";
export const OIDC_COOKIE_BASE = "mu_oidc_tx";

export function randomCredential(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function safeEqual(left, right) {
  const a = Buffer.from(String(left), "utf8");
  const b = Buffer.from(String(right), "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function encryptString(value, key) {
  if (value === undefined || value === null || value === "") return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1.${iv.toString("base64url")}.${tag.toString("base64url")}.${ciphertext.toString("base64url")}`;
}

export function decryptString(value, key) {
  if (!value) return null;
  const [version, ivText, tagText, ciphertextText, extra] = String(value).split(".");
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

export function csrfToken(sessionCredential, secret) {
  return createHmac("sha256", secret).update(sessionCredential, "utf8").digest("base64url");
}

export function parseCookies(header = "") {
  const cookies = {};
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index < 1) continue;
    const key = part.slice(0, index).trim();
    const raw = part.slice(index + 1).trim();
    try {
      cookies[key] = decodeURIComponent(raw);
    } catch {
      cookies[key] = raw;
    }
  }
  return cookies;
}

export function cookieName(baseName, config) {
  return config.cookieSecure ? `__Host-${baseName}` : baseName;
}

export function getCookie(req, baseName, config) {
  return parseCookies(req.headers.cookie)[cookieName(baseName, config)] ?? null;
}

export function setOpaqueCookie(res, baseName, value, maxAgeSeconds, config) {
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

export function clearOpaqueCookie(res, baseName, config) {
  setOpaqueCookie(res, baseName, "", 0, config);
}

export function normalizeReturnTo(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.includes("\\") || /[\r\n]/.test(value)) return "/";
  return value.slice(0, 2048);
}

const forbiddenIdentityKeys = new Set([
  "userid", "tenantid", "organizationid", "ownerid", "subject", "sub", "email",
]);

export function containsClientIdentity(value, seen = new WeakSet()) {
  if (!value || typeof value !== "object") return false;
  if (seen.has(value)) return false;
  seen.add(value);
  if (Array.isArray(value)) return value.some((item) => containsClientIdentity(item, seen));
  for (const [key, nested] of Object.entries(value)) {
    const normalizedKey = key.toLowerCase().replaceAll("_", "").replaceAll("-", "");
    if (forbiddenIdentityKeys.has(normalizedKey)) return true;
    if (containsClientIdentity(nested, seen)) return true;
  }
  return false;
}
