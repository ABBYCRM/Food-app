---
name: Mestizo Umami releases
description: DigitalOcean deployment checks that are not obvious from the repository
---

Resolve the DigitalOcean app by the app name `food-app` before deploying rather than relying on a previously saved app ID.

**Why:** The app ID changed while the app name and source repository remained stable, causing a stale-ID deployment attempt to return 404.

**How to apply:** List apps, select the exact `food-app` target, confirm it tracks `ABBYCRM/Food-app` on `main`, and monitor the deployment for the pushed commit until it is `ACTIVE`.

Development secrets are not automatically copied to DigitalOcean App Platform.

**Why:** The first production build had the new code but the API service lacked the `COMPOSIO_API_KEY` runtime key, which would have disabled the provider routes.

**How to apply:** Audit required environment-variable key names on the production API service after adding an integration. Add missing values as runtime secrets without displaying them, then wait for the app-spec deployment to become `ACTIVE`.