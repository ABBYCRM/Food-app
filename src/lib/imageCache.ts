/**
 * Global image URL cache + dedupe.
 *
 * Pollinations.ai (and Unsplash) rate-limit aggressively when the same browser
 * fires many requests in a short window. This module:
 *
 *   1. Deduplicates in-flight requests — if two components ask for the same
 *      URL at the same time, the second waits for the first's promise.
 *   2. Caches the resolved URL (with a TTL) so a re-mount or page revisit
 *      doesn't re-fetch.
 *   3. Tracks failures so the next caller fails over to the fallback
 *      immediately instead of waiting for the same URL to time out.
 *
 * NOTE: The cache is per-page-load. We deliberately do NOT persist to
 * LocalStorage — the URLs include seeds/widths that may change, and a
 * stale cache would hide real failures.
 */

const inflight = new Map<string, Promise<boolean>>();
const failed = new Set<string>();
const TTL_MS = 30 * 60 * 1000; // 30 min in-memory TTL
const successCache = new Map<string, number>(); // url -> timestamp

function isFresh(ts: number) {
  return Date.now() - ts < TTL_MS;
}

/**
 * Returns true only for URLs we have actually seen fail.
 *
 * This is the predicate components should gate on. The distinction matters:
 * "not known to be good" is the state of every URL on a cold page load, so
 * treating that as a reason to skip the network means the real image is never
 * requested at all and every image renders as fallback art forever.
 */
export function imageHasFailed(url: string): boolean {
  return !!url && failed.has(url);
}

/**
 * Returns true if the URL has recently loaded successfully. Unknown URLs
 * return false — use `imageHasFailed` to decide whether to skip a load.
 */
export function imageIsLikelyGood(url: string): boolean {
  if (!url) return false;
  if (failed.has(url)) return false;
  const ts = successCache.get(url);
  if (ts && isFresh(ts)) return true;
  if (inflight.has(url)) return true;
  return false;
}

/**
 * Mark an image as successfully loaded. Components call this from the
 * `<img onLoad>` handler.
 */
export function markImageLoaded(url: string) {
  if (!url) return;
  successCache.set(url, Date.now());
  inflight.delete(url);
  failed.delete(url);
}

/**
 * Mark an image as failed. Components call this from the `<img onError>`
 * handler.
 */
export function markImageFailed(url: string) {
  if (!url) return;
  inflight.delete(url);
  failed.add(url);
  successCache.delete(url);
}

/**
 * For tests / debugging: how many URLs are tracked.
 */
export function _imageCacheStats() {
  return {
    success: successCache.size,
    failed: failed.size,
    inflight: inflight.size,
  };
}
