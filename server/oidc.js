import * as oidc from "openid-client";

export function createOidcService(config) {
  let configurationPromise;

  async function configuration() {
    if (!configurationPromise) {
      const authentication = config.oidc.clientSecret ? undefined : oidc.None();
      configurationPromise = oidc.discovery(
        new URL(config.oidc.issuer),
        config.oidc.clientId,
        config.oidc.clientSecret,
        authentication,
      ).catch((error) => {
        configurationPromise = undefined;
        throw error;
      });
    }
    return configurationPromise;
  }

  return Object.freeze({
    randomPkceVerifier: oidc.randomPKCECodeVerifier,
    calculatePkceChallenge: oidc.calculatePKCECodeChallenge,
    randomState: oidc.randomState,
    randomNonce: oidc.randomNonce,

    async authorizationUrl({ codeChallenge, state, nonce }) {
      const discovered = await configuration();
      return oidc.buildAuthorizationUrl(discovered, {
        redirect_uri: config.oidc.redirectUri,
        scope: config.oidc.scopes,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state,
        nonce,
      }).toString();
    },

    async exchangeCallback(currentUrl, { pkceVerifier, expectedState, expectedNonce }) {
      const discovered = await configuration();
      const tokens = await oidc.authorizationCodeGrant(discovered, currentUrl, {
        pkceCodeVerifier: pkceVerifier,
        expectedState,
        expectedNonce,
        idTokenExpected: true,
      });
      const claims = tokens.claims();
      if (typeof claims?.iss !== "string" || typeof claims.sub !== "string" || !claims.iss || !claims.sub) {
        throw new Error("OIDC response did not contain a verified stable identity");
      }
      return {
        issuer: claims.iss,
        subject: claims.sub,
        email: typeof claims.email === "string" ? claims.email : null,
        displayName: typeof claims.name === "string"
          ? claims.name
          : typeof claims.preferred_username === "string" ? claims.preferred_username : null,
        accessToken: tokens.access_token ?? null,
        refreshToken: tokens.refresh_token ?? null,
        idToken: tokens.id_token ?? null,
        expiresIn: tokens.expiresIn() ?? null,
      };
    },

    async refresh(refreshToken, expectedUser) {
      const discovered = await configuration();
      const tokens = await oidc.refreshTokenGrant(discovered, refreshToken);
      const claims = tokens.id_token ? tokens.claims() : null;
      if (claims && (claims.iss !== expectedUser.oidcIssuer || claims.sub !== expectedUser.oidcSubject)) {
        throw new Error("Refreshed OIDC identity did not match the session owner");
      }
      return {
        accessToken: tokens.access_token ?? null,
        refreshToken: tokens.refresh_token ?? null,
        idToken: tokens.id_token ?? null,
        expiresIn: tokens.expiresIn() ?? null,
      };
    },

    async endSessionUrl(idToken) {
      if (!idToken) return null;
      const discovered = await configuration();
      try {
        return oidc.buildEndSessionUrl(discovered, {
          id_token_hint: idToken,
          post_logout_redirect_uri: config.publicBaseUrl,
        }).toString();
      } catch {
        return null;
      }
    },
  });
}
