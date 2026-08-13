import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { fallbackFor, type ArtSize } from "@/lib/recipeArt";
import { imageHasFailed, markImageFailed, markImageLoaded } from "@/lib/imageCache";

/**
 * Smart image with three states:
 *   1. loading skeleton (cream gradient)
 *   2. real image (Pollinations.ai or whatever the src is)
 *   3. per-recipe themed SVG fallback (when src fails, times out, or
 *      is opted-out via preferArt)
 *
 * Reliability rules:
 *   - Timeout: if the image hasn't loaded in `timeoutMs`, fall back. Now that
 *     photography is vendored under public/img/ this is a backstop for a
 *     missing/corrupt file rather than the routine path it was when every
 *     src was a live image-generation request.
 *   - The fallback is generated from the recipe slug so the failure state
 *     still looks like the dish — never a blank box or a "broken image" icon.
 *   - The global image cache (imageCache.ts) blacklists URLs that fail
 *     once so we don't retry them on every component mount.
 */

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  /** Recipe slug — used to pick the per-recipe themed fallback art. */
  recipeSlug?: string;
  /** Aspect ratio hint for the fallback art. Defaults to "hero". */
  fallbackSize?: ArtSize;
  /**
   * If true, render the per-recipe fallback art as the primary image instead
   * of the network src. Use this on dense card grids to avoid hammering
   * image CDNs with concurrent requests (which triggers 429 rate-limits).
   * The real image will still load on the recipe detail page.
   */
  preferArt?: boolean;
  /**
   * Timeout for the real image load before falling back to the per-recipe
   * art. Defaults to 8s. Pass 0 to disable.
   */
  timeoutMs?: number;
};

function buildFallback(slug?: string, size: ArtSize = "hero"): string {
  if (slug) {
    try { return fallbackFor(slug, size); } catch { /* fall through */ }
  }
  return fallbackFor("__generic__", size);
}

const LOADING_BG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
       <defs>
         <linearGradient id="lg" x1="0" x2="1" y1="0" y2="1">
           <stop offset="0" stop-color="#d9c6a8"/>
           <stop offset="1" stop-color="#ebdfcc"/>
         </linearGradient>
       </defs>
       <rect width="800" height="600" fill="url(#lg)"/>
     </svg>`
  );

export function SafeImage({
  src,
  onError,
  onLoad,
  className,
  recipeSlug,
  fallbackSize = "hero",
  preferArt = false,
  timeoutMs = 8000,
  ...rest
}: Props) {
  const fallbackSrc = buildFallback(recipeSlug, fallbackSize);

  // Skip the load only for a URL we've actually seen fail — anything else gets
  // a real attempt. (This previously gated on "is known good", which is false
  // for every URL on a cold load, so no image was ever fetched.)
  const [knownBad] = useState(() => !!src && imageHasFailed(src));

  // If preferArt is set, force the per-recipe art (no network attempt).
  const forceFallback = preferArt || knownBad;
  const [errored, setErrored] = useState<boolean>(forceFallback);
  const [loaded, setLoaded] = useState(false);
  const showSrc = errored || !src ? fallbackSrc : src!;

  // Timeout: if the image hasn't loaded by `timeoutMs`, fail over to the
  // fallback. This catches the case where Pollinations is taking 30s
  // (which it does for cold-cache prompts) or returning a non-image.
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    if (forceFallback || loaded || errored) return;
    if (timeoutMs <= 0) return;
    timerRef.current = window.setTimeout(() => {
      setErrored(true);
      if (src) markImageFailed(src);
    }, timeoutMs);
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [forceFallback, loaded, errored, timeoutMs, src]);

  return (
    <>
      {!loaded && !errored ? (
        <img
          {...rest}
          src={LOADING_BG}
          alt=""
          aria-hidden="true"
          className={className}
        />
      ) : null}
      <img
        {...rest}
        src={showSrc}
        loading={rest.loading ?? "lazy"}
        decoding="async"
        referrerPolicy="no-referrer-when-downgrade"
        className={className}
        style={{ ...rest.style, opacity: loaded || errored ? 1 : 0, transition: "opacity 320ms ease" }}
        onLoad={(e) => {
          setLoaded(true);
          if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          if (src) markImageLoaded(src);
          onLoad?.(e);
        }}
        onError={(e) => {
          setErrored(true);
          if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          if (src) markImageFailed(src);
          onError?.(e);
        }}
      />
    </>
  );
}
