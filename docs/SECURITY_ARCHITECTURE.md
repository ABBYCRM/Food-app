# Multi-tenant security architecture and audit

## Identity invariant

Every protected request follows one path:

```text
opaque HttpOnly cookie → SHA-256 session lookup → expiration check → user lookup → optional server token refresh → req.user.id → owner-scoped query
```

There is no default user, development account, global current user, client-supplied owner, email-based authorization, or fallback to the first database row.

## Authentication

`server/oidc.js` uses `openid-client` and provider discovery. A login creates a fresh random PKCE verifier, S256 challenge, state, and nonce. Only an opaque login-attempt credential is placed in the browser. The verifier is encrypted in PostgreSQL.

The callback consumes the matching unexpired login attempt, validates the authorization response using the original verifier/state/nonce, cryptographically validates the ID token, and takes identity only from the verified `iss` and `sub` claims. `sub`, `email`, `userId`, and related keys received from a browser are rejected as identity input.

## Sessions and CSRF

- Production cookie: `__Host-mu_session`.
- Flags: `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, and an explicit 30-day max-age by default.
- Database stores only the SHA-256 hash of the raw session credential.
- Provider access, refresh, and ID tokens are encrypted independently with AES-256-GCM.
- Mutating routes require an HMAC CSRF token bound to the opaque session.
- Logout deletes the exact user/session record, clears the cookie, then attempts provider logout. Local logout remains effective if provider logout fails.
- Invalid, expired, revoked, missing, deleted-user, or failed-refresh sessions resolve to no identity and return 401 on protected routes.

## Ownership schema

| Table | Ownership boundary | Relevant index/constraint |
| --- | --- | --- |
| `sessions` | `user_id → users.id` | `sessions_user_id_idx` |
| `subscriptions` | unique `user_id → users.id` | `(user_id, status)`, unique Stripe identifiers |
| `user_workspaces` | primary-key `user_id → users.id` | `(user_id, version)` |
| `user_recipes` | `user_id → users.id` | `user_id`, `(user_id, id)` |
| `affiliate_clicks` | `user_id → users.id` | `(user_id, created_at)` |
| `instacart_links` | `user_id → users.id` | unique `(user_id, request_hash)`, `(user_id, expires_at)` |

OIDC login attempts and Stripe event IDs are protocol/idempotency records rather than tenant content.

## Mechanical database-operation audit

All application SQL is centralized in `server/repositories.js`.

| Operation | Enforcement |
| --- | --- |
| Workspace SELECT | `WHERE user_id = req.user.id` |
| Workspace UPSERT | conflict key is the authenticated `user_id`; input schema has no owner field |
| Recipe collection SELECT | `WHERE user_id = req.user.id` |
| Recipe single SELECT | `WHERE user_id = req.user.id AND id = resourceId` |
| Recipe INSERT | server generates UUID and stamps authenticated `user_id` |
| Recipe UPDATE | explicit allowed columns; `WHERE user_id = req.user.id AND id = resourceId` |
| Recipe DELETE | `WHERE user_id = req.user.id AND id = resourceId` |
| Import DELETE/INSERT | one transaction; delete is owner-scoped and every new row is server-stamped |
| Subscription read/update | authenticated `user_id`; checkout/webhooks require the stored customer boundary, configured Stripe price, and server-issued subscription reference; an unrelated subscription under the same customer is ignored |
| Session refresh update | exact `id_hash AND user_id` |
| Affiliate event INSERT | authenticated `user_id` is supplied by the route, never the payload |
| Instacart cache SELECT/UPSERT | lookup and conflict boundary both include authenticated `user_id`; ownership is server-stamped |
| Instacart cache cleanup DELETE | expired rows are deleted only for the authenticated `user_id` |
| Cache | user-data service-worker/API caching is forbidden; the server-side Instacart link cache is owner-scoped and application cache keys start with `user:{id}:` |
| Background job | only schema migration exists; it performs no tenant data selection |

Expired session and OIDC-attempt cleanup deletes only records whose server-owned expiration has passed; it never chooses identity or application content and cannot revoke an active session.

The frontend receives recipe resource IDs so it can request a resource. Possessing an ID never establishes ownership; inaccessible cross-tenant IDs return 404.

## Input boundary

Protected API middleware recursively rejects these client keys in query strings or JSON, including nested objects: `userId`, `user_id`, `tenantId`, `tenant_id`, `organizationId`, `ownerId`, `sub`, `subject`, and `email`. Zod schemas are strict and omit ownership fields entirely. Inputs are copied field-by-field; unvalidated payloads are never spread into database values.

## Browser state

Locale may be stored locally because it is presentation-only. ZIP, favorites, notes, planner entries, allergy/diet filters, and custom recipes are held in request/account-scoped React state and persisted only through authenticated APIs. Legacy local user data is deleted after server hydration. The service worker bypasses `/api`, billing, sessions, and health endpoints.

## Adversarial proof

`tests/e2e/tenant-isolation.test.js` runs the actual Express middleware/routes against the PostgreSQL-compatible schema. It proves:

- A and B list only their own records.
- A and B can read/update/delete their own IDs and receive 404 for each other's IDs.
- Neither identity can assign or change an owner.
- Query, top-level JSON, and nested identity injection are rejected.
- Workspaces remain isolated during concurrent writes and reads.
- Missing, random, expired, revoked, and failed-refresh sessions fail closed.
- A CSRF token from B cannot mutate A's session.
- The seven-day expiry blocks product routes but leaves authenticated checkout available.
- OIDC transactions and browser sessions contain only opaque credentials.
- Instacart cache rows and application cache keys remain isolated for identical requests from A and B.

Run `npm run test:e2e` to repeat the proof.
