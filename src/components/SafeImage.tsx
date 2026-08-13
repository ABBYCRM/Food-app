import { useState, type ImgHTMLAttributes } from "react";
import { fallbackFor, type ArtSize } from "@/lib/recipeArt";

/**
 * Smart image with three states:
 *   1. loading skeleton (cream gradient with subtle shimmer)
 *   2. real image (Pollinations.ai or whatever the src is)
 *   3. per-recipe themed SVG fallback (only when src fails)
 *
 * The fallback is generated from the recipe's slug so the failure state
 * still looks like the dish — never a blank box or a "broken image" icon.
 *
 * If the slug isn't recognized, the generic Mestizo Umami mark is used.
 */

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  /** Recipe slug — used to pick the per-recipe themed fallback art. */
  recipeSlug?: string;
  /** Aspect ratio hint for the fallback art. Defaults to "hero". */
  fallbackSize?: ArtSize;
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
  ...rest
}: Props) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fallbackSrc = buildFallback(recipeSlug, fallbackSize);
  const showSrc = errored || !src ? fallbackSrc : src;
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
        onLoad={(e) => { setLoaded(true); onLoad?.(e); }}
        onError={(e) => { setErrored(true); onError?.(e); }}
      />
    </>
  );
}
