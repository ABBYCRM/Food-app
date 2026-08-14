# SEO, answer-engine, and ChatGPT Search setup

No legitimate implementation can guarantee a ranking in ChatGPT, Google, or Bing. This app supplies the crawl, indexing, entity, and content signals those systems can actually consume without keyword stuffing, hidden text, fabricated reviews, or robotic page copy.

## What is generated

- `robots.txt` explicitly allows `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, Googlebot, Bingbot, and other crawlers on public paths while excluding API and private account routes.
- `sitemap.xml` includes every canonical public page and all 365 stable recipe URLs.
- `llms.txt` gives answer engines a concise, factual site map and explains access/affiliate boundaries.
- Every public request receives a canonical URL, natural title/description, Open Graph/Twitter card, large image preview directive, and consistent organization/website entity data.
- Recipe URLs receive accurate Recipe JSON-LD built from the same title, description, ingredients, steps, servings, timing, cuisine, category, and dietary data rendered by the app.
- Private planner, notebook, billing, unknown, and API routes are `noindex,nofollow`.
- Fake ratings, review counts, health claims, prices, and dates are deliberately absent.
- A build-time generator verifies exactly 365 unique recipe slugs before the deployment can succeed.

OpenAI's official crawler documentation says `OAI-SearchBot` is the crawler used to surface sites in ChatGPT Search and can be allowed independently from `GPTBot`: [OpenAI crawler overview](https://developers.openai.com/api/docs/bots).

## Launch sequence

1. Put the final custom HTTPS domain on DigitalOcean before launch.
2. Set `PUBLIC_BASE_URL` to DigitalOcean's `${APP_URL}` binding or the final canonical origin.
3. Deploy, then verify these return 200 without authentication:
   - `/robots.txt`
   - `/sitemap.xml`
   - `/llms.txt`
   - `/recipe/kimchi-elote`
4. View the recipe page source and confirm its canonical link and `application/ld+json` block use the production domain.
5. Fetch `robots.txt` as OAI-SearchBot and verify public paths are allowed. Firewall/CDN rules must also allow OpenAI's published crawler IP ranges.
6. Submit `/sitemap.xml` to Google Search Console and Bing Webmaster Tools.
7. Use Google's Rich Results Test and Schema Markup Validator on representative handcrafted and generated recipes.
8. Request indexing for the home page, `/recipes`, `/pantry`, `/philosophy`, and the strongest handcrafted recipe pages first.
9. Keep the domain, canonical scheme, redirects, titles, and recipe slugs stable.
10. Monitor server access logs and webmaster tools for crawl failures, 5xx responses, duplicate canonicals, blocked images, or schema errors.

OpenAI notes that crawler-control changes can take roughly 24 hours to propagate. Crawl permission enables eligibility; it is not a promise of inclusion or rank.

## Content strategy that preserves the design

- Keep titles specific to the dish and intent: dish name, recipe, and brand.
- Let recipe stories explain the real flavor bridge—fermentation, chile, smoke, masa, miso, soy, sesame, or acid—in natural language.
- Build editorial links from pantry/philosophy pages into the strongest recipes and back to related dishes.
- Add only genuinely tested substitutions, technique notes, images, and answers. Do not create near-duplicate city/ingredient pages.
- Earn relevant mentions and links from chefs, food writers, culinary schools, ingredient makers, and approved affiliate partners.
- Refresh factual material when retailer APIs, allergy information, or partner terms change; do not manufacture a `dateModified` value merely to look fresh.
- Measure impressions, indexed pages, branded queries, recipe queries, referral conversions, and subscription conversion separately.

## Technical verification

```bash
npm run seo:generate
npm run build
npm test -- server/seo.test.js
```

The server injects metadata into built HTML rather than relying only on client-side head changes. The CSP grants a request-specific nonce to JSON-LD while leaving executable inline scripts blocked.

