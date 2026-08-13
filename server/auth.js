import {
  clearOpaqueCookie,
  csrfToken,
  decryptString,
  encryptString,
  getCookie,
  safeEqual,
  SESSION_COOKIE_BASE,
  sha256,
} from "./security.js";

const credentialPattern = /^[A-Za-z0-9_-]{40,100}$/;

export function createAuthentication({ repositories, config, oidcService, clock = () => new Date() }) {
  async function revokeAndClear(req, res, idHash) {
    try {
      await repositories.revokeSession(idHash);
    } finally {
      clearOpaqueCookie(res, SESSION_COOKIE_BASE, config);
    }
  }

  async function resolveAuthentication(req, res, next) {
    const credential = getCookie(req, SESSION_COOKIE_BASE, config);
    if (!credential || !credentialPattern.test(credential)) return next();

    const idHash = sha256(credential);
    try {
      let session = await repositories.getSessionByHash(idHash);
      if (!session) {
        clearOpaqueCookie(res, SESSION_COOKIE_BASE, config);
        return next();
      }

      const now = clock();
      if (session.expiresAt.getTime() <= now.getTime()) {
        await revokeAndClear(req, res, idHash);
        return next();
      }

      const user = await repositories.getUserById(session.userId);
      if (!user) {
        await revokeAndClear(req, res, idHash);
        return next();
      }

      if (session.providerExpiresAt && session.providerExpiresAt.getTime() <= now.getTime() + 30_000) {
        try {
          const refreshToken = decryptString(session.refreshTokenCiphertext, config.encryptionKey);
          if (!refreshToken) throw new Error("Provider session cannot be refreshed");
          const refreshed = await oidcService.refresh(refreshToken, user);
          const providerExpiresAt = refreshed.expiresIn
            ? new Date(now.getTime() + refreshed.expiresIn * 1_000)
            : null;
          const updated = await repositories.updateSessionTokensForUser({
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
            now,
          });
          if (!updated) throw new Error("Session was revoked while refreshing");
          session = { ...session, providerExpiresAt };
        } catch {
          await revokeAndClear(req, res, idHash);
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

  function requireAuthentication(req, res, next) {
    if (!req.user || !req.authSession) {
      return res.status(401).json({ error: "Authentication required", code: "UNAUTHENTICATED" });
    }
    return next();
  }

  function requireCsrf(req, res, next) {
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

