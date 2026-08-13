import { randomBytes, randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../../server/app.js";
import { createPgliteDatabase } from "../../server/db.js";
import { migrateDatabase } from "../../server/migrations.js";
import { createRepositories, tenantCacheKey } from "../../server/repositories.js";
import { csrfToken, encryptString, randomCredential, sha256 } from "../../server/security.js";

const now = new Date("2026-08-13T12:00:00.000Z");
const config = Object.freeze({
  isProduction: false,
  trustProxy: false,
  publicBaseUrl: "http://127.0.0.1",
  oidc: {
    issuer: "https://identity.example.test",
    clientId: "test-client",
    scopes: "openid profile email offline_access",
    redirectUri: "http://127.0.0.1/api/auth/callback",
  },
  encryptionKey: randomBytes(32),
  csrfSecret: "test-csrf-secret-that-is-at-least-thirty-two-characters",
  sessionTtlSeconds: 2_592_000,
  oidcAttemptTtlSeconds: 600,
  cookieSecure: false,
  cookieSameSite: "Lax",
  stripe: { priceDisplay: "$4.99/month" },
  trialDays: 7,
});

const recipeA = {
  title: "A's mole ramen",
  subtitle: "Private A recipe",
  story: "A's story",
  ingredients: ["1 cup broth"],
  method: ["Simmer."],
  serves: 2,
  minutes: 20,
};
const recipeB = {
  title: "B's kimchi taco",
  subtitle: "Private B recipe",
  story: "B's story",
  ingredients: ["2 tortillas"],
  method: ["Toast."],
  serves: 2,
  minutes: 10,
};

function defaultWorkspaceForTest() {
  return {
    locale: "en",
    zip: "",
    favorites: [],
    notesByRecipe: {},
    planner: {},
    avoiding: [],
    dietary: [],
  };
}

describe("server-owned tenant isolation", () => {
  let pglite;
  let database;
  let repositories;
  let server;
  let baseUrl;
  let userA;
  let userB;
  let sessionA;
  let sessionB;
  let instacartCalls = 0;

  const oidcService = {
    randomPkceVerifier: () => "v".repeat(43),
    calculatePkceChallenge: async () => "challenge",
    randomState: () => "state",
    randomNonce: () => "nonce",
    authorizationUrl: async () => "https://identity.example.test/authorize",
    exchangeCallback: async (_url, checks) => {
      if (checks.expectedState !== "state" || checks.expectedNonce !== "nonce" || checks.pkceVerifier.length < 43) {
        throw new Error("OIDC callback protections were not supplied");
      }
      return {
        issuer: config.oidc.issuer,
        subject: "verified-provider-subject",
        email: "verified@example.test",
        displayName: "Verified Cook",
        accessToken: "provider-access-token",
        refreshToken: "provider-refresh-token",
        idToken: "provider-id-token",
        expiresIn: 3_600,
      };
    },
    refresh: async () => { throw new Error("provider refresh failed"); },
    endSessionUrl: async () => null,
  };
  const billingService = {
    constructWebhookEvent: () => { throw new Error("not used"); },
    processWebhook: async () => ({}),
    createCheckout: async () => "https://checkout.stripe.com/c/pay_test",
    completeCheckoutForUser: async () => { throw new Error("not used"); },
    createPortalForUser: async () => "https://billing.stripe.com/p/session_test",
  };
  const instacartService = {
    createShoppingPage: async () => {
      instacartCalls += 1;
      return `https://www.instacart.com/store/shopping-list/test-${instacartCalls}`;
    },
  };
  const seoService = {
    statusCode: () => 200,
    robots: () => "User-agent: *\nAllow: /\n",
    llms: () => "# Test",
    sitemap: () => "<?xml version=\"1.0\"?><urlset/>",
    render: (template) => template,
  };

  async function createUser(subject, trialStart = now) {
    const user = await repositories.upsertVerifiedOidcUser({
      issuer: config.oidc.issuer,
      subject,
      email: `${subject}@example.test`,
      displayName: subject,
      now: trialStart,
    });
    await repositories.ensureTrialForUser(user.id, { trialDays: 7, now: trialStart });
    return user;
  }

  async function createSession(user, options = {}) {
    const credential = randomCredential();
    const createdAt = options.createdAt ?? now;
    await repositories.createSession({
      idHash: sha256(credential),
      userId: user.id,
      accessTokenCiphertext: encryptString("access", config.encryptionKey),
      refreshTokenCiphertext: encryptString("refresh", config.encryptionKey),
      idTokenCiphertext: encryptString("id-token", config.encryptionKey),
      providerExpiresAt: options.providerExpiresAt ?? null,
      expiresAt: options.expiresAt ?? new Date(now.getTime() + 86_400_000),
      now: createdAt,
    });
    return {
      credential,
      idHash: sha256(credential),
      cookie: `mu_session=${credential}`,
      csrf: csrfToken(credential, config.csrfSecret),
    };
  }

  async function request(path, session, init = {}) {
    const method = (init.method ?? "GET").toUpperCase();
    const headers = new Headers(init.headers);
    if (session) headers.set("Cookie", session.cookie);
    if (session && !["GET", "HEAD", "OPTIONS"].includes(method)) headers.set("X-CSRF-Token", session.csrf);
    return fetch(`${baseUrl}${path}`, { ...init, method, headers, redirect: "manual" });
  }

  async function json(response) {
    return response.json();
  }

  beforeAll(async () => {
    pglite = new PGlite();
    database = createPgliteDatabase(pglite);
    await migrateDatabase(database);
    repositories = createRepositories(database);
    userA = await createUser("user-a");
    userB = await createUser("user-b");
    sessionA = await createSession(userA);
    sessionB = await createSession(userB);
    const app = createApp({
      config,
      database,
      repositories,
      oidcService,
      billingService,
      instacartService,
      seoService,
      clock: () => now,
    });
    server = app.listen(0, "127.0.0.1");
    await new Promise((resolve) => server.once("listening", resolve));
    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  }, 30_000);

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
    await pglite?.close();
  });

  it("returns 401 for missing and random opaque sessions", async () => {
    expect((await request("/api/auth/session", null)).status).toBe(401);
    const random = { cookie: `mu_session=${randomCredential()}` };
    expect((await request("/api/auth/session", random)).status).toBe(401);
  });

  it("uses an opaque OIDC transaction, validates callback state, and exposes only an opaque app session cookie", async () => {
    const login = await request("/api/auth/login?return_to=%2Frecipes", null);
    expect(login.status).toBe(303);
    expect(login.headers.get("location")).toBe("https://identity.example.test/authorize");
    const transactionHeaders = login.headers.get("set-cookie") ?? "";
    const transactionCredential = transactionHeaders.match(/mu_oidc_tx=([^;,\s]+)/)?.[1];
    expect(transactionCredential).toMatch(/^[A-Za-z0-9_-]{40,100}$/);
    expect(transactionHeaders).not.toContain("verified-provider-subject");
    expect(transactionHeaders).not.toContain("provider-access-token");

    const callback = await fetch(`${baseUrl}/api/auth/callback?code=provider-code&state=state&sub=attacker-input`, {
      headers: { Cookie: `mu_oidc_tx=${transactionCredential}` },
      redirect: "manual",
    });
    expect(callback.status).toBe(303);
    expect(callback.headers.get("location")).toBe("/recipes");
    const sessionHeaders = callback.headers.get("set-cookie") ?? "";
    const sessionCredential = sessionHeaders.match(/mu_session=([^;,\s]+)/)?.[1];
    expect(sessionCredential).toMatch(/^[A-Za-z0-9_-]{40,100}$/);
    for (const sensitive of ["verified-provider-subject", "verified@example.test", "provider-access-token", "provider-refresh-token", "provider-id-token"]) {
      expect(sessionHeaders).not.toContain(sensitive);
    }

    const oidcSession = {
      credential: sessionCredential,
      idHash: sha256(sessionCredential),
      cookie: `mu_session=${sessionCredential}`,
      csrf: csrfToken(sessionCredential, config.csrfSecret),
    };
    const status = await request("/api/auth/session", oidcSession);
    expect(status.status).toBe(200);
    expect((await json(status)).user).toEqual({ displayName: "Verified Cook", email: "verified@example.test" });

    const logout = await request("/api/auth/logout", oidcSession, { method: "POST" });
    expect(logout.status).toBe(200);
    expect(await repositories.getSessionByHash(oidcSession.idHash)).toBeNull();

    const secondLogin = await request("/api/auth/login", null);
    const secondTransaction = (secondLogin.headers.get("set-cookie") ?? "").match(/mu_oidc_tx=([^;,\s]+)/)?.[1];
    const invalidCallback = await fetch(`${baseUrl}/api/auth/callback?code=provider-code&state=wrong-state`, {
      headers: { Cookie: `mu_oidc_tx=${secondTransaction}` },
      redirect: "manual",
    });
    expect(invalidCallback.status).toBe(400);
  });

  it("rejects client-supplied tenant identity in query, body, and nested payloads", async () => {
    expect((await request(`/api/auth/session?userId=${userB.id}`, sessionA)).status).toBe(400);
    expect((await request("/api/recipes", sessionA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...recipeA, userId: userB.id }),
    })).status).toBe(400);
    expect((await request("/api/recipes", sessionA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...recipeA, metadata: { tenantId: userB.id } }),
    })).status).toBe(400);
    expect((await request("/api/data/import", sessionA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        format: "mestizo-umami-v1",
        workspace: { ...defaultWorkspaceForTest(), nested: { ownerId: userB.id } },
        recipes: [],
      }),
    })).status).toBe(400);
  });

  it("stamps creates server-side and isolates collection lists", async () => {
    const createdAResponse = await request("/api/recipes", sessionA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipeA),
    });
    const createdBResponse = await request("/api/recipes", sessionB, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipeB),
    });
    expect(createdAResponse.status).toBe(201);
    expect(createdBResponse.status).toBe(201);
    const createdA = (await json(createdAResponse)).recipe;
    const createdB = (await json(createdBResponse)).recipe;

    const [listA, listB] = await Promise.all([
      request("/api/recipes", sessionA).then(json),
      request("/api/recipes", sessionB).then(json),
    ]);
    expect(listA.recipes.map((recipe) => recipe.id)).toContain(createdA.id);
    expect(listA.recipes.map((recipe) => recipe.id)).not.toContain(createdB.id);
    expect(listB.recipes.map((recipe) => recipe.id)).toContain(createdB.id);
    expect(listB.recipes.map((recipe) => recipe.id)).not.toContain(createdA.id);
  });

  it("keeps batch import/export owner-scoped and replaces client record IDs", async () => {
    const preservedB = await repositories.createRecipeForUser(userB.id, recipeB, now);
    const suppliedId = randomUUID();
    const workspace = {
      ...defaultWorkspaceForTest(),
      locale: "pt",
      zip: "01001",
      favorites: ["kimchi-elote"],
    };
    const imported = await request("/api/data/import", sessionA, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        format: "mestizo-umami-v1",
        workspace,
        recipes: [{ ...recipeA, id: suppliedId, createdAt: 1 }],
      }),
    });
    expect(imported.status).toBe(200);
    const importedBody = await json(imported);
    expect(importedBody.recipes).toHaveLength(1);
    expect(importedBody.recipes[0].id).not.toBe(suppliedId);

    const exportedA = await request("/api/data/export", sessionA).then(json);
    expect(exportedA.workspace).toMatchObject({ locale: "pt", zip: "01001" });
    expect(exportedA.recipes.map((recipe) => recipe.title)).toEqual([recipeA.title]);
    expect(await repositories.getRecipeForUser(userB.id, preservedB.id)).not.toBeNull();
    expect(await repositories.getRecipeForUser(userA.id, preservedB.id)).toBeNull();
  });

  it("scopes single reads, updates, and deletes by resource ID plus authenticated owner", async () => {
    const a = await repositories.createRecipeForUser(userA.id, recipeA, now);
    const b = await repositories.createRecipeForUser(userB.id, recipeB, now);

    expect((await request(`/api/recipes/${a.id}`, sessionA)).status).toBe(200);
    expect((await request(`/api/recipes/${b.id}`, sessionA)).status).toBe(404);
    expect((await request(`/api/recipes/${b.id}`, sessionB)).status).toBe(200);
    expect((await request(`/api/recipes/${a.id}`, sessionB)).status).toBe(404);

    const crossUpdate = await request(`/api/recipes/${b.id}`, sessionA, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "A attempted overwrite" }),
    });
    expect(crossUpdate.status).toBe(404);
    expect((await repositories.getRecipeForUser(userB.id, b.id)).title).toBe(recipeB.title);

    const ownUpdate = await request(`/api/recipes/${a.id}`, sessionA, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "A updated safely" }),
    });
    expect(ownUpdate.status).toBe(200);
    expect((await json(ownUpdate)).recipe.title).toBe("A updated safely");

    const ownerChange = await request(`/api/recipes/${a.id}`, sessionA, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Owner injection", userId: userB.id }),
    });
    expect(ownerChange.status).toBe(400);
    expect((await repositories.getRecipeForUser(userA.id, a.id)).title).toBe("A updated safely");

    const inverseCrossUpdate = await request(`/api/recipes/${a.id}`, sessionB, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "B attempted overwrite" }),
    });
    expect(inverseCrossUpdate.status).toBe(404);
    expect((await repositories.getRecipeForUser(userA.id, a.id)).title).toBe("A updated safely");

    const inverseOwnUpdate = await request(`/api/recipes/${b.id}`, sessionB, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "B updated safely" }),
    });
    expect(inverseOwnUpdate.status).toBe(200);
    expect((await json(inverseOwnUpdate)).recipe.title).toBe("B updated safely");

    expect((await request(`/api/recipes/${b.id}`, sessionA, { method: "DELETE" })).status).toBe(404);
    expect(await repositories.getRecipeForUser(userB.id, b.id)).not.toBeNull();
    expect((await request(`/api/recipes/${a.id}`, sessionB, { method: "DELETE" })).status).toBe(404);
    expect(await repositories.getRecipeForUser(userA.id, a.id)).not.toBeNull();
    expect((await request(`/api/recipes/${a.id}`, sessionA, { method: "DELETE" })).status).toBe(204);
    expect(await repositories.getRecipeForUser(userA.id, a.id)).toBeNull();
    expect((await request(`/api/recipes/${b.id}`, sessionB, { method: "DELETE" })).status).toBe(204);
    expect(await repositories.getRecipeForUser(userB.id, b.id)).toBeNull();
  });

  it("isolates workspaces under concurrent requests", async () => {
    const workspaceA = { locale: "en", zip: "10001", favorites: ["kimchi-elote"], notesByRecipe: {}, planner: {}, avoiding: ["soy"], dietary: [] };
    const workspaceB = { locale: "es", zip: "90210", favorites: ["al-pastor-bao"], notesByRecipe: {}, planner: {}, avoiding: [], dietary: ["vegetarian"] };
    const [writeA, writeB] = await Promise.all([
      request("/api/workspace", sessionA, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(workspaceA) }),
      request("/api/workspace", sessionB, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(workspaceB) }),
    ]);
    expect(writeA.status).toBe(200);
    expect(writeB.status).toBe(200);
    const [readA, readB] = await Promise.all([
      request("/api/workspace", sessionA).then(json),
      request("/api/workspace", sessionB).then(json),
    ]);
    expect(readA.document.zip).toBe("10001");
    expect(readB.document.zip).toBe("90210");
    expect(readA.document.favorites).not.toEqual(readB.document.favorites);
  });

  it("requires the session-bound CSRF token for writes", async () => {
    const response = await fetch(`${baseUrl}/api/recipes`, {
      method: "POST",
      headers: { Cookie: sessionA.cookie, "Content-Type": "application/json", "X-CSRF-Token": sessionB.csrf },
      body: JSON.stringify(recipeA),
    });
    expect(response.status).toBe(403);
    expect((await json(response)).code).toBe("CSRF_REJECTED");
  });

  it("keeps the Instacart link cache tenant-scoped", async () => {
    const payload = {
      mode: "list",
      title: "Shared ingredients",
      ingredients: [{ name: "red miso paste", displayText: "Red miso paste" }],
    };
    const create = (session) => request("/api/instacart-shopping-list", session, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(json);

    const before = instacartCalls;
    const firstA = await create(sessionA);
    const secondA = await create(sessionA);
    const firstB = await create(sessionB);

    expect(firstA.url).toBe(secondA.url);
    expect(firstB.url).not.toBe(firstA.url);
    expect(instacartCalls - before).toBe(2);
  });

  it("fails closed for expired, revoked, and failed-refresh sessions", async () => {
    const expired = await createSession(userA, { expiresAt: new Date(now.getTime() - 1) });
    expect((await request("/api/auth/session", expired)).status).toBe(401);
    expect(await repositories.getSessionByHash(expired.idHash)).toBeNull();

    const revoked = await createSession(userA);
    await repositories.revokeSession(revoked.idHash);
    expect((await request("/api/auth/session", revoked)).status).toBe(401);

    const deletedUser = await createUser("deleted-user");
    const deletedUserSession = await createSession(deletedUser);
    await database.query("DELETE FROM users WHERE id = $1", [deletedUser.id]);
    expect((await request("/api/auth/session", deletedUserSession)).status).toBe(401);
    expect(await repositories.getSessionByHash(deletedUserSession.idHash)).toBeNull();

    const refreshFailure = await createSession(userA, { providerExpiresAt: new Date(now.getTime() - 1) });
    expect((await request("/api/auth/session", refreshFailure)).status).toBe(401);
    expect(await repositories.getSessionByHash(refreshFailure.idHash)).toBeNull();
  });

  it("enforces the seven-day wall while leaving authenticated checkout available", async () => {
    const oldStart = new Date(now.getTime() - 8 * 86_400_000);
    const expiredTrialUser = await createUser("expired-trial", oldStart);
    const expiredTrialSession = await createSession(expiredTrialUser);
    const status = await request("/api/auth/session", expiredTrialSession);
    expect(status.status).toBe(200);
    expect((await json(status)).entitlement).toMatchObject({ allowed: false, state: "paywall", daysRemaining: 0 });
    expect((await request("/api/workspace", expiredTrialSession)).status).toBe(403);
    const checkout = await request("/api/billing/checkout", expiredTrialSession, { method: "POST" });
    expect(checkout.status).toBe(200);
    expect((await json(checkout)).url).toContain("checkout.stripe.com");
  });

  it("includes tenant identity in every application cache key", () => {
    expect(tenantCacheKey(userA.id, "recipe", "42")).not.toBe(tenantCacheKey(userB.id, "recipe", "42"));
    expect(tenantCacheKey(userA.id, "recipe", "42")).toContain(`user:${userA.id}:`);
  });
});
