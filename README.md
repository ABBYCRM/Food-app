# Food App — Mestizo Umami

Mestizo Umami is a trilingual Mexican-Asian cooking app with a 365-recipe calendar, serving scaler, allergy filters, weekly planning, a private notebook, affiliate retailer links, and an Instacart-supported shopping-page handoff.

## What is implemented

- Installable PWA with manifest, maskable icons, install prompt, iOS instructions, standalone mode, and an API-safe service worker.
- Seven-day server-owned trial followed by a Stripe subscription paywall. Checkout does not create a second trial.
- Standards-based OIDC authorization-code authentication with PKCE, state, nonce, provider discovery, cryptographic token validation, and server-side refresh.
- Opaque, revocable server sessions in PostgreSQL. Provider tokens are AES-256-GCM encrypted and never sent to browser JavaScript.
- User-owned workspace, recipes, subscriptions, affiliate events, and sessions with owner-scoped reads and writes.
- Amazon and Walmart affiliate attribution plus Instacart Developer Platform recipe/list pages. Retailers retain product matching, carts, substitutions, pricing, and checkout.
- Live Google Maps vendor searches scoped to the submitted postal code; no invented store listings or fixed distance claims.
- DigitalOcean App Platform web service, PostgreSQL binding, pre-deploy migration job, readiness/liveness probes, and graceful shutdown.
- Dynamic canonical metadata, Open Graph cards, honest Recipe JSON-LD, a 365-recipe sitemap, `robots.txt` rules for OAI-SearchBot, and `llms.txt`.
- Generated branded fallback/social imagery and resilient image loading across every image surface.

## Stack

- React 19, TypeScript, Vite 7, Tailwind CSS 4, wouter
- Node.js 22, Express 5, PostgreSQL via Postgres.js
- `openid-client` for OIDC/OAuth validation
- Stripe Checkout, Customer Portal, and signed webhooks
- PGlite-backed adversarial integration tests

## Local development

The production server intentionally has no default user, fake login, or authentication bypass. Use a PostgreSQL database, a registered trusted OIDC client, Stripe test-mode credentials, and an Instacart development key.

```bash
cp .env.example .env.local
npm ci
npm run migrate
```

Register `http://localhost:5174/api/auth/callback` with the development OIDC client. Then run the complete development stack in two terminals:

```bash
# Terminal 1: Express API on 8080; reads .env.local automatically
npm run dev:server

# Terminal 2: Vite on 5174; proxies API/protocol routes to Express
npm run dev
```

For frontend-only visual work, `npm run dev` can run alone; authenticated features require both processes.

## Validation

```bash
npm run check
npm run test:e2e
npm audit --omit=dev
```

The integration suite creates two independent identities and proves collection, single-record, create, update, delete, workspace, session, CSRF, trial, cache-key, and concurrent-request isolation.

## Architecture map

| Concern | Location |
| --- | --- |
| Server composition and routes | `server/app.js` |
| OIDC + PKCE | `server/oidc.js`, `server/auth.js` |
| Opaque cookies and encryption | `server/security.js` |
| Tenant-scoped data access | `server/repositories.js` |
| Seven-day entitlement | `server/entitlements.js` |
| Stripe lifecycle | `server/billing.js` |
| PostgreSQL schema | `migrations/001_auth_billing_tenancy.sql`, `migrations/002_instacart_links.sql` |
| Instacart handoff | `server/instacart.js`, `src/lib/instacart.ts` |
| Affiliate attribution | `src/lib/affiliate.ts`, `src/lib/shopping.ts` |
| PWA | `public/manifest.webmanifest`, `public/sw.js`, `src/components/InstallButton.tsx` |
| SEO/AEO | `server/seo.js`, `scripts/generate-seo.ts` |
| DigitalOcean spec | `.do/app.yaml` |
| Auth/paywall UI | `src/context/AuthContext.tsx`, `src/components/AccessGate.tsx` |
| Server-owned user state | `src/context/UserContext.tsx` |

## Deployment and operating guides

- [DigitalOcean production setup](docs/DIGITALOCEAN_DEPLOYMENT.md)
- [Multi-tenant security architecture and audit](docs/SECURITY_ARCHITECTURE.md)
- [Affiliate revenue and vendor cart setup](docs/AFFILIATE_SETUP.md)
- [SEO and ChatGPT Search setup](docs/SEO_AEO.md)

No credentials belong in this repository. Variables prefixed with `VITE_` are public at build time; every provider key, database URL, encryption key, and webhook secret must be stored as an encrypted runtime setting.
