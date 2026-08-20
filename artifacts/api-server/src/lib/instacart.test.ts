import assert from "node:assert/strict";
import test from "node:test";
import type { AuthConfig } from "./config-auth.js";
import { containsClientIdentity } from "./security.js";
import {
  buildInstacartRequest,
  createInstacartService,
  normalizeComposioUnit,
  safeProductsLink,
} from "./instacart.js";

function config(): AuthConfig {
  return {
    isProduction: false,
    publicBaseUrl: "https://mestizoumami.com",
    oidc: { issuer: "", clientId: "", clientSecret: undefined, scopes: "", redirectUri: "" },
    encryptionKey: Buffer.alloc(32),
    csrfSecret: "test",
    sessionTtlSeconds: 60,
    oidcAttemptTtlSeconds: 60,
    cookieSecure: false,
    cookieSameSite: "Lax",
    trialDays: 7,
    stripe: null,
    composio: {
      apiKey: "test-key",
      apiBaseUrl: "https://backend.composio.dev/api/v3.1",
    },
  };
}

test("normalizes catalog units before sending them to Composio", () => {
  assert.equal(normalizeComposioUnit("lbs"), "lb");
  assert.equal(normalizeComposioUnit("cups"), "cup");
  assert.equal(normalizeComposioUnit("cloves"), "each");
  assert.equal(normalizeComposioUnit("pinch"), undefined);

  const request = buildInstacartRequest({
    mode: "list",
    title: "Test",
    ingredients: [{ name: "chicken", quantity: 2, unit: "lbs" }],
  });
  assert.deepEqual(request.arguments.line_items, [{ name: "chicken", quantity: 2, unit: "lb" }]);
});

test("rejects browser-supplied app and provider identity fields", () => {
  assert.equal(containsClientIdentity({ user_id: "other-user" }), true);
  assert.equal(containsClientIdentity({ connectedAccountId: "other-account" }), true);
  assert.equal(containsClientIdentity({ provider_user_id: "other-provider-user" }), true);
  assert.equal(containsClientIdentity({ composioUserId: "other-composio-user" }), true);
  assert.equal(containsClientIdentity({
    mode: "recipe",
    ingredients: [{ name: "rice", displayText: "1 cup rice" }],
  }), false);
});

test("accepts only official HTTPS Instacart destinations", () => {
  assert.equal(
    safeProductsLink("https://customers.dev.instacart.tools/store/recipes/abc"),
    "https://customers.dev.instacart.tools/store/recipes/abc",
  );
  assert.throws(() => safeProductsLink("http://instacart.com/unsafe"));
  assert.throws(() => safeProductsLink("https://instacart.com.evil.example/unsafe"));
  assert.throws(() => safeProductsLink(undefined));
});

test("derives distinct Composio identities from server user IDs", async () => {
  const originalFetch = globalThis.fetch;
  const bodies: Array<Record<string, unknown>> = [];
  globalThis.fetch = async (_input, init) => {
    bodies.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
    return new Response(JSON.stringify({
      successful: true,
      data: { url: "https://customers.dev.instacart.tools/store/recipes/test" },
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  try {
    const service = createInstacartService(config());
    assert.ok(service);
    const input = { mode: "list" as const, title: "Test", ingredients: [{ name: "rice" }] };
    await service.createShoppingPage("user-a", input);
    await service.createShoppingPage("user-b", input);
    assert.equal(bodies[0]?.user_id, "mestizo-user-a");
    assert.equal(bodies[1]?.user_id, "mestizo-user-b");
    assert.notEqual(bodies[0]?.user_id, bodies[1]?.user_id);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("turns malformed successful Composio data into a controlled provider error", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    successful: true,
    data: { url: null },
  }), { status: 200, headers: { "Content-Type": "application/json" } });

  try {
    const service = createInstacartService(config());
    assert.ok(service);
    await assert.rejects(
      service.createShoppingPage("user-a", {
        mode: "list",
        title: "Test",
        ingredients: [{ name: "rice" }],
      }),
      (error: unknown) => (error as { statusCode?: number }).statusCode === 502,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});