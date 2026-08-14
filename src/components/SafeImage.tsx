import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { fallbackFor, type ArtSize } from "@/lib/recipeArt";
import { imageHasFailed, markImageFailed, markImageLoaded } from "@/lib/imageCache";

/**
 * Smart image with three states:
 *   1. loading skeleton (cream gradient)
 *   2. verified local image
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
   * If true, render the per-recipe fallback art as the primary image.
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
  const forceFallback = preferArt || !src || imageHasFailed(src);
  const sourceKey = `${src ?? ""}|${fallbackSrc}|${forceFallback}`;

  return (
    <SafeImageLoader
      key={sourceKey}
      {...rest}
      src={src}
      onError={onError}
      onLoad={onLoad}
      className={className}
      fallbackSrc={fallbackSrc}
      forceFallback={forceFallback}
      timeoutMs={timeoutMs}
    />
  );
}

type LoaderProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc: string;
  forceFallback: boolean;
  timeoutMs: number;
};

function SafeImageLoader({
  src,
  onError,
  onLoad,
  className,
  fallbackSrc,
  forceFallback,
  timeoutMs,
  ...rest
}: LoaderProps) {
  const [phase, setPhase] = useState<"loading" | "ready" | "fallback" | "failed">(
    forceFallback ? "fallback" : "loading",
  );
  const showSrc = phase === "fallback" || forceFallback || !src ? fallbackSrc : src;

  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    if (phase !== "loading") return;
    if (timeoutMs <= 0) return;
    timerRef.current = window.setTimeout(() => {
      setPhase("fallback");
      if (src) markImageFailed(src);
    }, timeoutMs);
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase, timeoutMs, src]);

  return (
    <>
      {phase === "loading" || phase === "failed" ? (
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
        style={{ ...rest.style, opacity: phase === "ready" || phase === "fallback" ? 1 : 0, transition: "opacity 320ms ease" }}
        onLoad={(e) => {
          if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          if (phase === "loading" && src) {
            markImageLoaded(src);
            setPhase("ready");
          } else if (phase === "fallback") {
            setPhase("fallback");
          }
          onLoad?.(e);
        }}
        onError={(e) => {
          if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          if (phase === "loading" && src) {
            markImageFailed(src);
            setPhase("fallback");
          } else {
            setPhase("failed");
          }
          onError?.(e);
        }}
      />
    </>
  );
}
