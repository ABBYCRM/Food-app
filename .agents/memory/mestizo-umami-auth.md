---
name: Mestizo Umami auth architecture
description: Multi-tenant OIDC+PKCE auth stack — what exists, how it boots, key quirks.
---

# Auth & Security Architecture

## Stack
- **openid-client v6** PKCE flow; OIDC provider = Google (`https://accounts.google.com`)
- Server-side opaque session cookies; tokens AES-256-GCM encrypted at rest
- All DB operations scoped to `userId` via `auth-repos.ts`
- Stripe billing + Instacart links wired but disabled until their secrets are set

## Files
- `artifacts/api-server/src/lib/config-auth.ts` — loads all auth/billing env vars; gracefully disables routes when secrets absent
- `artifacts/api-server/src/lib/security.ts` — AES-256-GCM, CSRF HMAC, opaque cookie helpers
- `artifacts/api-server/src/lib/oidc-service.ts` — openid-client v6 PKCE (discovery, authz URL, code exchange, refresh, end-session)
- `artifacts/api-server/src/lib/auth-middleware.ts` — `resolveAuthentication`, `requireAuthentication`, `requireCsrf`; exports `AuthMiddleware` type
- `artifacts/api-server/src/lib/auth-repos.ts` — raw-SQL repo; every SELECT/UPDATE/DELETE scoped to userId
- `artifacts/api-server/src/lib/entitlements.ts` — trial/paid/paywall states
- `artifacts/api-server/src/lib/billing.ts` — Stripe checkout/portal/webhook (idempotent via stripe_events table)
- `artifacts/api-server/src/lib/instacart.ts` — Instacart IDP shopping links with server-side cache
- `artifacts/api-server/src/routes/auth.ts` — GET /api/auth/session, /login, /callback; POST /logout
- `artifacts/api-server/src/routes/billing.ts` — POST /api/billing/webhook (raw body), checkout, portal
- `artifacts/api-server/src/routes/workspace.ts` — workspace/recipe CRUD, affiliate clicks, instacart
- `artifacts/mestizo-umami/src/lib/auth-context.tsx` — `AuthProvider` + `useAuthContext()`
- `artifacts/mestizo-umami/src/lib/use-auth.ts` — `useAuth()` hook (fetches /api/auth/session)
- `artifacts/mestizo-umami/src/components/account-button.tsx` — sign-in button / user avatar dropdown

## SQL migrations
- `artifacts/api-server/migrations/001_auth_billing_tenancy.sql` — users, sessions, oidc_login_attempts, subscriptions, stripe_events, user_workspaces, user_recipes, affiliate_clicks
- `artifacts/api-server/migrations/002_instacart_links.sql` — instacart_links

## Startup boot order (app.ts)
1. Helmet security headers
2. Raw body middleware for `/api/billing/webhook` (must precede express.json)
3. `loadAuthConfig()` — reads env vars
4. If `TOKEN_ENCRYPTION_KEY` AND `CSRF_SECRET` AND `OIDC_ISSUER` AND `OIDC_CLIENT_ID` are all set → create OIDC service + auth middleware → mount auth, billing, workspace routes
5. Core router (push, health, proxy) always mounted

## Key quirks / lessons
**Why:** `TOKEN_ENCRYPTION_KEY` is derived via SHA-256 so any non-empty string works — the user's value may not be exactly 32 bytes of base64. Do NOT add length validation back.

**Why:** Migration runner uses `process.cwd()` + `"migrations"` not `import.meta.url` — esbuild bundles everything to a single `dist/index.mjs`, making `import.meta.url` point to the dist file rather than the source tree.

**Why:** Auth, billing, and workspace routes are only mounted when their respective secrets are present. The server starts cleanly without any of them — push notifications, health check, and proxy always work.

**Why:** `AuthMiddleware` type is defined in `auth-middleware.ts` and re-exported from `auth.ts`. Import it from `auth-middleware.ts` directly to avoid circular references.

## Required secrets for auth to activate
- `TOKEN_ENCRYPTION_KEY` — any non-empty string (SHA-256 derived internally)
- `CSRF_SECRET` — any non-empty string
- `OIDC_ISSUER` — `https://accounts.google.com` for Google
- `OIDC_CLIENT_ID` — from Google Cloud Console → APIs & Services → Credentials
- `OIDC_CLIENT_SECRET` — same
- Redirect URI to register: `{PUBLIC_BASE_URL}/api/auth/callback`

## Optional secrets (disable gracefully when absent)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`
- `INSTACART_API_KEY`
