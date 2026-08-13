# Food App — Mestizo Umami

> The trilingual kitchen — Mexican fire meets Asian umami.

A 365-day rotating recipe app with serving scaler, allergy filters, week planner, personal notebook, retailer deep-links, and local-vendor lookup by ZIP.

Originally scaffolded as the `mestizo-umami` artifact in `paisabrazilfl-cpu/SIXTEEN`. Now self-contained here at `ABBYCRM/Food-app`.

## Stack

- **Vite 7** + **React 19** + **TypeScript**
- **Tailwind v4** (`@tailwindcss/vite`)
- **wouter** for routing
- **lucide-react** icons
- **framer-motion** for animation
- LocalStorage persistence via `src/lib/storage.ts`

## Run locally

```bash
npm install
npm run dev
```

Opens at <http://localhost:5174>.

## Build

```bash
npm run build
```

Output lands in `dist/`.

## Architecture

| Concern | Location |
| --- | --- |
| i18n (EN/ES/PT) | `src/i18n/{en,es,pt}.ts` |
| Hero recipes (hand-crafted) | `src/data/recipes.ts` |
| Generated daily variants | `src/data/generator.ts` |
| 365-day calendar | `src/data/calendar.ts` |
| Pantry & techniques | `src/data/{pantry,techniques}.ts` |
| Allergy filtering | `src/lib/allergens.ts` |
| Serving scaler | `src/lib/scaling.ts` |
| Retailer deep-links | `src/lib/shopping.ts` |
| Vendor lookup by ZIP | `src/lib/vendor.ts` |
| User data (notebook, planner) | `src/context/UserContext.tsx` |
| Pages | `src/pages/*` |
| Components | `src/components/*` |

## Pages

- **Home** — today's rotation + featured chefs
- **Recipes** — full library, search, filters
- **Recipe detail** — step-by-step, scaler, swap
- **Planner** — week-at-a-glance
- **Pantry** — what you have, what's needed
- **Allergy menu** — exclusion filters
- **Notebook** — personal notes, favorites
- **Vendor** — find local stores by ZIP
- **Chefs** — featured profiles
- **Philosophy** — the story behind the kitchen
- **Search** — global search across the app

## Retailers wired (deep-links)

- Amazon Fresh
- Whole Foods Market
- Instacart
- Walmart Grocery
- Amazon

All deep-links open in the user's logged-in retailer session. We never see credentials.

## Deploy

Static build — works anywhere. Render / Netlify / Vercel / GitHub Pages all fine.

```bash
npm run build       # produces dist/
npm run preview     # serve locally
```

## License

MIT.
# Auto-deploy verified 2026-08-13T17:21:36Z
