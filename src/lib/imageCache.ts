/**
 * Global image URL cache + dedupe.
 *
 * Tracks image failures for the current page load so repeated cards fail over
 * immediately instead of waiting on the same missing or corrupt local asset.
 */

const failed = new Set<string>();

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
 * Mark an image as successfully loaded. Components call this from the
 * `<img onLoad>` handler.
 */
export function markImageLoaded(url: string) {
  if (!url) return;
  failed.delete(url);
}

/**
 * Mark an image as failed. Components call this from the `<img onError>`
 * handler.
 */
export function markImageFailed(url: string) {
  if (!url) return;
  failed.add(url);
}

/**
 * For tests / debugging: how many URLs are tracked.
 */
export function _imageCacheStats() {
  return { failed: failed.size };
}
