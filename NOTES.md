# Mestizo Umami — Developer Notes

> Last updated: August 2026  
> Live: [mestizoumami.com](https://mestizoumami.com) (DNS propagating) | [food-app-locf2.ondigitalocean.app](https://food-app-locf2.ondigitalocean.app)

---

## What This App Is

**Mestizo Umami — The Trilingual Kitchen** is a premium Mexican-Asian fusion recipe app. Users can browse 391 recipes across breakfast, lunch, dinner, and snacks, plan their weekly meals, build shopping lists, find nearby ingredient stores, and follow step-by-step visual cooking guides. The full recipe detail is gated behind a free Google account sign-in.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind v4 |
| Backend | Express/Node.js (TypeScript, compiled via esbuild) |
| Database | PostgreSQL via Drizzle ORM (DigitalOcean managed Postgres) |
| Auth | Google OIDC + PKCE, server-side sessions (express-session) |
| Hosting | DigitalOcean App Platform (static site + Node service) |
| Monorepo | pnpm workspaces |
| Push Notifications | VAPID Web Push |
| Payments (ready) | Stripe (integrated, not yet gating content) |

---

## Monorepo Structure

```
artifacts/
  mestizo-umami/        # React/Vite frontend
  api-server/           # Express backend
lib/
  db/                   # Shared Drizzle/Postgres schema + client
```

### Frontend key directories

```
artifacts/mestizo-umami/src/
  data/
    recipes.ts              # 11 featured recipes
    breakfast-recipes.ts    # 119 breakfast recipes
    lunch-recipes.ts        # 78 lunch recipes
    dinner-recipes.ts       # 92 dinner recipes
    snack-recipes.ts        # 91 snack recipes (includes dips, chips, drinks)
    recipe-locales.ts       # ES + PT translations for all recipes
  pages/
    home.tsx
    recipes.tsx             # Recipe list + filters
    recipe-detail.tsx       # Full recipe page — auth-gated
    planner.tsx             # Weekly meal planner
    notebook.tsx            # Saved recipes + notes
    search.tsx
    stores.tsx              # Nearby store finder
  components/
    plating-guide.tsx       # Visual step-by-step cooking guide
    plating-illustrations.tsx  # 28 hand-drawn SVG illustrations
  lib/
    plating-matcher.ts      # Keyword → illustration matcher
    auth-context.tsx        # Google OIDC session hook
```

---

## Infrastructure — DigitalOcean App Platform

### App ID
`7cc29839-6e3a-4520-ab4c-de16a64a366e`

### Services
| Component | Type | Build |
|---|---|---|
| `web` | Static site | `pnpm --filter @workspace/mestizo-umami build` → `dist/` |
| `api` | Node.js service | `do-build-api.sh` → `artifacts/api-server/dist/index.js` |

### Ingress routing
- `/api/*` → `api` service (Node on port 8080)
- `/*` → `web` static site

### Critical production quirk — DO strips `/api` prefix
DigitalOcean's ingress strips the `/api` prefix before forwarding to the `api` service. The `api-server/src/app.ts` compensates by prepending `/api` to `req.url` in `production` mode via middleware registered before all routes.

### Managed Postgres SSL
DigitalOcean's managed Postgres uses a self-signed certificate. `lib/db/src/index.ts` sets `ssl: { rejectUnauthorized: false }` when `NODE_ENV === 'production'`.

### Build script
`do-build-api.sh` at the repo root installs dependencies and builds the API server. Referenced in the DO app spec under `services.api.build_command`.

---

## Authentication

- **Provider**: Google OIDC (OpenID Connect with PKCE)
- **Client ID**: stored as `OIDC_CLIENT_ID` secret
- **Consent screen**: currently in **test mode** in Google Cloud Console — must be published before any user (not just listed test users) can sign in
- **Callback URL**: `https://food-app-locf2.ondigitalocean.app/api/auth/callback` (and `mestizoumami.com` once DNS propagates)
- **Session**: `express-session` with PostgreSQL session store, `SESSION_SECRET` env var
- **Token encryption**: `TOKEN_ENCRYPTION_KEY` — key is SHA-256 hashed at startup to produce a 32-byte AES key, so any string length works

### Auth gate
Non-authenticated users who visit `/recipe/:slug` see a blurred hero image with a "Sign up — it's free" overlay. After Google OAuth they are redirected back to the recipe. The gate checks `authenticated` from `useAuthContext()`. When Stripe is wired for paywalling, swap the check to `entitlement === "paid"`.

---

## Recipe Data

### Count
| File | Recipes |
|---|---|
| `recipes.ts` (featured) | 11 |
| `breakfast-recipes.ts` | 119 |
| `lunch-recipes.ts` | 78 |
| `dinner-recipes.ts` | 92 |
| `snack-recipes.ts` | 91 |
| **Total** | **391** |

### Locale translations
All 391 recipes have EN/ES/PT translations in `recipe-locales.ts`. Translations include:
- `title`, `subtitle`, `story`, `chefNotes` per locale
- Full `method` array per locale with translated text
- Measurements localised: `cups→copos` (PT) / `tazas` (ES), `tbsp→colheres de sopa` / `cucharadas`, `oz→ml`

### Method step quality
All 391 recipes have granular cookbook-quality method steps (rewritten August 2026):
- 2–5 sentences per step, 50–120 words
- Technique, visual cues, timing, and "why it matters"
- Quantities referenced inline

---

## Visual Cooking Guide (Plating Guide)

Every recipe detail page has a visual step-by-step guide that shows **all method steps** (not just plating/assembly) with B&W SVG illustrations.

### Illustration library (`plating-illustrations.tsx`)
28 illustration types keyed by `IllustrationKey` union type, including:
- **Cooking actions**: `whisk-glaze`, `sear-fish`, `blend-sauce`, `chop-prep`, `season-salt`, `rest-protein`
- **Assembly**: `arrange-bowl`, `place-protein`, `bowl-build`, `taco-fold`, `layer-stack`
- **Garnish/finish**: `herb-scatter`, `drizzle`, `crema-swirl`, `lime-squeeze`, `sesame-top`, `garnish-crumble`
- **Proteins**: `slice-protein`, `plate-present`, `avocado-fan`
- **Other**: `tortilla-base`, `spread-base`, `ladle-pour`, `broth-pour`, `beans-spread`, `egg-sunny`, `egg-overeasy`, `egg-poach`

### Matcher (`plating-matcher.ts`)
Keyword regex rules map step text → `IllustrationKey`. Rules are ordered most-specific first. `extractPlatingSteps()` now returns ALL steps (previously only returned assembly-tagged steps, causing steps 1–2 to be missing).

---

## Meal Planner

- Weekly calendar view with breakfast/lunch/dinner/snack/brunch/side slots
- "Auto Plan My Week" uses 3-month recipe history to avoid repeats
- Print shopping list with portion scaling
- Push notification opt-in — daily 19:00 UTC reminders via VAPID Web Push (`VAPID_PRIVATE_KEY` secret)

---

## PWA

- Service worker with versioned cache
- Home-screen install button
- Icons: 192px, 512px, apple-touch-icon (bowl + chopsticks logo)
- Offline banner

---

## Store Finder

- Geocodes user location via Google Maps (proxied through API server)
- Requires `GOOGLE_MAPS_API_KEY` if geocoding is needed (currently falls back to manual address entry when unauthenticated / key missing — 401 on `/api/geocode` is expected for anon users)

---

## Environment Secrets (required)

| Secret | Purpose |
|---|---|
| `SESSION_SECRET` | express-session signing |
| `TOKEN_ENCRYPTION_KEY` | AES token encryption (any length — SHA-256 hashed) |
| `CSRF_SECRET` | CSRF token signing |
| `OIDC_CLIENT_ID` | Google OAuth client ID |
| `OIDC_CLIENT_SECRET` | Google OAuth client secret |
| `OIDC_ISSUER` | `https://accounts.google.com` |
| `VAPID_PRIVATE_KEY` | Web push notification signing |
| `GITHUB_PAT` | GitHub pushes from CI/agent |
| `DIGITALOCEAN_TOKEN` | DO API for deployments |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | OpenAI API (recipe step rewriter) |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | Replit AI integration proxy base URL |

---

## Known Limitations / Open Items

1. **Google OAuth consent screen is in test mode** — only listed test users can sign in. Must be published in Google Cloud Console to allow all users.

2. **Domain DNS propagating** — `mestizoumami.com` nameservers were pointed to DigitalOcean. Propagation can take 24–72 hours. App is fully functional at `food-app-locf2.ondigitalocean.app` in the meantime. DO will auto-issue an SSL certificate once nameservers resolve.

3. **Stripe integration** — Stripe is scaffolded and integrated but not yet gating recipe content. When ready, change the auth gate in `recipe-detail.tsx` from `if (!authenticated)` to `if (entitlement !== 'paid')`.

4. **ES/PT recipe locale method steps** — The granular English method steps were rewritten in August 2026. The ES/PT locale translations in `recipe-locales.ts` still reflect the older shorter steps. Task #25 is queued to update them.

5. **Snack-recipes.ts recipe count** — The file has 91 slugs but only 26 were detected as having granular steps by the rewrite script (the others were already granular from a prior pass). All 91 are confirmed granular.

6. **No unit tests** — The codebase has no automated unit tests. E2E coverage via Playwright is the primary QA mechanism.

---

## Deployment Workflow

```bash
# 1. Make changes
# 2. TypeScript check
pnpm --filter @workspace/mestizo-umami exec tsc --noEmit

# 3. Commit + push to GitHub
git add .
git commit -m "feat: ..."
git push "https://${GITHUB_PAT}@github.com/ABBYCRM/Food-app.git" main

# 4. DigitalOcean auto-deploys from main branch
# Monitor via:
curl -s "https://api.digitalocean.com/v2/apps/7cc29839-6e3a-4520-ab4c-de16a64a366e" \
  -H "Authorization: Bearer $DIGITALOCEAN_TOKEN" \
  | python3 -c "import sys,json; dep=json.load(sys.stdin)['app'].get('active_deployment',{}); print(dep.get('phase'))"
```

---

## Git Repository

- Remote: `https://github.com/ABBYCRM/Food-app.git`
- Branch: `main`
- PAT stored as `GITHUB_PAT` secret — always set remote URL before push:
  ```bash
  git push "https://${GITHUB_PAT}@github.com/ABBYCRM/Food-app.git" main
  ```

---

## QA — Bugs Found & Fixed (August 2026)

Full E2E Playwright QA run surfaced two bugs, both fixed:

| # | Bug | Root Cause | Fix |
|---|---|---|---|
| 1 | Homepage showed 404 at `/mestizo-umami` (no trailing slash) | Wouter strips base from pathname; when the result is `""` (empty string), no route matched | `useEffect` redirect from `""` → `"/"` in the Router component before the Switch renders |
| 2 | Auth gate sign-up overlay stayed in English in ES/PT locales | Copy was hardcoded strings, not wired to the `t()` locale function | Added 4 new `TranslationKey` entries (`recipe.gate.label/copy/cta/back`) with EN/ES/PT translations; wired into recipe-detail.tsx |

QA results after fixes:
- Homepage (with and without trailing slash): ✅
- Recipe list, planner, search, stores pages: ✅
- Auth gate EN/ES/PT translations: ✅
- API health (`/api/auth/session`): ✅

---

## Session History (key decisions)

| Date | Change | Reason |
|---|---|---|
| Aug 2026 | Monorepo restructure (flat → `artifacts/`) | Scale, separation of concerns |
| Aug 2026 | Translate all 389 recipes to ES + PT | Trilingual app requirement |
| Aug 2026 | OIDC+PKCE Google auth, server-side sessions | Security — no tokens in localStorage |
| Aug 2026 | DO App Platform API service added | Static site can't run auth/session |
| Aug 2026 | `/api` prefix middleware in production | DO ingress strips prefix before forwarding |
| Aug 2026 | `ssl: { rejectUnauthorized: false }` for Postgres | DO managed Postgres uses self-signed cert |
| Aug 2026 | Recipe detail auth gate | Signup funnel — browse free, cook logged in |
| Aug 2026 | Plating guide shows ALL steps | Previous filter showed only assembly steps (steps 4–5), missing prep/cook steps |
| Aug 2026 | 28 SVG illustration types added | Step-specific visuals — whisk, sear, blend, arrange, place |
| Aug 2026 | All 391 recipe method steps rewritten | Granular cookbook quality — 2–5 sentences, technique + visual cues |
| Aug 2026 | `PUBLIC_BASE_URL` updated to `mestizoumami.com` | Domain purchased and DNS set |
