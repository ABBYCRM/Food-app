/**
 * Authentication middleware.
 *
 * resolveAuthentication  — reads the opaque session cookie, verifies the
 *   session is live, loads req.user; if the provider token is expiring it
 *   refreshes it server-side before proceeding.  Never throws — unauthenticated
 *   requests simply have no req.user.
 *
 * requireAuthentication  — 401 if req.user is absent.
 * requireCsrf            — 401/403 if req.user absent or X-CSRF-Token invalid.
 *
 * Ported faithfully from server/auth.js.
 */
import type { Request, Response, NextFunction } from "express";
import type { AuthConfig } from "./config-auth.js";
import type { OidcService } from "./oidc-service.js";
import { repos, type AppUser, type AppSession } from "./auth-repos.js";
import {
  clearOpaqueCookie, csrfToken, decryptString, encryptString,
  getCookie, safeEqual, SESSION_COOKIE_BASE, sha256,
} from "./security.js";

const CREDENTIAL_PATTERN = /^[A-Za-z0-9_-]{40,100}$/;

// Augment Express Request with our auth properties
declare global {
  namespace Express {
    interface Request {
      user?: AppUser;
      authSession?: AppSession & { credential: string; idHash: string };
      authenticationFailure?: string;
    }
  }
}

export type AuthMiddleware = ReturnType<typeof createAuthentication>;

export function createAuthentication(
  config: AuthConfig,
  oidcService: OidcService,
  clock: () => Date = () => new Date(),
) {
  async function revokeAndClear(res: Response, idHash: string): Promise<void> {
    try { await repos.revokeSession(idHash); } finally {
      clearOpaqueCookie(res, SESSION_COOKIE_BASE, config);
    }
  }

  async function resolveAuthentication(req: Request, res: Response, next: NextFunction) {
    const credential = getCookie(req, SESSION_COOKIE_BASE, config);
    if (!credential || !CREDENTIAL_PATTERN.test(credential)) return next();

    const idHash = sha256(credential);
    try {
      let session = await repos.getSessionByHash(idHash);
      if (!session) {
        clearOpaqueCookie(res, SESSION_COOKIE_BASE, config);
        return next();
      }

      const now = clock();
      if (session.expiresAt.getTime() <= now.getTime()) {
        await revokeAndClear(res, idHash);
        return next();
      }

      const user = await repos.getUserById(session.userId);
      if (!user) {
        await revokeAndClear(res, idHash);
        return next();
      }

      // Proactively refresh the provider token if it expires within 30 s
      if (session.providerExpiresAt && session.providerExpiresAt.getTime() <= now.getTime() + 30_000) {
        try {
          const encRefresh = session.refreshTokenCiphertext;
          const refreshToken = encRefresh ? decryptString(encRefresh, config.encryptionKey) : null;
          if (!refreshToken) throw new Error("Provider session cannot be refreshed");
          const refreshed = await oidcService.refresh(refreshToken, user);
          const providerExpiresAt = refreshed.expiresIn
            ? new Date(now.getTime() + refreshed.expiresIn * 1_000)
            : null;
          const updated = await repos.updateSessionTokensForUser({
            idHash,
            userId: user.id,
            accessTokenCiphertext: refreshed.accessToken
              ? encryptString(refreshed.accessToken, config.encryptionKey)
              : session.accessTokenCiphertext,
            refreshTokenCiphertext: refreshed.refreshToken
              ? encryptString(refreshed.refreshToken, config.encryptionKey)
              : session.refreshTokenCiphertext,
            idTokenCiphertext: refreshed.idToken
              ? encryptString(refreshed.idToken, config.encryptionKey)
              : session.idTokenCiphertext,
            providerExpiresAt,
          });
          if (!updated) throw new Error("Session was revoked while refreshing");
          session = { ...session, providerExpiresAt };
        } catch {
          await revokeAndClear(res, idHash);
          req.authenticationFailure = "provider_refresh_failed";
          return next();
        }
      }

      req.user = user;
      req.authSession = { ...session, credential, idHash };
      return next();
    } catch (error) {
      return next(error);
    }
  }

  function requireAuthentication(req: Request, res: Response, next: NextFunction) {
    if (!req.user || !req.authSession) {
      return res.status(401).json({ error: "Authentication required", code: "UNAUTHENTICATED" });
    }
    return next();
  }

  function requireCsrf(req: Request, res: Response, next: NextFunction) {
    if (!req.user || !req.authSession) {
      return res.status(401).json({ error: "Authentication required", code: "UNAUTHENTICATED" });
    }
    const supplied = req.get("x-csrf-token") ?? "";
    const expected = csrfToken(req.authSession.credential, config.csrfSecret);
    if (!safeEqual(supplied, expected)) {
      return res.status(403).json({ error: "Invalid request token", code: "CSRF_REJECTED" });
    }
    return next();
  }

  return Object.freeze({ resolveAuthentication, requireAuthentication, requireCsrf });
}
