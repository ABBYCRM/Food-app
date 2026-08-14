/**
 * Authentication routes — OIDC authorization-code flow with PKCE.
 *
 * GET  /api/auth/session   → current user + entitlement (no auth required)
 * GET  /api/auth/login     → begin OIDC flow
 * GET  /api/auth/callback  → exchange code, issue session
 * POST /api/auth/logout    → revoke session
 *
 * Mounted only when OIDC env vars are present.
 */
import { Router } from "express";
import type { AuthConfig } from "../lib/config-auth.js";
import type { OidcService } from "../lib/oidc-service.js";
import type { AuthMiddleware } from "../lib/auth-middleware.js";
import { repos } from "../lib/auth-repos.js";
import { describeEntitlement } from "../lib/entitlements.js";
import {
  clearOpaqueCookie, csrfToken, decryptString, encryptString,
  getCookie, normalizeReturnTo, OIDC_COOKIE_BASE, SESSION_COOKIE_BASE,
  randomCredential, setOpaqueCookie, sha256,
} from "../lib/security.js";

// Re-export so app.ts and other routes can import the middleware type
export type { AuthMiddleware };

export function createAuthRouter(
  config: AuthConfig,
  oidcService: OidcService,
  auth: AuthMiddleware,
): Router {
  const router = Router();

  // ── GET /api/auth/session ─────────────────────────────────────────────────
  router.get("/session", auth.resolveAuthentication, async (req, res, next) => {
    try {
      if (!req.user || !req.authSession) {
        return res.json({ authenticated: false, user: null, entitlement: null, csrfToken: null });
      }
      const subscription = await repos.getSubscriptionForUser(req.user.id);
      const entitlement  = describeEntitlement(subscription);
      const csrf         = csrfToken(req.authSession.credential, config.csrfSecret);
      return res.json({
        authenticated: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          displayName: req.user.displayName,
        },
        entitlement,
        csrfToken: csrf,
      });
    } catch (err) { return next(err); }
  });

  // ── GET /api/auth/login ───────────────────────────────────────────────────
  router.get("/login", async (req, res, next) => {
    try {
      const returnTo      = normalizeReturnTo(req.query["return_to"]);
      const pkceVerifier  = oidcService.randomPkceVerifier();
      const codeChallenge = await oidcService.calculatePkceChallenge(pkceVerifier);
      const state         = oidcService.randomState();
      const nonce         = oidcService.randomNonce();

      const attemptCredential = randomCredential();
      const attemptIdHash     = sha256(attemptCredential);
      const stateHash         = sha256(state);
      const expiresAt         = new Date(Date.now() + config.oidcAttemptTtlSeconds * 1_000);

      await repos.createOidcAttempt({
        idHash: attemptIdHash,
        stateHash,
        pkceVerifierCiphertext: encryptString(pkceVerifier, config.encryptionKey)!,
        nonce,
        returnTo,
        expiresAt,
      });

      setOpaqueCookie(res, OIDC_COOKIE_BASE, attemptCredential, config.oidcAttemptTtlSeconds, config);

      const url = await oidcService.authorizationUrl({ codeChallenge, state, nonce });
      return res.redirect(302, url);
    } catch (err) { return next(err); }
  });

  // ── GET /api/auth/callback ────────────────────────────────────────────────
  router.get("/callback", async (req, res, next) => {
    try {
      const attemptCredential = getCookie(req, OIDC_COOKIE_BASE, config);
      clearOpaqueCookie(res, OIDC_COOKIE_BASE, config);

      if (!attemptCredential) {
        return res.status(400).json({ error: "Login attempt not found or expired", code: "OIDC_ATTEMPT_MISSING" });
      }

      const attemptIdHash = sha256(attemptCredential);
      const stateParam    = String(req.query["state"] ?? "");
      const stateHash     = sha256(stateParam);

      const attempt = await repos.consumeOidcAttempt(attemptIdHash, stateHash);
      if (!attempt) {
        return res.status(400).json({ error: "Login attempt not found or expired", code: "OIDC_ATTEMPT_MISSING" });
      }

      const pkceVerifier = decryptString(attempt.pkceVerifierCiphertext, config.encryptionKey);
      if (!pkceVerifier) {
        return res.status(400).json({ error: "Could not restore login state", code: "OIDC_VERIFIER_MISSING" });
      }

      const currentUrl = new URL(req.url, config.publicBaseUrl);
      const tokens     = await oidcService.exchangeCallback(currentUrl, {
        pkceVerifier,
        expectedState: stateParam,
        expectedNonce: attempt.nonce,
      });

      const user = await repos.upsertVerifiedOidcUser({
        issuer: tokens.issuer,
        subject: tokens.subject,
        email: tokens.email,
        displayName: tokens.displayName,
      });
      if (!user) throw new Error("Failed to resolve user account");

      await repos.ensureTrialForUser(user.id, { trialDays: config.trialDays });

      const sessionCredential = randomCredential();
      const sessionIdHash     = sha256(sessionCredential);
      const now               = new Date();
      const sessionExpiresAt  = new Date(now.getTime() + config.sessionTtlSeconds * 1_000);
      const providerExpiresAt = tokens.expiresIn
        ? new Date(now.getTime() + tokens.expiresIn * 1_000)
        : null;

      await repos.createSession({
        idHash: sessionIdHash,
        userId: user.id,
        accessTokenCiphertext:  tokens.accessToken  ? encryptString(tokens.accessToken,  config.encryptionKey) : null,
        refreshTokenCiphertext: tokens.refreshToken ? encryptString(tokens.refreshToken, config.encryptionKey) : null,
        idTokenCiphertext:      tokens.idToken      ? encryptString(tokens.idToken,      config.encryptionKey) : null,
        providerExpiresAt,
        expiresAt: sessionExpiresAt,
      });

      setOpaqueCookie(res, SESSION_COOKIE_BASE, sessionCredential, config.sessionTtlSeconds, config);
      return res.redirect(302, attempt.returnTo || "/");
    } catch (err) { return next(err); }
  });

  // ── POST /api/auth/logout ─────────────────────────────────────────────────
  router.post("/logout", auth.resolveAuthentication, async (req, res, next) => {
    try {
      let endSessionUrl: string | null = null;
      if (req.authSession) {
        const idTokenCipher = req.authSession.idTokenCiphertext;
        const idToken = idTokenCipher ? decryptString(idTokenCipher, config.encryptionKey) : null;
        await repos.revokeSession(req.authSession.idHash);
        endSessionUrl = await oidcService.endSessionUrl(idToken).catch(() => null);
      }
      clearOpaqueCookie(res, SESSION_COOKIE_BASE, config);
      return res.json({ ok: true, endSessionUrl });
    } catch (err) { return next(err); }
  });

  return router;
}
