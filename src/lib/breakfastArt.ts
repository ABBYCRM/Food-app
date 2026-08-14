/**
 * Format-category fallback art for the 365-day Asian-Mexican breakfast
 * collection (see src/data/breakfast.ts).
 *
 * There are far too many generated breakfast recipes to commission a unique
 * photograph for each one, and the previous attempt at solving that (vendored
 * "format" stock photos in public/img/formats/) shipped amateur, inconsistent
 * snapshots that were never even wired into the app — see git history. Real
 * per-dish photography isn't available in this environment, so instead every
 * generated recipe is deterministically mapped to one of the category
 * illustrations below, each hand-composed to depict that dish *format*
 * accurately (a congee recipe always gets a congee bowl, a tamale recipe
 * always gets a husk-wrapped tamale, etc.) — guaranteeing the image never
 * contradicts the recipe, in the brand's existing flat-vector style.
 *
 * Each composer is written in terms of the canvas width/height it's given,
 * so the same function produces a correctly-framed 4:3 hero, 1:1 thumb, and
 * 4:5 phone card without relying on CSS object-fit to crop a fixed canvas
 * (that's what caused the caption-clipping bug this file's sibling,
 * recipeArt.ts, had to fix). No captions are ever baked into the art.
 */

import { PALETTE, svg, encodeSvg } from "./recipeArt";
import type { ArtSize } from "./recipeArt";

export type BreakfastFormat =
  | "tacos"
  | "burrito"
  | "chilaquiles"
  | "tostada"
  | "huevos"
  | "tofu-scramble"
  | "congee"
  | "noodle-bowl"
  | "tamale"
  | "quesadilla"
  | "torta"
  | "rice-bowl"
  | "oats"
  | "pancake"
  | "dumpling"
  | "skewer"
  | "fruit-bowl"
  | "empanada"
  | "waffle"
  | "soup";

export const BREAKFAST_FORMATS: BreakfastFormat[] = [
  "tacos", "burrito", "chilaquiles", "tostada", "huevos", "tofu-scramble",
  "congee", "noodle-bowl", "tamale", "quesadilla", "torta", "rice-bowl",
  "oats", "pancake", "dumpling", "skewer", "fruit-bowl", "empanada",
  "waffle", "soup",
];

/* ---------------------------------------------------------------------- *
 * Primitives — small reusable brushstrokes, each positioned in absolute
 * canvas coordinates so composers can scale everything off one `s` factor.
 * ---------------------------------------------------------------------- */

function plate(cx: number, cy: number, rx: number, ry: number, rim: string, face: string) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${rim}"/>` +
    `<ellipse cx="${cx}" cy="${cy - ry * 0.06}" rx="${rx * 0.88}" ry="${ry * 0.82}" fill="${face}"/>`;
}

function bowl(cx: number, cy: number, rx: number, ry: number, rim: string, inner: string) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${rim}"/>` +
    `<ellipse cx="${cx}" cy="${cy - ry * 0.12}" rx="${rx * 0.86}" ry="${ry * 0.76}" fill="${inner}"/>`;
}

function tortilla(cx: number, cy: number, r: number, rot: number, color: string, shade: string) {
  return `<g transform="translate(${cx} ${cy}) rotate(${rot})">` +
    `<path d="M${-r} 0 Q${-r} ${-r * 0.62} 0 ${-r * 0.62} Q${r} ${-r * 0.62} ${r} 0 Q${r} ${r * 0.44} 0 ${r * 0.44} Q${-r} ${r * 0.44} ${-r} 0 Z" fill="${color}"/>` +
    `<path d="M${-r} 0 Q${-r} ${-r * 0.62} 0 ${-r * 0.62} Q${r} ${-r * 0.62} ${r} 0 Q${r} ${r * 0.44} 0 ${r * 0.44} Q${-r} ${r * 0.44} ${-r} 0 Z" fill="${shade}" opacity="0.16"/>` +
    `</g>`;
}

function friedEgg(cx: number, cy: number, r: number) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.72}" fill="${PALETTE.bone50}"/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.72}" fill="${PALETTE.cream}" opacity="0.5"/>` +
    `<circle cx="${cx + r * 0.12}" cy="${cy}" r="${r * 0.38}" fill="#f0a63a"/>` +
    `<circle cx="${cx + r * 0.02}" cy="${cy - r * 0.12}" r="${r * 0.12}" fill="#ffce6b" opacity="0.8"/>`;
}

function steam(cx: number, cy: number, h: number, color = PALETTE.bone50) {
  return [-1, 0, 1].map((i) => {
    const x = cx + i * h * 0.22;
    return `<path d="M${x} ${cy} Q${x + h * 0.12} ${cy - h * 0.4} ${x} ${cy - h * 0.7} Q${x - h * 0.12} ${cy - h} ${x} ${cy - h * 1.3}" stroke="${color}" stroke-width="${h * 0.04}" fill="none" opacity="0.55" stroke-linecap="round"/>`;
  }).join("");
}

function herb(cx: number, cy: number, s: number, color = PALETTE.jade) {
  return `<path d="M${cx - s} ${cy} q${-s * 0.5} ${-s * 0.7} ${-s} 0 q${s * 0.5} ${-s * 0.35} ${s} 0 z" fill="${color}" transform="rotate(${Math.random() * 60 - 30} ${cx} ${cy})"/>`;
}

function fleck(cx: number, cy: number, color: string, r = 2) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.8"/>`;
}

function seed(cx: number, cy: number, color = PALETTE.ink) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="2.4" ry="1.2" fill="${color}" opacity="0.85" transform="rotate(${Math.random() * 180} ${cx} ${cy})"/>`;
}

function scallionRing(cx: number, cy: number, r = 5) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${PALETTE.jade}" stroke-width="2"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r * 0.4}" fill="${PALETTE.jade}" opacity="0.5"/>`;
}

function scatter<T>(n: number, cx: number, cy: number, rx: number, ry: number, fn: (x: number, y: number) => T): T[] {
  return Array.from({ length: n }, () => {
    const x = cx + (Math.random() * 2 - 1) * rx;
    const y = cy + (Math.random() * 2 - 1) * ry;
    return fn(x, y);
  });
}

function drizzle(cx: number, cy: number, w: number, color: string) {
  return `<path d="M${cx - w} ${cy} Q${cx - w * 0.4} ${cy - w * 0.22} ${cx} ${cy} Q${cx + w * 0.4} ${cy + w * 0.22} ${cx + w} ${cy}" stroke="${color}" stroke-width="3" fill="none" opacity="0.85" stroke-linecap="round"/>`;
}

/* ---------------------------------------------------------------------- *
 * Category composers — each takes the target canvas size and returns the
 * inner SVG markup (background through garnish), scaled off `s`.
 * ---------------------------------------------------------------------- */

type Composer = (w: number, h: number) => string;

const COMPOSERS: Record<BreakfastFormat, Composer> = {
  tacos: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.56;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.ink}"/>` +
      plate(cx, cy, w * 0.6, h * 0.32, "#1a1208", "#241810") +
      [-1, 0, 1].map((i) => {
        const x = cx + i * 130 * s, rot = i === 0 ? -6 : i * -14;
        return `<g transform="translate(${x} ${cy - 20 * s}) rotate(${rot}) scale(${s})">` +
          tortilla(0, 0, 95, 0, PALETTE.corn, PALETTE.cornDeep) +
          `<ellipse cx="0" cy="-14" rx="70" ry="26" fill="${PALETTE.bone50}"/>` +
          `<ellipse cx="-14" cy="-18" rx="30" ry="12" fill="#f0a63a"/>` +
          scatter(3, 0, -30, 40, 6, (x2, y2) => herb(x2, y2, 6)).join("") +
          scatter(6, 0, -12, 45, 8, (x2, y2) => seed(x2, y2)).join("") +
          `</g>`;
      }).join("");
  },

  burrito: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.54;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.bone}"/>` +
      plate(cx, cy, w * 0.6, h * 0.32, PALETTE.bone200, PALETTE.cream) +
      `<g transform="translate(${cx} ${cy}) scale(${s})">` +
      `<rect x="-170" y="-70" width="340" height="140" rx="68" fill="${PALETTE.bone50}"/>` +
      `<rect x="-170" y="-70" width="340" height="140" rx="68" fill="#f5e7d3" opacity="0.5"/>` +
      `<path d="M-140 -40 Q0 -30 140 -40 Q140 10 0 34 Q-140 10 -140 -40 Z" fill="${PALETTE.chiliDeep}"/>` +
      `<path d="M-140 -40 Q0 -52 140 -40 Q140 -18 0 -6 Q-140 -18 -140 -40 Z" fill="${PALETTE.chili}" opacity="0.9"/>` +
      scatter(10, 0, 0, 110, 20, (x2, y2) => fleck(x2, y2, PALETTE.corn, 4)).join("") +
      scatter(6, 0, 4, 110, 18, (x2, y2) => herb(x2, y2, 8)).join("") +
      scatter(6, 0, -30, 100, 8, (x2, y2) => fleck(x2, y2, PALETTE.cream, 3)).join("") +
      `<path d="M-170 -40 Q-185 0 -170 40" stroke="${PALETTE.cornDeep}" stroke-width="5" fill="none" opacity="0.4"/>` +
      `<path d="M170 -40 Q185 0 170 40" stroke="${PALETTE.cornDeep}" stroke-width="5" fill="none" opacity="0.4"/>` +
      `</g>`;
  },

  chilaquiles: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.55;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.ink}"/>` +
      plate(cx, cy, w * 0.6, h * 0.32, "#1a1208", "#2a1a0d") +
      `<g transform="translate(${cx} ${cy}) scale(${s})">` +
      `<ellipse cx="0" cy="0" rx="200" ry="80" fill="${PALETTE.chili}" opacity="0.88"/>` +
      scatter(22, 0, -8, 180, 55, (x2, y2, i = 0) =>
        `<polygon points="${x2},${y2} ${x2 + 22},${y2 - 8} ${x2 + 10},${y2 + 14}" fill="${PALETTE.corn}" opacity="0.9" transform="rotate(${Math.random() * 40 - 20} ${x2} ${y2})"/>`
      ).join("") +
      friedEgg(-30, -46, 46) +
      scatter(4, 40, -30, 60, 20, (x2, y2) => fleck(x2, y2, PALETTE.cream, 6)).join("") +
      scatter(4, -10, 30, 70, 20, (x2, y2) => herb(x2, y2, 7)).join("") +
      `</g>`;
  },

  tostada: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.54;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.bone}"/>` +
      plate(cx, cy, w * 0.6, h * 0.32, PALETTE.bone200, PALETTE.cream) +
      `<g transform="translate(${cx} ${cy}) scale(${s})">` +
      `<circle cx="0" cy="0" r="150" fill="${PALETTE.corn}"/>` +
      `<circle cx="0" cy="0" r="150" fill="${PALETTE.cornDeep}" opacity="0.14"/>` +
      `<circle cx="0" cy="-6" r="120" fill="${PALETTE.jade}" opacity="0.28"/>` +
      scatter(10, 0, -6, 100, 60, (x2, y2) => fleck(x2, y2, PALETTE.chili, 5)).join("") +
      scatter(8, 0, -10, 90, 50, (x2, y2) => fleck(x2, y2, PALETTE.cream, 4)).join("") +
      scatter(6, 0, 0, 100, 50, (x2, y2) => herb(x2, y2, 8)).join("") +
      `</g>`;
  },

  huevos: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.54;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.bone}"/>` +
      plate(cx, cy, w * 0.6, h * 0.32, PALETTE.bone200, PALETTE.cream) +
      `<g transform="translate(${cx} ${cy}) scale(${s})">` +
      tortilla(-60, 40, 90, -10, PALETTE.corn, PALETTE.cornDeep) +
      `<ellipse cx="60" cy="10" rx="130" ry="46" fill="${PALETTE.chili}" opacity="0.85"/>` +
      friedEgg(20, -20, 56) +
      scatter(10, 0, 40, 130, 24, (x2, y2) => fleck(x2, y2, PALETTE.chiliDeep, 3)).join("") +
      scatter(4, -10, 40, 60, 16, (x2, y2) => herb(x2, y2, 7)).join("") +
      `</g>`;
  },

  "tofu-scramble": (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.54;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.bone}"/>` +
      bowl(cx, cy, w * 0.56, h * 0.34, PALETTE.bone200, "#faf1de") +
      `<g transform="translate(${cx} ${cy - 10}) scale(${s})">` +
      scatter(24, 0, 0, 150, 48, (x2, y2) =>
        `<rect x="${x2 - 20}" y="${y2 - 15}" width="40" height="30" rx="5" fill="#f0c860" transform="rotate(${Math.random() * 20 - 10} ${x2} ${y2})"/>` +
        `<rect x="${x2 - 20}" y="${y2 - 15}" width="40" height="30" rx="5" fill="#c69534" opacity="0.18" transform="rotate(${Math.random() * 20 - 10} ${x2} ${y2})"/>`
      ).join("") +
      scatter(16, 0, -10, 150, 42, (x2, y2) => `<circle cx="${x2}" cy="${y2}" r="7" fill="#e8546b"/>`).join("") +
      scatter(10, 0, 14, 140, 42, (x2, y2) => herb(x2, y2, 9)).join("") +
      scatter(10, 0, 0, 150, 46, (x2, y2) => fleck(x2, y2, PALETTE.chili, 3)).join("") +
      `</g>`;
  },

  congee: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.54;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.bone}"/>` +
      bowl(cx, cy, w * 0.56, h * 0.34, PALETTE.bone200, PALETTE.cream) +
      `<g transform="translate(${cx} ${cy - 6}) scale(${s})">` +
      `<ellipse cx="0" cy="0" rx="230" ry="72" fill="#f5e7c5"/>` +
      scatter(60, 0, 0, 210, 55, (x2, y2) => fleck(x2, y2, PALETTE.bone50, 2)).join("") +
      `<g transform="translate(-90 -12)">${scallionRing(0, 0)}</g>` +
      `<g transform="translate(-60 6)">${scallionRing(0, 0, 4)}</g>` +
      scatter(8, 40, -8, 90, 20, (x2, y2) => fleck(x2, y2, PALETTE.chili, 3)).join("") +
      `</g>` +
      steam(cx, cy - h * 0.24, h * 0.16);
  },

  "noodle-bowl": (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.55;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.ink}"/>` +
      bowl(cx, cy, w * 0.56, h * 0.34, "#241810", PALETTE.cream) +
      `<g transform="translate(${cx} ${cy - 4}) scale(${s})">` +
      `<ellipse cx="0" cy="0" rx="220" ry="66" fill="#f5c14a" opacity="0.35"/>` +
      `<g stroke="${PALETTE.corn}" stroke-width="4" fill="none" opacity="0.85">` +
      Array.from({ length: 7 }, (_, i) => {
        const x = -180 + i * 60;
        return `<path d="M${x} -16 Q${x + 30} 4 ${x} 24"/>`;
      }).join("") +
      `</g>` +
      friedEgg(-100, -30, 40) +
      scatter(6, 60, -10, 100, 20, (x2, y2) => herb(x2, y2, 7)).join("") +
      scatter(10, 0, 20, 160, 20, (x2, y2) => seed(x2, y2, PALETTE.bone)).join("") +
      `</g>` +
      steam(cx, cy - h * 0.26, h * 0.16);
  },

  tamale: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.54;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.bone}"/>` +
      plate(cx, cy, w * 0.6, h * 0.32, PALETTE.bone200, PALETTE.cream) +
      [-1, 0, 1].map((i) => {
        const x = cx + i * 150 * s, rot = i * 6;
        return `<g transform="translate(${x} ${cy - 10 * s}) rotate(${rot}) scale(${s})">` +
          `<path d="M-40 -110 L40 -110 L60 100 L-60 100 Z" fill="${PALETTE.cornSoft}"/>` +
          `<path d="M-40 -110 L40 -110 L44 -70 L-44 -70 Z" fill="${PALETTE.corn}" opacity="0.5"/>` +
          `<path d="M-44 -70 L44 -70 L52 30 L-52 30 Z" fill="${PALETTE.cornDeep}" opacity="0.25"/>` +
          `<path d="M-40 -110 Q0 -130 40 -110" stroke="${PALETTE.cornDeep}" stroke-width="5" fill="none" opacity="0.6"/>` +
          `<path d="M-58 90 Q0 108 58 90" stroke="${PALETTE.cornDeep}" stroke-width="5" fill="none" opacity="0.6"/>` +
          `</g>`;
      }).join("");
  },

  quesadilla: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.55;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.ink}"/>` +
      plate(cx, cy, w * 0.6, h * 0.32, "#1a1208", "#241810") +
      [-1, 1].map((i) => {
        const x = cx + i * 100 * s;
        return `<g transform="translate(${x} ${cy}) rotate(${i * -10}) scale(${s})">` +
          `<path d="M0 -100 A100 100 0 0 1 0 100 Z" fill="${PALETTE.corn}"/>` +
          `<path d="M0 -100 A100 100 0 0 1 0 100 Z" fill="${PALETTE.cornDeep}" opacity="0.15"/>` +
          `<path d="M8 -70 A72 72 0 0 1 8 70" fill="#f0a63a" opacity="0.85"/>` +
          scatter(3, 30, 0, 30, 40, (x2, y2) => herb(x2, y2, 6)).join("") +
          `</g>`;
      }).join("");
  },

  torta: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.54;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.bone}"/>` +
      plate(cx, cy, w * 0.6, h * 0.32, PALETTE.bone200, PALETTE.cream) +
      `<g transform="translate(${cx} ${cy}) scale(${s})">` +
      `<rect x="-160" y="40" width="320" height="34" rx="16" fill="${PALETTE.cream}"/>` +
      `<rect x="-150" y="4" width="300" height="36" rx="6" fill="${PALETTE.chiliDeep}"/>` +
      `<rect x="-150" y="-22" width="300" height="26" rx="6" fill="#f0a63a" opacity="0.9"/>` +
      scatter(6, 0, -10, 130, 6, (x2, y2) => herb(x2, y2, 6)).join("") +
      `<rect x="-160" y="-70" width="320" height="46" rx="20" fill="${PALETTE.bone50}"/>` +
      scatter(20, 0, -70, 140, 8, (x2, y2) => seed(x2, y2)).join("") +
      `</g>`;
  },

  "rice-bowl": (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.54;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.bone}"/>` +
      bowl(cx, cy, w * 0.56, h * 0.34, PALETTE.bone200, PALETTE.cream) +
      `<g transform="translate(${cx} ${cy - 6}) scale(${s})">` +
      `<ellipse cx="-70" cy="10" rx="110" ry="46" fill="${PALETTE.bone50}"/>` +
      scatter(30, -70, 6, 90, 34, (x2, y2) => fleck(x2, y2, "#e9dcc4", 2)).join("") +
      `<ellipse cx="70" cy="-6" rx="110" ry="40" fill="${PALETTE.chili}" opacity="0.8"/>` +
      friedEgg(0, -30, 44) +
      scatter(6, 40, 20, 70, 16, (x2, y2) => herb(x2, y2, 7)).join("") +
      scatter(8, 0, 10, 150, 30, (x2, y2) => seed(x2, y2)).join("") +
      `</g>`;
  },

  oats: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.54;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.bone}"/>` +
      bowl(cx, cy, w * 0.56, h * 0.34, PALETTE.bone200, "#faf1de") +
      `<g transform="translate(${cx} ${cy - 4}) scale(${s})">` +
      `<ellipse cx="0" cy="0" rx="230" ry="72" fill="#e2cfa0"/>` +
      Array.from({ length: 5 }, (_, i) => `<ellipse cx="${-90 + i * 46}" cy="-30" rx="20" ry="12" fill="#f0dca8" stroke="#c69534" stroke-width="2"/>`).join("") +
      scatter(4, -70, 6, 30, 10, (x2, y2) => `<circle cx="${x2}" cy="${y2}" r="15" fill="#e8546b"/>`).join("") +
      scatter(4, -30, 14, 24, 8, (x2, y2) => `<circle cx="${x2}" cy="${y2}" r="13" fill="#7a1f1a"/>`).join("") +
      scatter(6, 70, 8, 60, 14, (x2, y2) => `<circle cx="${x2}" cy="${y2}" r="12" fill="#8a4513" opacity="0.75"/>`).join("") +
      scatter(10, 0, 20, 180, 24, (x2, y2) => fleck(x2, y2, PALETTE.cornDeep, 3)).join("") +
      drizzle(-10, -46, 80, "#8a4513") +
      `</g>`;
  },

  pancake: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.55;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.bone}"/>` +
      plate(cx, cy, w * 0.6, h * 0.32, PALETTE.bone200, PALETTE.cream) +
      `<g transform="translate(${cx} ${cy}) scale(${s})">` +
      [0, 1, 2].map((i) => `<ellipse cx="0" cy="${20 - i * 24}" rx="${140 - i * 6}" ry="30" fill="${i === 2 ? "#f0a63a" : PALETTE.cornSoft}"/>`).join("") +
      `<path d="M-120 -46 Q0 -60 120 -46 Q60 -30 0 -34 Q-60 -30 -120 -46 Z" fill="#7a3508" opacity="0.5"/>` +
      scatter(6, 0, -50, 90, 10, (x2, y2) => fleck(x2, y2, PALETTE.jade, 3)).join("") +
      `</g>`;
  },

  dumpling: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.55;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.ink}"/>` +
      `<ellipse cx="${cx}" cy="${cy + h * 0.1}" rx="${w * 0.36}" ry="${h * 0.06}" fill="#0d0805"/>` +
      Array.from({ length: 5 }, (_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        const x = cx + Math.cos(angle) * 140 * s, y = cy + Math.sin(angle) * 50 * s;
        return `<g transform="translate(${x} ${y}) scale(${s})">` +
          `<path d="M-40 10 Q-40 -30 0 -34 Q40 -30 40 10 Q20 0 0 4 Q-20 0 -40 10 Z" fill="${PALETTE.bone50}"/>` +
          `<path d="M-40 10 Q-20 0 0 4 Q20 0 40 10" stroke="${PALETTE.bone200}" stroke-width="2" fill="none" opacity="0.6"/>` +
          `</g>`;
      }).join("") +
      steam(cx, cy - h * 0.22, h * 0.16);
  },

  skewer: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.54;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.ink}"/>` +
      plate(cx, cy, w * 0.6, h * 0.32, "#1a1208", "#241810") +
      [-1, 0, 1].map((i) => {
        const x = cx + i * 90 * s;
        return `<g transform="translate(${x} ${cy}) scale(${s})">` +
          `<line x1="-160" y1="0" x2="160" y2="0" stroke="#c9a86a" stroke-width="6"/>` +
          [0, 1, 2, 3].map((k) => `<rect x="${-120 + k * 80}" y="-26" width="60" height="52" rx="10" fill="#5a1f0c"/>`).join("") +
          `</g>`;
      }).join("") +
      scatter(10, cx, cy + 20, w * 0.3, 14, (x2, y2) => herb(x2, y2, 7));
  },

  "fruit-bowl": (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.54;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.bone}"/>` +
      bowl(cx, cy, w * 0.56, h * 0.34, PALETTE.bone200, PALETTE.cream) +
      `<g transform="translate(${cx} ${cy - 6}) scale(${s})">` +
      `<circle cx="-70" cy="-6" r="60" fill="#e8546b"/>` +
      `<circle cx="10" cy="10" r="54" fill="#f5c14a"/>` +
      `<circle cx="80" cy="-14" r="46" fill="${PALETTE.jade}"/>` +
      scatter(20, 0, 0, 150, 40, (x2, y2) => fleck(x2, y2, "#3a2c20", 2)).join("") +
      scatter(4, 0, 30, 100, 10, (x2, y2) => herb(x2, y2, 8)).join("") +
      `</g>`;
  },

  empanada: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.55;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.bone}"/>` +
      plate(cx, cy, w * 0.6, h * 0.32, PALETTE.bone200, PALETTE.cream) +
      [-1, 0, 1].map((i) => {
        const x = cx + i * 130 * s, rot = i * -8;
        return `<g transform="translate(${x} ${cy}) rotate(${rot}) scale(${s})">` +
          `<path d="M-90 0 Q-90 -80 0 -80 Q90 -80 90 0 Q90 40 0 40 Q-90 40 -90 0 Z" fill="#f0c274"/>` +
          `<path d="M-90 0 Q0 40 90 0" stroke="#c69534" stroke-width="6" fill="none" opacity="0.7"/>` +
          Array.from({ length: 6 }, (_, k) => `<path d="M${-75 + k * 26} 14 q6 -10 12 0" stroke="#c69534" stroke-width="3" fill="none"/>`).join("") +
          `</g>`;
      }).join("");
  },

  waffle: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.55;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.bone}"/>` +
      plate(cx, cy, w * 0.6, h * 0.32, PALETTE.bone200, PALETTE.cream) +
      `<g transform="translate(${cx} ${cy}) scale(${s})">` +
      `<rect x="-150" y="-100" width="300" height="200" rx="24" fill="#e8b14a"/>` +
      Array.from({ length: 5 }, (_, i) => `<line x1="${-150 + i * 75}" y1="-100" x2="${-150 + i * 75}" y2="100" stroke="#c69534" stroke-width="6"/>`).join("") +
      Array.from({ length: 5 }, (_, i) => `<line x1="-150" y1="${-100 + i * 50}" x2="150" y2="${-100 + i * 50}" stroke="#c69534" stroke-width="6"/>`).join("") +
      scatter(6, 0, -60, 100, 14, (x2, y2) => `<circle cx="${x2}" cy="${y2}" r="10" fill="#e8546b"/>`).join("") +
      drizzle(0, 0, 90, "#8a4513") +
      `</g>`;
  },

  soup: (w, h) => {
    const s = Math.min(w, h) / 300;
    const cx = w / 2, cy = h * 0.55;
    return `<rect width="${w}" height="${h}" fill="${PALETTE.ink}"/>` +
      bowl(cx, cy, w * 0.56, h * 0.34, "#1a1208", PALETTE.cream) +
      `<g transform="translate(${cx} ${cy - 4}) scale(${s})">` +
      `<ellipse cx="0" cy="0" rx="220" ry="64" fill="#c0402c" opacity="0.85"/>` +
      scatter(6, -60, -10, 60, 20, (x2, y2) => `<rect x="${x2 - 24}" y="${y2 - 14}" width="48" height="28" rx="4" fill="#8a2a1c"/>`).join("") +
      scatter(10, 40, 6, 100, 24, (x2, y2) => fleck(x2, y2, PALETTE.corn, 3)).join("") +
      scatter(6, 0, -6, 150, 20, (x2, y2) => herb(x2, y2, 7)).join("") +
      `</g>` +
      steam(cx, cy - h * 0.26, h * 0.16);
  },
};

const SIZES: Record<ArtSize, [number, number]> = {
  hero: [1600, 1200],
  thumb: [800, 800],
  phone: [1200, 1500],
};

/** Deterministic pseudo-random seed so a given slug+size always renders the same art. */
function seededRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/**
 * Renders the format illustration for a breakfast recipe as an inline SVG
 * data URI. Deterministic per (format, size) so the same recipe always shows
 * the same art (the composers use Math.random for garnish scatter, seeded
 * here rather than left to the platform's RNG).
 */
export function breakfastArt(format: BreakfastFormat, size: ArtSize): string {
  const [w, h] = SIZES[size];
  const rng = seededRandom(hashString(`${format}:${size}`));
  const originalRandom = Math.random;
  Math.random = rng;
  try {
    const inner = COMPOSERS[format](w, h);
    return encodeSvg(svg(w, h, inner));
  } finally {
    Math.random = originalRandom;
  }
}
