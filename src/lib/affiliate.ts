export type AffiliateRetailer =
  | "amazon"
  | "amazonFresh"
  | "wholeFoods"
  | "instacart"
  | "walmart"
  | "diy";

export type AffiliateConfig = Readonly<{
  amazonAssociateTag?: string;
  walmartAffiliateLinkTemplate?: string;
}>;

export const AMAZON_ASSOCIATE_DISCLOSURE =
  "As an Amazon Associate I earn from qualifying purchases.";

export const affiliateConfig: AffiliateConfig = {
  amazonAssociateTag: import.meta.env.VITE_AMAZON_ASSOCIATE_TAG?.trim(),
  walmartAffiliateLinkTemplate:
    import.meta.env.VITE_WALMART_AFFILIATE_LINK_TEMPLATE?.trim(),
};

const AMAZON_RETAILERS = new Set<AffiliateRetailer>([
  "amazon",
  "amazonFresh",
  "wholeFoods",
]);

function isHttpsHost(url: URL, domain: string): boolean {
  return (
    url.protocol === "https:" &&
    (url.hostname === domain || url.hostname.endsWith(`.${domain}`))
  );
}

function validAmazonTag(value: string | undefined): value is string {
  if (!value || value.length > 100) return false;
  return !/[\s&?#]/.test(value);
}

export function isAmazonAffiliateConfigured(
  config: AffiliateConfig = affiliateConfig,
): boolean {
  return validAmazonTag(config.amazonAssociateTag?.trim());
}

/**
 * Adds only vendor-issued attribution. Instacart attribution is intentionally
 * absent here: approved IDP partners receive attributed URLs from the server API.
 */
export function applyAffiliateAttribution(
  retailer: AffiliateRetailer,
  destination: string,
  config: AffiliateConfig = affiliateConfig,
): string {
  if (AMAZON_RETAILERS.has(retailer)) {
    const tag = config.amazonAssociateTag?.trim();
    if (!validAmazonTag(tag)) return destination;

    try {
      const url = new URL(destination);
      if (!isHttpsHost(url, "amazon.com")) return destination;
      url.searchParams.set("tag", tag);
      return url.toString();
    } catch {
      return destination;
    }
  }

  if (retailer === "walmart") {
    const template = config.walmartAffiliateLinkTemplate?.trim();
    if (!template?.includes("{url}")) return destination;

    try {
      const destinationUrl = new URL(destination);
      if (!isHttpsHost(destinationUrl, "walmart.com")) return destination;

      const attributed = template
        .split("{url}")
        .join(encodeURIComponent(destinationUrl.toString()));
      const attributedUrl = new URL(attributed);
      return attributedUrl.protocol === "https:" ? attributedUrl.toString() : destination;
    } catch {
      return destination;
    }
  }

  return destination;
}

/** Records first-party click analytics without delaying or authorizing the
 * retailer navigation. Partner networks remain the source of truth for paid conversions. */
export function recordAffiliateClick(
  retailer: AffiliateRetailer,
  itemCount: number,
  csrfToken: string,
): void {
  if (!csrfToken || retailer === "diy" || retailer === "instacart") return;
  const amazon = AMAZON_RETAILERS.has(retailer);
  const payload = {
    vendor: amazon ? "amazon" : "walmart",
    destinationHost: amazon ? "www.amazon.com" : "www.walmart.com",
    itemCount: Math.max(1, Math.min(1_000, Math.floor(itemCount))),
  };
  void fetch("/api/affiliate/click", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    keepalive: true,
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Shopping navigation must not fail when optional first-party analytics is unavailable.
  });
}
