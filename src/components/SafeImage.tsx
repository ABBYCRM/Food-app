import { useEffect, useState, type ImgHTMLAttributes } from "react";

const FALLBACK = "/images/food-fallback.webp";

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

type Props = ImgHTMLAttributes<HTMLImageElement>;

/** Image with three states: loading skeleton (cream gradient), real image, or branded fallback. */
export function SafeImage({ src, onError, onLoad, className, ...rest }: Props) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setErrored(false);
    setLoaded(false);
  }, [src]);
  const showSrc = errored || !src ? FALLBACK : src;
  return (
    <img
      {...rest}
      src={showSrc}
      loading={rest.loading ?? "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      style={{
        backgroundColor: "#d9c6a8",
        backgroundImage: loaded ? undefined : `url("${LOADING_BG}")`,
        backgroundSize: "cover",
        ...rest.style,
        transition: "opacity 320ms ease",
      }}
      onLoad={(e) => { setLoaded(true); onLoad?.(e); }}
      onError={(e) => {
        if (!errored) setErrored(true);
        onError?.(e);
      }}
    />
  );
}
