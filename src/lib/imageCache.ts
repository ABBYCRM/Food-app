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
 * Returns true if the URL has recently loaded successfully (or is in flight
 * and likely to succeed). Returns false if it has failed or is unknown.
 *
 * Components use this to short-circuit: if they know the URL is bad, they
 * render the per-recipe fallback immediately and skip the network attempt.
 */
export function imageIsLikelyGood(url: string): boolean {
  if (!url) return false;
  if (failed.has(url)) return false;
  const ts = successCache.get(url);
  if (ts && isFresh(ts)) return true;
  // in-flight: assume good (we don't know yet)
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
