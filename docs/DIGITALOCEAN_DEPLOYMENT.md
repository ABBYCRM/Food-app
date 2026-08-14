# DigitalOcean App Platform deployment

This deployment is one Node.js service: Express serves the Vite build and same-origin API, while DigitalOcean PostgreSQL stores users, encrypted provider tokens, opaque sessions, trials/subscriptions, workspaces, recipes, and affiliate click events.

## 0. Revoke exposed credentials

If a DigitalOcean token or GitHub PAT has appeared in chat, an issue, a terminal transcript, or a committed file, revoke it before doing anything else. Create a new least-privilege DigitalOcean token only when the CLI/API deployment is ready. Do not put either token in App Platform runtime variables; App Platform's GitHub integration should read the repository directly.

## 1. Prepare the external accounts

### Trusted OIDC provider

Create a standard web/OpenID Connect application with authorization-code flow and PKCE enabled.

1. Decide the final DigitalOcean primary domain first.
2. Register the exact callback `https://YOUR-DOMAIN/api/auth/callback`.
3. Register `https://YOUR-DOMAIN` as the post-logout return URL.
4. Enable the `openid`, `profile`, `email`, and `offline_access` scopes.
5. Copy the exact issuer URL, client ID, and confidential client secret if the provider issues one.
6. Do not use an email address as the application identity. The server uses only verified `(issuer, sub)`.

### Stripe

1. In Stripe test mode, create a Mestizo Umami product.
2. Create one recurring price at the chosen interval/currency.
3. Copy its `price_...` ID. The price object—not UI text—is the amount Stripe charges.
4. Add the webhook endpoint `https://YOUR-DOMAIN/api/billing/webhook`.
5. Subscribe it to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
6. Copy the endpoint's `whsec_...` signing secret.
7. Configure the Customer Portal to allow the cancellation/payment-method actions you intend to support.

The application starts a seven-day internal trial at first verified login. Stripe Checkout intentionally has no `trial_period_days`; checkout charges according to the selected price immediately after the app paywall. This prevents an accidental second seven-day trial.

### Instacart and affiliate programs

Complete [the affiliate/cart guide](AFFILIATE_SETUP.md). Production cart handoff needs an approved Instacart production key. Paid referrals require approval and identifiers from each vendor; code alone cannot create a payable affiliate account.

## 2. Create strong application secrets

Generate two independent values locally:

```bash
openssl rand -base64 32
openssl rand -base64 48
```

- Use the first as `TOKEN_ENCRYPTION_KEY`; it must decode to exactly 32 bytes.
- Use the second as `CSRF_SECRET`.
- Do not reuse an OIDC, Stripe, database, GitHub, or DigitalOcean secret.
- Back up the token-encryption key in a secure secret manager. Losing it makes existing encrypted provider tokens unreadable and requires session revocation/re-login.

## 3. Create the DigitalOcean app

`.do/app.yaml` defines:

- Node.js 22 buildpack service.
- `npm run build` build command.
- `npm start` runtime command on port 8080.
- `/readyz` database readiness probe and `/healthz` liveness probe.
- graceful termination.
- a `PRE_DEPLOY` migration job running `npm run migrate`.
- a real DigitalOcean development PostgreSQL component for the first end-to-end deployment.
- manual deployment (`deploy_on_push: false`) so an unrelated push cannot deploy while another contributor is working.

Create through the control panel using the repository and spec, or with a newly rotated CLI token:

```bash
doctl auth init
doctl apps create --spec .do/app.yaml
```

Do not use the compromised token. Do not turn on deploy-on-push until the implementation branch has been reviewed and intentionally merged.

## 4. Upgrade the database boundary before accepting payments

The checked-in spec provisions App Platform's development PostgreSQL so a fresh environment is functional without hard-coded cluster identifiers. DigitalOcean recommends a managed production database for production workloads.

Before a public paid launch:

1. Create a DigitalOcean Managed PostgreSQL 18 cluster in the app's region/VPC.
2. Create a dedicated database/user for this app.
3. Add the app as a trusted source.
4. Attach the cluster to the App Platform app with component name `postgres-db`.
5. Confirm `DATABASE_URL` still binds to `${postgres-db.DATABASE_URL}`.
6. Replace the spec's dev database entry with the attached production entry (`production: true`, its real `cluster_name`, `db_name`, and `db_user`) when exporting the live app spec.
7. Redeploy and confirm the pre-deploy migration completes before traffic switches.
8. Enable automated backups and test a restore into a separate database.

Never paste a literal database URL into Git or a build-time variable. The service needs it only at runtime.

## 5. Add encrypted environment settings

In DigitalOcean, open the app's Settings and add these as encrypted/runtime variables unless noted otherwise.

| Variable | Scope/type | Value source |
| --- | --- | --- |
| `OIDC_ISSUER` | runtime, general | exact trusted provider issuer |
| `OIDC_CLIENT_ID` | runtime, general | registered web client |
| `OIDC_CLIENT_SECRET` | runtime, encrypted | provider; omit only for a registered public PKCE client |
| `TOKEN_ENCRYPTION_KEY` | runtime, encrypted | 32-byte generated key |
| `CSRF_SECRET` | runtime, encrypted | independent generated secret |
| `STRIPE_SECRET_KEY` | runtime, encrypted | Stripe test/live secret key |
| `STRIPE_WEBHOOK_SECRET` | runtime, encrypted | webhook endpoint signing secret |
| `STRIPE_PRICE_ID` | runtime, general | selected recurring Stripe price |
| `SUBSCRIPTION_PRICE_DISPLAY` | runtime, general | human-readable text matching that price |
| `INSTACART_API_KEY` | runtime, encrypted | approved development/production key |
| `VITE_AMAZON_ASSOCIATE_TAG` | build time, general | approved Amazon tracking ID |
| `VITE_WALMART_AFFILIATE_LINK_TEMPLATE` | build time, encrypted | exact approved redirect template containing `{url}` |

The spec already binds or sets `PUBLIC_BASE_URL`, `DATABASE_URL`, cookie security, seven trial days, session lifetime, trust proxy, and the production Instacart origin.

Anything prefixed `VITE_` is public in the browser bundle even when the control panel labels it encrypted. Never put a Stripe, OIDC, Instacart, database, DigitalOcean, or GitHub secret in a `VITE_` variable.

## 6. Deploy in test mode

1. Keep Stripe in test mode.
2. Use a test OIDC client and Instacart development/approved test key as appropriate.
3. Trigger a manual deployment.
4. Verify build → pre-deploy migration → service health in that order.
5. Open `/readyz`; expect `{"ready":true}`.
6. Open `/healthz`; expect `ok`.
7. Confirm `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and one recipe URL return 200.
8. Sign in with User A. Confirm the session cookie is HttpOnly, Secure, SameSite=Lax, Path=/, and named `__Host-mu_session`.
9. Confirm the session response contains no application user ID or provider tokens.
10. Confirm the trial reports seven days and no card was collected.
11. Create a note, favorite, plan entry, ZIP, filters, and custom recipe. Sign out.
12. Sign in as independent User B and prove none of A's data appears.
13. Attempt A's known recipe UUID under B; expect 404 for GET/PATCH/DELETE.
14. Advance a test user's `trial_ends_at` or use a controlled test environment; confirm protected APIs return `403 PAYWALL_REQUIRED`.
15. Complete a Stripe test checkout. Confirm the success page verifies the authenticated Stripe customer, configured price, and server-issued subscription reference before opening the app.
16. Send Stripe test webhooks and confirm subscription update/delete/payment-failure states change access correctly.
17. Create Instacart recipe and weekly-list pages, then verify store selection/product review/cart/checkout occurs on Instacart.
18. Confirm Amazon/Walmart click destinations contain the approved attribution and disclosures appear before the click.

## 7. Switch to live services

1. Put the managed database and backups in place.
2. Switch OIDC callback/logout URLs to the final primary domain.
3. Replace Stripe test secret, price ID, and webhook signing secret with live values.
4. Replace Instacart development credentials/origin with approved production values.
5. Set approved Amazon/Walmart identifiers and rebuild; Vite values take effect only after a new build.
6. Run `npm run check` against the release commit.
7. Deploy manually, inspect migration and health logs, then run the acceptance list again.
8. Enable deploy-on-push only if that matches the team's reviewed release workflow.

## 8. Operations

- Treat repeated `/readyz` failures as database connectivity/migration incidents.
- Monitor 401/403/404 rates separately; they are expected security outcomes, not generic 500s.
- Alert on Stripe signature failures, webhook processing failures, OIDC discovery/refresh failures, and Instacart 429/5xx responses.
- Rotate provider secrets through DigitalOcean encrypted settings. Revoking `TOKEN_ENCRYPTION_KEY` requires deleting active sessions because old ciphertext cannot be decrypted.
- Keep the database connection limit below the managed pool limit across all scaled service instances and the migration job.
- Restore backups into an isolated database and repeat the two-user isolation tests after schema changes.
- Never diagnose by logging cookies, authorization codes, PKCE verifiers, provider tokens, Stripe payload secrets, or full database URLs.

DigitalOcean's current references for this setup are its [Node.js buildpack](https://docs.digitalocean.com/products/app-platform/reference/buildpacks/nodejs/), [build/run commands](https://docs.digitalocean.com/products/app-platform/how-to/build-run-commands/), [database binding](https://docs.digitalocean.com/products/app-platform/how-to/manage-databases/), [deploy-time jobs](https://docs.digitalocean.com/products/app-platform/how-to/manage-jobs/), and [health checks](https://docs.digitalocean.com/products/app-platform/how-to/manage-health-checks/).
