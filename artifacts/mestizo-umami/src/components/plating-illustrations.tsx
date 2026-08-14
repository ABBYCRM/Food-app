/**
 * Simple black-and-white instructional SVG illustrations for plating guides.
 * ILLUSTRATIONS stores only the inner SVG children (ReactNode).
 * Use renderIllustration(id, size) to get a complete <svg> element.
 */
import type { ReactNode } from "react";

export type IllustrationKey =
  | "egg-sunny" | "egg-overeasy" | "egg-poach"
  | "tortilla-base" | "taco-fold" | "bowl-build"
  | "ladle-pour" | "drizzle" | "crema-swirl"
  | "garnish-crumble" | "lime-squeeze" | "herb-scatter"
  | "spread-base" | "slice-protein" | "avocado-fan"
  | "sesame-top" | "broth-pour" | "layer-stack"
  | "plate-present" | "beans-spread";

/** Inner SVG children only — wrapped by renderIllustration() */
export const ILLUSTRATIONS: Record<IllustrationKey, ReactNode> = {

  "egg-sunny": <>
    <path d="M20 62 C14 46 26 30 42 38 C50 22 70 20 82 34 C92 44 90 62 80 72 C68 84 36 86 24 76 Z" />
    <circle cx="52" cy="55" r="16" />
    <circle cx="46" cy="49" r="3.5" fill="currentColor" stroke="none" />
    <ellipse cx="52" cy="80" rx="42" ry="10" strokeOpacity={0.3} strokeWidth={1.5} strokeDasharray="4 3" />
  </>,

  "egg-overeasy": <>
    <ellipse cx="50" cy="56" rx="36" ry="26" />
    <circle cx="52" cy="52" r="14" />
    <circle cx="46" cy="46" r="3" fill="currentColor" stroke="none" />
    <path d="M20 50 Q50 38 80 50" strokeDasharray="4 3" strokeOpacity={0.6} />
    <rect x="80" y="50" width="22" height="8" rx="2" transform="rotate(-42 91 54)" />
    <ellipse cx="50" cy="78" rx="42" ry="9" strokeOpacity={0.3} strokeWidth={1.5} strokeDasharray="4 3" />
  </>,

  "egg-poach": <>
    <ellipse cx="50" cy="68" rx="38" ry="12" strokeOpacity={0.4} />
    <ellipse cx="50" cy="68" rx="28" ry="8" strokeOpacity={0.3} />
    <path d="M28 58 C24 44 34 32 48 40 C56 28 72 30 78 44 C86 54 80 68 64 70 C46 72 30 70 28 58 Z" />
    <circle cx="54" cy="52" r="13" />
    <circle cx="48" cy="46" r="3" fill="currentColor" stroke="none" />
    <path d="M44 24 Q42 16 44 10" strokeWidth={1.5} strokeOpacity={0.5} />
    <path d="M54 20 Q56 12 54 6" strokeWidth={1.5} strokeOpacity={0.5} />
  </>,

  "tortilla-base": <>
    <ellipse cx="50" cy="72" rx="44" ry="14" strokeOpacity={0.4} />
    <ellipse cx="50" cy="60" rx="36" ry="22" />
    <path d="M38 52 Q44 56 42 62" strokeWidth={1.5} strokeOpacity={0.6} />
    <path d="M55 48 Q60 54 58 60" strokeWidth={1.5} strokeOpacity={0.6} />
    <path d="M62 58 Q64 64 60 68" strokeWidth={1.5} strokeOpacity={0.6} />
    <circle cx="44" cy="64" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="56" cy="66" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="42" cy="56" r="1.5" fill="currentColor" stroke="none" />
  </>,

  "taco-fold": <>
    <path d="M15 70 Q50 20 85 70 Z" />
    <path d="M15 70 Q50 68 85 70" />
    <path d="M30 52 Q50 40 70 52" strokeWidth={1.5} />
    <path d="M26 60 Q28 54 32 58 Q34 52 38 56 Q40 50 44 54" strokeWidth={1.5} />
    <path d="M56 54 Q60 50 64 54 Q66 48 70 52 Q72 46 76 50" strokeWidth={1.5} />
    <path d="M49 70 Q49 78 48 84" strokeWidth={1.5} strokeOpacity={0.5} />
  </>,

  "bowl-build": <>
    <path d="M10 42 Q10 82 50 86 Q90 82 90 42 Z" />
    <ellipse cx="50" cy="42" rx="40" ry="10" />
    <ellipse cx="50" cy="44" rx="36" ry="8" strokeOpacity={0.3} fill="currentColor" fillOpacity={0.04} />
    <path d="M30 38 Q50 30 70 38" strokeWidth={1.5} />
    <path d="M28 42 Q50 34 72 42" strokeWidth={1.5} />
    <ellipse cx="36" cy="32" rx="10" ry="8" />
    <circle cx="36" cy="32" r="4" />
    <circle cx="64" cy="30" r="3" fill="currentColor" stroke="none" />
    <circle cx="70" cy="28" r="2" fill="currentColor" stroke="none" />
    <circle cx="58" cy="28" r="2" fill="currentColor" stroke="none" />
  </>,

  "ladle-pour": <>
    <path d="M72 8 Q68 24 58 32" strokeWidth={2.5} />
    <ellipse cx="50" cy="38" rx="16" ry="12" />
    <path d="M44 50 Q42 60 40 72 Q39 76 42 78" strokeWidth={2} />
    <path d="M48 50 Q46 60 44 72" strokeWidth={1.5} strokeOpacity={0.5} />
    <ellipse cx="44" cy="80" rx="18" ry="6" strokeOpacity={0.5} fill="currentColor" fillOpacity={0.06} />
  </>,

  "drizzle": <>
    <ellipse cx="50" cy="72" rx="42" ry="14" strokeOpacity={0.35} />
    <ellipse cx="50" cy="60" rx="24" ry="18" strokeOpacity={0.5} />
    <path d="M68 10 L66 22 L70 22 Z" fill="currentColor" stroke="none" />
    <path d="M68 22 Q78 36 56 50 Q38 62 54 76" strokeWidth={2} />
    <circle cx="58" cy="30" r="2" fill="currentColor" stroke="none" />
    <circle cx="46" cy="50" r="1.5" fill="currentColor" stroke="none" />
  </>,

  "crema-swirl": <>
    <ellipse cx="50" cy="72" rx="42" ry="13" strokeOpacity={0.35} />
    <ellipse cx="50" cy="60" rx="30" ry="20" strokeOpacity={0.5} />
    <path d="M50 44 Q62 44 62 56 Q62 68 50 68 Q38 68 38 58 Q38 52 46 50 Q54 48 54 56" strokeWidth={2.5} />
    <rect x="52" y="8" width="10" height="24" rx="5" />
    <path d="M55 32 L56 44" strokeWidth={1.5} />
  </>,

  "garnish-crumble": <>
    <path d="M34 16 Q28 10 24 20 Q20 30 28 34 L44 46 Q50 48 56 44 L66 36 Q70 30 64 24 Q60 20 56 26 L52 30 Q50 16 44 14 Q38 12 34 16 Z" />
    <circle cx="42" cy="58" r="3" fill="currentColor" stroke="none" />
    <circle cx="52" cy="64" r="2" fill="currentColor" stroke="none" />
    <circle cx="46" cy="70" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="58" cy="74" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="36" cy="66" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="62" cy="62" r="2" fill="currentColor" stroke="none" />
    <circle cx="48" cy="80" r="1.5" fill="currentColor" stroke="none" />
    <ellipse cx="50" cy="88" rx="36" ry="8" strokeOpacity={0.3} strokeWidth={1.5} />
  </>,

  "lime-squeeze": <>
    <circle cx="50" cy="34" r="28" />
    <line x1="50" y1="6" x2="50" y2="62" strokeWidth={1.5} strokeOpacity={0.6} />
    <line x1="22" y1="34" x2="78" y2="34" strokeWidth={1.5} strokeOpacity={0.6} />
    <line x1="30" y1="13" x2="70" y2="55" strokeWidth={1.5} strokeOpacity={0.4} />
    <line x1="70" y1="13" x2="30" y2="55" strokeWidth={1.5} strokeOpacity={0.4} />
    <path d="M38 68 Q36 76 38 80" strokeWidth={2} />
    <path d="M50 66 Q50 76 50 82" strokeWidth={2} />
    <path d="M62 68 Q64 76 62 80" strokeWidth={2} />
  </>,

  "herb-scatter": <>
    <ellipse cx="50" cy="65" rx="40" ry="26" strokeOpacity={0.35} />
    <path d="M30 50 Q34 42 38 50 Q34 56 30 50 Z" />
    <path d="M46 44 Q50 36 54 44 Q50 50 46 44 Z" />
    <path d="M62 48 Q66 40 70 48 Q66 54 62 48 Z" />
    <path d="M22 60 Q26 52 30 60 Q26 66 22 60 Z" />
    <path d="M68 60 Q72 52 76 60 Q72 66 68 60 Z" />
    <path d="M38 68 Q42 60 46 68 Q42 74 38 68 Z" />
    <path d="M54 66 Q58 58 62 66 Q58 72 54 66 Z" />
    <line x1="34" y1="50" x2="34" y2="56" strokeWidth={1} />
    <line x1="50" y1="44" x2="50" y2="50" strokeWidth={1} />
    <line x1="66" y1="48" x2="66" y2="54" strokeWidth={1} />
  </>,

  "spread-base": <>
    <ellipse cx="50" cy="68" rx="44" ry="20" />
    <path d="M16 60 Q30 52 50 54 Q70 52 80 58 Q72 68 50 70 Q28 72 16 60 Z" fill="currentColor" fillOpacity={0.12} />
    <path d="M16 60 Q30 52 50 54 Q70 52 80 58" strokeWidth={2} />
    <path d="M84 44 L78 58" strokeWidth={2.5} />
    <ellipse cx="76" cy="60" rx="8" ry="5" transform="rotate(-30 76 60)" />
  </>,

  "slice-protein": <>
    <path d="M20 52 Q20 34 36 30 Q52 26 64 34 Q76 40 76 52 Q76 68 60 72 Q40 76 28 68 Z" />
    <path d="M32 64 Q40 42 52 36" strokeWidth={1.5} strokeOpacity={0.5} />
    <path d="M42 68 Q50 46 62 38" strokeWidth={1.5} strokeOpacity={0.5} />
    <path d="M52 70 Q60 50 70 44" strokeWidth={1.5} strokeOpacity={0.5} />
    <path d="M20 52 Q20 34 36 30" strokeWidth={3} strokeOpacity={0.6} />
    <path d="M80 10 L90 80" strokeWidth={1.5} />
    <path d="M80 10 L86 12 Q92 80 90 80" strokeWidth={1.5} />
  </>,

  "avocado-fan": <>
    <path d="M50 80 Q30 60 36 34 Q42 18 50 18 Q58 18 64 34 Q70 60 50 80 Z" transform="rotate(-20 50 80)" />
    <path d="M50 80 Q30 60 36 34 Q42 18 50 18 Q58 18 64 34 Q70 60 50 80 Z" transform="rotate(-8 50 80)" />
    <path d="M50 80 Q30 60 36 34 Q42 18 50 18 Q58 18 64 34 Q70 60 50 80 Z" />
    <path d="M50 80 Q30 60 36 34 Q42 18 50 18 Q58 18 64 34 Q70 60 50 80 Z" transform="rotate(8 50 80)" />
    <path d="M50 80 Q30 60 36 34 Q42 18 50 18 Q58 18 64 34 Q70 60 50 80 Z" transform="rotate(20 50 80)" />
    <circle cx="50" cy="55" r="7" />
  </>,

  "sesame-top": <>
    <ellipse cx="50" cy="56" rx="38" ry="28" />
    {([
      [38, 46], [50, 40], [62, 44], [44, 54], [56, 52],
      [34, 58], [66, 56], [46, 64], [58, 62], [52, 70],
      [40, 68], [64, 66],
    ] as [number, number][]).map(([cx, cy], i) => (
      <ellipse key={i} cx={cx} cy={cy} rx="3" ry="2" transform={`rotate(${i * 28} ${cx} ${cy})`} fill="currentColor" stroke="none" />
    ))}
    <line x1="78" y1="16" x2="84" y2="40" strokeWidth={3} />
    <line x1="84" y1="16" x2="90" y2="40" strokeWidth={3} />
  </>,

  "broth-pour": <>
    <path d="M12 46 Q12 82 50 86 Q88 82 88 46 Z" />
    <ellipse cx="50" cy="46" rx="38" ry="10" />
    <path d="M60 6 Q72 14 68 28 Q64 36 56 38" strokeWidth={2.5} />
    <ellipse cx="50" cy="36" rx="18" ry="10" />
    <path d="M56 46 Q54 56 52 66" strokeWidth={2.5} />
    <circle cx="52" cy="60" r="6" strokeOpacity={0.4} strokeWidth={1.5} />
    <circle cx="52" cy="60" r="12" strokeOpacity={0.25} strokeWidth={1.5} />
  </>,

  "layer-stack": <>
    <ellipse cx="50" cy="78" rx="36" ry="10" />
    <ellipse cx="50" cy="60" rx="30" ry="8" />
    <path d="M20 60 L20 78" strokeWidth={1} strokeOpacity={0.3} />
    <path d="M80 60 L80 78" strokeWidth={1} strokeOpacity={0.3} />
    <ellipse cx="50" cy="44" rx="22" ry="6" />
    <path d="M28 44 L20 60" strokeWidth={1} strokeOpacity={0.3} />
    <path d="M72 44 L80 60" strokeWidth={1} strokeOpacity={0.3} />
    <path d="M50 10 L50 36" strokeOpacity={0.5} />
    <path d="M44 28 L50 36 L56 28" strokeOpacity={0.5} />
  </>,

  "plate-present": <>
    <circle cx="50" cy="52" r="42" />
    <circle cx="50" cy="52" r="34" strokeOpacity={0.4} />
    <ellipse cx="44" cy="48" rx="14" ry="10" transform="rotate(-15 44 48)" />
    <path d="M32 58 Q44 54 56 58 Q52 64 40 66 Z" fill="currentColor" fillOpacity={0.12} />
    <path d="M32 58 Q44 54 56 58 Q52 64 40 66 Z" />
    <circle cx="62" cy="44" r="3" fill="currentColor" stroke="none" />
    <circle cx="66" cy="50" r="2" fill="currentColor" stroke="none" />
    <circle cx="60" cy="52" r="2" fill="currentColor" stroke="none" />
  </>,

  "beans-spread": <>
    <ellipse cx="50" cy="60" rx="38" ry="26" />
    {([
      [36, 54], [46, 50], [58, 52], [64, 58],
      [40, 62], [52, 64], [62, 66], [34, 66],
    ] as [number, number][]).map(([cx, cy], i) => (
      <ellipse key={i} cx={cx} cy={cy} rx="5" ry="4" fill="currentColor" fillOpacity={0.18} />
    ))}
    <path d="M80 30 Q78 42 70 50" strokeWidth={2.5} />
    <ellipse cx="68" cy="52" rx="7" ry="5" transform="rotate(-40 68 52)" />
  </>,
};

/** Renders an illustration as a complete <svg> element at the requested size */
export function renderIllustration(id: IllustrationKey, size: number = 80): React.ReactElement {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      width={size}
      height={size}
      style={{ display: "block" }}
    >
      {ILLUSTRATIONS[id]}
    </svg>
  );
}

interface Props {
  id: IllustrationKey;
  size?: number;
  className?: string;
}

export function PlatingIllustration({ id, size = 80, className = "" }: Props) {
  return (
    <div className={className} style={{ width: size, height: size, flexShrink: 0 }}>
      {renderIllustration(id, size)}
    </div>
  );
}
