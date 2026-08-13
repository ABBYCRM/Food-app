# Security Model — current and target

## Current state (2026-08-12)
This app is a **client-side-only PWA** built on Vite + React + wouter + LocalStorage.
There is no backend, no auth, no database. State is per-browser only.

Implications for the 18-rule multi-tenant wall:

| Rule | Status | Why |
| --- | --- | --- |
| 1. OIDC + PKCE login | n/a | no server |
| 2. Opaque session cookie | n/a | no server |
| 3. Identity per-request from session | n/a | no server |
| 4. Never accept `userId` from API | n/a | no API |
| 5. Ownership column on every tenant-owned table | n/a | no tables; data is static in `src/data/*` |
| 6. Scope every `SELECT` by `userId` | n/a | no DB |
| 7. Stamp `userId` server-side on `INSERT` | n/a | no DB |
| 8. Scope every `UPDATE` by `(id, userId)` | n/a | no DB |
| 9. Scope every `DELETE` by `(id, userId)` | n/a | no DB |
| 10. Scope single-record reads | n/a | no DB |
| 11. Centralize scoping in repository functions | n/a | no DB |
| 12. No global user/tenant state | **compliant** | all state is `useUser()` / `useState` / LocalStorage, never module-global |
| 13. Fail closed (401 / 403) | n/a | no server |
| 14. Logout revokes the session | n/a | no session; `useUser().reset()` is the analog |
| 15. Treat frontend auth as UX only | n/a | no auth at all yet |
| 16. Audit every DB operation | n/a | no DB |
| 17. Two-user adversarial tests | n/a | no DB |
| 18. Final acceptance — malicious client can't reach another user's data | n/a | there is only one user (the browser) |

## What we DO have today
- `useUser()` context — single source of truth, scoped to a React subtree. No `let currentUser;` anywhere.
- LocalStorage persistence via `src/lib/storage.ts` — keys are namespaced, no cross-tenant data.
- All data is **read-only content** in `src/data/*` (recipes, calendar, pantry, techniques) — no per-user row state, so no cross-user leak surface.
- Per-user state that DOES exist (favorites, notebook, planner) is keyed by `slug` and lives in LocalStorage under the user's browser only. It's a real-world equivalent of a single-tenant system.

## Target state (when a backend gets bolted on)
When this app gets a server (FastAPI, Node, whatever), the wall applies in full:

1. **Auth** — OIDC + PKCE via a trusted provider. Frontend gets an opaque session cookie, never a userId.
2. **Ownership columns** — every table that holds per-user data (favorites, notebook, planner, search history) gets a `userId` column. The existing LocalStorage keys (e.g. `mestizo:user:favorites`) become the cache; the server table is the source of truth.
3. **Repositories, not raw queries** — every `savedTools.*` call goes through `getSavedToolsForUser(userId)`, `addSavedToolForUser(userId, slug)`, etc. The dangerous shape `db.select().from(savedTools)` is not allowed in code review.
4. **Ownership on every write** — `userId` is stamped from the session, never from the request body. If a request body contains `userId`, the validator strips it before it reaches the data layer.
5. **Compound WHERE on mutations** — `UPDATE` and `DELETE` clauses use `AND userId = req.user.id`. IDOR-by-id is structurally impossible.
6. **Test with two adversarial users** — CI runs the two-user matrix (A vs B cross-read/cross-write/IDOR-guess) and any new per-user table must add a test or it doesn't ship.
7. **Cache keys** — `user:{id}:favorites:v{N}`, never just `favorites:v{N}`. (Rule 12.)
8. **Audit on every PR** — `grep` every `db\.(select|insert|update|delete)` on a user-owned table and verify the scoping clause exists.

## What this means right now
The frontend can keep working as-is. The wall starts at the first `/api/*` route, not before. We'll re-evaluate when a backend is in scope.
