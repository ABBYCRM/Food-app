/**
 * OIDC service — wraps openid-client v6 for authorization-code + PKCE flow.
 * Ported faithfully from server/oidc.js.
 */
import * as oidc from "openid-client";
import type { AuthConfig } from "./config-auth.js";

export interface OidcTokens {
  issuer: string;
  subject: string;
  email: string | null;
  displayName: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  expiresIn: number | null;
}

export interface RefreshedTokens {
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  expiresIn: number | null;
}

export interface OidcService {
  randomPkceVerifier: () => string;
  calculatePkceChallenge: (verifier: string) => Promise<string>;
  randomState: () => string;
  randomNonce: () => string;
  authorizationUrl: (opts: { codeChallenge: string; state: string; nonce: string }) => Promise<string>;
  exchangeCallback: (
    currentUrl: URL,
    opts: { pkceVerifier: string; expectedState: string; expectedNonce: string },
  ) => Promise<OidcTokens>;
  refresh: (
    refreshToken: string,
    expectedUser: { oidcIssuer: string; oidcSubject: string },
  ) => Promise<RefreshedTokens>;
  endSessionUrl: (idToken: string | null) => Promise<string | null>;
}

export function createOidcService(config: AuthConfig): OidcService {
  let configurationPromise: Promise<oidc.Configuration> | null = null;

  async function configuration(): Promise<oidc.Configuration> {
    if (!configurationPromise) {
      const auth = config.oidc.clientSecret ? undefined : oidc.None();
      configurationPromise = oidc.discovery(
        new URL(config.oidc.issuer),
        config.oidc.clientId,
        config.oidc.clientSecret,
        auth,
      ).catch((err) => {
        configurationPromise = null;
        throw err;
      });
    }
    return configurationPromise;
  }

  return Object.freeze({
    randomPkceVerifier: (): string => oidc.randomPKCECodeVerifier(),
    calculatePkceChallenge: (v: string): Promise<string> => oidc.calculatePKCECodeChallenge(v),
    randomState: (): string => oidc.randomState(),
    randomNonce: (): string => oidc.randomNonce(),

    async authorizationUrl({ codeChallenge, state, nonce }: { codeChallenge: string; state: string; nonce: string }): Promise<string> {
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

    async exchangeCallback(currentUrl: URL, { pkceVerifier, expectedState, expectedNonce }: { pkceVerifier: string; expectedState: string; expectedNonce: string }): Promise<OidcTokens> {
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

    async refresh(refreshToken: string, expectedUser: { oidcIssuer: string; oidcSubject: string }): Promise<RefreshedTokens> {
      const discovered = await configuration();
      const tokens = await oidc.refreshTokenGrant(discovered, refreshToken);
      const claims = tokens.id_token ? tokens.claims() : null;
      if (
        claims &&
        (claims.iss !== expectedUser.oidcIssuer || claims.sub !== expectedUser.oidcSubject)
      ) {
        throw new Error("Refreshed OIDC identity did not match the session owner");
      }
      return {
        accessToken: tokens.access_token ?? null,
        refreshToken: tokens.refresh_token ?? null,
        idToken: tokens.id_token ?? null,
        expiresIn: tokens.expiresIn() ?? null,
      };
    },

    async endSessionUrl(idToken: string | null): Promise<string | null> {
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
