import { useState, type ImgHTMLAttributes } from "react";

const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
       <defs>
         <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
           <stop offset="0" stop-color="#3a2c20"/>
           <stop offset="1" stop-color="#7a1f1a"/>
         </linearGradient>
       </defs>
       <rect width="800" height="600" fill="url(#g)"/>
       <text x="50%" y="50%" font-family="Georgia,serif" font-size="48" font-weight="600"
             fill="#f5e7d3" text-anchor="middle" dominant-baseline="middle" opacity="0.85">
         Mestizo Umami
       </text>
     </svg>`
  );

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
  const showSrc = errored || !src ? FALLBACK : src;
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

