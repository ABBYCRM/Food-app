# Affiliate revenue and vendor-cart setup

The code is ready to create attributed retailer visits. Actual commission payments begin only after each vendor approves the publisher account and its identifiers are configured in the deployment.

## What the app can do

| Retailer | Payout program | Attribution used by this app | Cart handoff |
| --- | --- | --- | --- |
| Amazon, Amazon Fresh, Whole Foods | Amazon Associates | Adds the approved Associate tag to Amazon URLs | Opens tagged product searches; Amazon does not publish a general multi-retailer consumer-cart API for this use case |
| Walmart | Walmart Creator / its approved affiliate platform | Wraps Walmart URLs in the exact qualifying-link template supplied to the publisher | Opens attributed Walmart searches; no public general consumer-cart write API is assumed |
| Instacart | Instacart Developer Platform (IDP) + Impact | Uses the affiliate parameters Instacart adds to approved partners' API-generated URLs | Creates a shoppable recipe or weekly list; the customer selects a store, reviews matched products, adds them to their cart, and checks out |

The app never signs in as the customer, reads a retailer password, or silently changes a retailer cart. That boundary is intentional. The retailer owns product matching, substitutions, availability, final quantities, price, cart, and checkout.

## 1. Create the local configuration

```bash
cp .env.example .env.local
```

Do not commit `.env.local`. The repository ignores it.

The public Amazon tag and Walmart qualifying-link template are compiled into outbound browser links. The Instacart API key is different: it is a server secret and must never use a `VITE_` prefix.

## 2. Amazon Associates

1. Apply to [Amazon Associates](https://affiliate-program.amazon.com/).
2. Complete the account, tax, banking, website, and traffic-source details Amazon requests.
3. Copy the tracking ID for this site. A US tracking ID commonly looks like `yourbrand-20`.
4. Set it in the build environment:

   ```dotenv
   VITE_AMAZON_ASSOCIATE_TAG=your-approved-tag-20
   ```

5. Rebuild and redeploy. Vite variables are build-time values.
6. Click an Amazon, Amazon Fresh, or Whole Foods shopping link and confirm its query string contains your exact `tag` value.
7. Confirm the click appears in the Associates reporting dashboard after Amazon's reporting delay.

The UI conditionally displays Amazon's required statement when a valid tag is configured: “As an Amazon Associate I earn from qualifying purchases.” Review the current [Amazon Associates disclosure requirements](https://affiliate-program.amazon.com/help/node/topic/GHQNZAU6669EZS98) and [Operating Agreement](https://affiliate-program.amazon.com/help/operating/agreement) before launch.

Do not invent tags, reuse another publisher's tag, cloak a link in a way Amazon forbids, or claim that an unapproved click earns money.

## 3. Walmart Creator

1. Apply through [Walmart Creator](https://creator.walmart.com/).
2. Complete its onboarding, payment, tax, property, and disclosure requirements.
3. Generate or obtain a qualifying affiliate link that can redirect to a Walmart destination. Use the exact structure issued by Walmart or its approved affiliate platform.
4. Replace only the destination value in that structure with the literal token `{url}`. Example shape only:

   ```dotenv
   VITE_WALMART_AFFILIATE_LINK_TEMPLATE=https://approved-network.example/click?...&destination={url}
   ```

   Do **not** use the example domain. Paste the real template from your approved account.

5. Rebuild and redeploy.
6. Click a Walmart shopping link. Confirm it first uses the approved tracking/redirect host, then lands on the expected `walmart.com` search.
7. Confirm the click and any qualifying order appear in the affiliate dashboard.

If the template is empty, malformed, lacks `{url}`, uses HTTP, or is pointed at a non-Walmart destination, the app fails safely to the ordinary Walmart link. Review the current [Walmart Creator terms](https://creator.walmart.com/terms) and its [affiliate marketing guide](https://creator.walmart.com/inspiration/guide-to-affiliate-marketing).

## 4. Instacart shoppable carts and referral payouts

### Development setup

1. Apply for the [Instacart Developer Platform](https://docs.instacart.com/developer_platform_api/).
2. Create a development API key.
3. Keep the development base URL in the server environment:

   ```dotenv
   INSTACART_API_KEY=your-development-key
   INSTACART_API_BASE_URL=https://connect.dev.instacart.tools
   ```

4. Run the DigitalOcean Node service. Express exposes the authenticated, same-origin `/api/instacart-shopping-list` route; the Instacart key never reaches Vite or the browser.
5. On a recipe, select Instacart and click **Shop on Instacart**. The app sends only the recipe title, selected ingredient names, supported units, scaled quantities, and a link back to the recipe.
6. On the weekly planner, click **Shop on Instacart**. The app creates one consolidated shopping-list page.

The route requires an opaque authenticated session, a valid session-bound CSRF token, and an active trial/subscription. It validates strict input, caps request size and item count, permits only the configured official Instacart API origin, restricts linkbacks to this app's origin, times out stalled requests, and returns only an HTTPS `instacart.com` URL.

### Production and affiliate attribution

1. Follow Instacart's [pre-launch checklist](https://docs.instacart.com/developer_platform_api/guide/concepts/launch_activities/pre-launch_checklist/) and request production approval.
2. Replace the development key with the production key.
3. Set:

   ```dotenv
   INSTACART_API_BASE_URL=https://connect.instacart.com
   ```

4. Apply for Instacart's affiliate arrangement through Impact as described in [Conversions and payments](https://docs.instacart.com/developer_platform_api/guide/concepts/launch_activities/conversions_and_payments/).
5. Finish Impact's tax, banking, contract, and property setup.
6. After approval and configuration, Instacart appends attribution to every URL created by the IDP API.
7. Do not append Impact, `aff_id`, offer, or duplicate tracking parameters in this code. Instacart warns that duplicate parameters can break attribution.
8. Test the production link, checkout flow, click reporting, conversion reporting, and payout dashboard with the approved account.

The implementation follows Instacart's current [recipe-page endpoint](https://docs.instacart.com/developer_platform_api/api/products/create_recipe_page), [shopping-list endpoint](https://docs.instacart.com/developer_platform_api/api/products/create_shopping_list_page), and [supported units](https://docs.instacart.com/developer_platform_api/api/units_of_measurement). Generated URLs are reused from a PostgreSQL cache keyed by the authenticated user and validated request; they are never cached in browser storage or shared across accounts. Instacart remains the authoritative conversion and payout source.

## 5. Deployment variables

Configure these in the hosting provider, then trigger a fresh production build:

| Variable | Visibility | Required for |
| --- | --- | --- |
| `VITE_AMAZON_ASSOCIATE_TAG` | Public | Amazon attribution |
| `VITE_WALMART_AFFILIATE_LINK_TEMPLATE` | Public | Walmart attribution |
| `INSTACART_API_KEY` | Secret, server only | Instacart page creation |
| `INSTACART_API_BASE_URL` | Server only | Development vs. production Instacart API |
| `TOKEN_ENCRYPTION_KEY` / `CSRF_SECRET` | Secret, server only | Authenticated same-origin shopping requests |

Never put the Instacart key in GitHub, client code, browser storage, screenshots, support messages, or a `VITE_` variable. Rotate it immediately if it is exposed.

## 6. Disclosure and compliance checklist

- Keep the affiliate disclosure adjacent to shopping controls and visible before a qualifying click.
- Keep the Amazon Associates statement visible whenever an Amazon tag is configured.
- Make the commercial relationship clear in every supported language.
- Do not promise prices, availability, delivery windows, commissions, or product matches controlled by a vendor.
- Do not copy products between retailer baskets or automate checkout through customer credentials.
- Re-check each program's terms before launch and whenever the program changes them.
- Confirm the site's privacy policy covers outbound referral links, third-party cookies/identifiers, and analytics actually used in production.

## 7. End-to-end acceptance test

1. Build and type-check the app.
2. Open a recipe and change servings; confirm the Instacart display quantities change.
3. Deselect two ingredients; confirm the generated Instacart page excludes them.
4. Confirm the Instacart user can select a store, review products, add them to the cart, and continue to checkout.
5. Confirm Amazon links carry the configured `tag` without losing their existing search parameters.
6. Confirm Walmart links use the real approved redirect and land on Walmart.
7. Confirm every shopping area shows the affiliate disclosure.
8. Check vendor dashboards for test clicks. A click is not a guaranteed commission; the vendor decides qualifying purchases, attribution windows, returns, exclusions, and payout timing.
9. Test with popup blocking enabled. The app should show a combined-search fallback for multi-tab retailers.
10. Test without Amazon and Walmart attribution configured; ordinary retailer links should still work. Test Instacart failures with a rejected/expired development key in an isolated environment; the UI should show a controlled error without exposing the key or crashing.
