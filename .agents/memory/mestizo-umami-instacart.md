---
name: Mestizo Umami Instacart integration
description: Provider limitations and tenant-isolation rules for shopping through Composio
---

Composio's Instacart toolkit is `NO_AUTH`: it creates Instacart-hosted shopping experiences but does not connect or retain each shopper's private Instacart account.

**Why:** The shopper signs in or chooses a retailer on the generated Instacart page. Pretending the app has a private per-user Instacart OAuth token would misstate the provider capability.

**How to apply:** Derive every Composio user ID from the authenticated Mestizo session, keep link caching scoped to that user, never accept provider identity from the browser, and allow navigation only to HTTPS hosts owned by Instacart (`instacart.com` or `instacart.tools` subdomains).

The product direction is to communicate this no-auth link flow plainly instead of showing a fictitious connected-account control.

**Why:** The product owner approved adapting to the capability Composio actually provides, while keeping account credentials exclusively on Instacart.

**How to apply:** Tell signed-in shoppers that they will be taken to Instacart to sign in with their own account; provide an actionable availability state for provider outages rather than an account-connection error.