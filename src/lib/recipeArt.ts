/**
 * Per-recipe themed fallback art.
 *
 * Renders when a checked-in photograph fails to load. The hand-drawn SVG
 * captures the named dish's composition and palette, so a missing asset still
 * feels intentional rather than showing a broken-image icon.
 *
 * Each recipe gets:
 *   - A 4:3 hero composition (1600x1200) — used as the main image fallback
 *   - A 1:1 thumb composition (800x800)     — used for gallery tiles
 *   - A 4:5 phone composition (1200x1500)   — used for vertical cards
 *
 * Palette tokens are sourced from the design system so the fallback art
 * stays in lockstep with the rest of the UI.
 */

export type ArtSize = "hero" | "thumb" | "phone";

export const PALETTE = {
  chili: "#b8362c",
  chiliDeep: "#7a1f1a",
  chiliSoft: "#e89588",
  teal: "#155159",
  tealDeep: "#0e3b41",
  tealSoft: "#b3cbcf",
  corn: "#e8b14a",
  cornDeep: "#c69534",
  jade: "#2f6a4d",
  bone: "#f5ece0",
  bone50: "#faf5ec",
  bone200: "#ebdfcc",
  cornSoft: "#f5d7a0",
  ink: "#1c140e",
  inkSoft: "#3a2c20",
  inkMuted: "#6b5a4a",
  cream: "#fffaf0",
  white: "#ffffff",
};

type RecipeArt = {
  /** Render a 1600x1200 hero fallback for this slug. */
  hero: () => string;
  /** Render a 800x800 square thumb fallback for this slug. */
  thumb: () => string;
  /** Render a 1200x1500 phone-card fallback for this slug. */
  phone: () => string;
};

export function svg(width: number, height: number, inner: string, gradientDefs = ""): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice">` +
    `<defs>${gradientDefs}</defs>` +
    inner +
    `</svg>`
  );
}

export function encodeSvg(s: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(s)}`;
}

function chiliDots(cx: number, cy: number, color: string) {
  return `<circle cx="${cx}" cy="${cy}" r="1.2" fill="${color}" opacity="0.7"/>`;
}

function sesame(cx: number, cy: number, color: string) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="2" ry="1" fill="${color}" opacity="0.85" transform="rotate(${Math.floor(Math.random() * 180)} ${cx} ${cy})"/>`;
}

/* =========================================================================
   MISÓ-MOLE SHORT RIB TACOS
   Three small corn tortillas on a dark slate with glossy short rib,
   magenta pickled onion ribbons, cilantro, sesame.
   ========================================================================= */
const Tacos: RecipeArt = {
  hero: () => svg(1600, 1200, `
    <rect width="1600" height="1200" fill="${PALETTE.ink}"/>
    <rect x="60" y="60" width="1480" height="1080" rx="32" fill="${PALETTE.inkSoft}"/>
    <rect x="120" y="120" width="1360" height="960" rx="20" fill="#2a1f17"/>
    <!-- Slate plate -->
    <ellipse cx="800" cy="660" rx="640" ry="180" fill="#1a1208"/>
    <ellipse cx="800" cy="640" rx="600" ry="160" fill="#241810"/>
    <!-- Three tacos arranged in a row -->
    <g transform="translate(800 600)">
      ${[-1, 0, 1].map((i) => `
        <g transform="translate(${i * 280} 0) rotate(${i === 0 ? -8 : i === -1 ? -16 : 0})">
          <!-- Tortilla -->
          <path d="M-180 0 Q-180 -110 0 -110 Q180 -110 180 0 Q180 80 0 80 Q-180 80 -180 0 Z" fill="${PALETTE.corn}" opacity="0.95"/>
          <path d="M-180 0 Q-180 -110 0 -110 Q180 -110 180 0 Q180 80 0 80 Q-180 80 -180 0 Z" fill="${PALETTE.cornDeep}" opacity="0.18"/>
          <!-- Short rib filling -->
          <path d="M-150 -10 Q-150 -85 0 -85 Q150 -85 150 -10 Q150 50 0 50 Q-150 50 -150 -10 Z" fill="${PALETTE.chiliDeep}"/>
          <ellipse cx="-40" cy="-30" rx="60" ry="22" fill="#5a1410" opacity="0.6"/>
          <!-- Pickled onion ribbons (magenta) -->
          <path d="M-100 -55 Q-60 -75 -10 -50 Q40 -25 90 -50" stroke="#d946a6" stroke-width="3" fill="none" opacity="0.85"/>
          <path d="M-90 -40 Q-50 -60 0 -35 Q50 -10 100 -35" stroke="#e36bbf" stroke-width="2.5" fill="none" opacity="0.7"/>
          <!-- Cilantro leaves -->
          <g fill="${PALETTE.jade}" opacity="0.95">
            <path d="M-60 -70 q-8 -10 -16 0 q8 -6 16 0 z"/>
            <path d="M30 -75 q-8 -10 -16 0 q8 -6 16 0 z"/>
            <path d="M-20 -60 q-6 -8 -12 0 q6 -5 12 0 z"/>
          </g>
          <!-- Sesame -->
          ${Array.from({ length: 14 }, (_, k) => sesame(-100 + (k * 13) % 200, -75 + ((k * 19) % 100), i === 0 ? PALETTE.ink : PALETTE.bone)).join("")}
        </g>
      `).join("")}
    </g>
  `),
  thumb: () => svg(800, 800, `
    <rect width="800" height="800" fill="${PALETTE.ink}"/>
    <circle cx="400" cy="420" r="280" fill="#1a1208"/>
    <circle cx="400" cy="410" r="260" fill="#241810"/>
    <g transform="translate(400 410)">
      ${[-1, 0, 1].map((i) => `
        <g transform="translate(${i * 100} 0) rotate(${i * -10}) scale(0.6)">
          <path d="M-180 0 Q-180 -110 0 -110 Q180 -110 180 0 Q180 80 0 80 Q-180 80 -180 0 Z" fill="${PALETTE.corn}"/>
          <path d="M-150 -10 Q-150 -85 0 -85 Q150 -85 150 -10 Q150 50 0 50 Q-150 50 -150 -10 Z" fill="${PALETTE.chiliDeep}"/>
          <path d="M-90 -40 Q-50 -60 0 -35 Q50 -10 90 -35" stroke="#e36bbf" stroke-width="3" fill="none"/>
          <g fill="${PALETTE.jade}">
            <path d="M-50 -65 q-8 -10 -16 0 q8 -6 16 0 z"/>
            <path d="M30 -70 q-8 -10 -16 0 q8 -6 16 0 z"/>
          </g>
        </g>
      `).join("")}
    </g>
  `),
  phone: () => svg(1200, 1500, `
    <rect width="1200" height="1500" fill="${PALETTE.ink}"/>
    <ellipse cx="600" cy="700" rx="540" ry="160" fill="#1a1208"/>
    <ellipse cx="600" cy="680" rx="500" ry="140" fill="#241810"/>
    <g transform="translate(600 660) scale(0.85)">
      ${[-1, 0, 1].map((i) => `
        <g transform="translate(${i * 220} 0) rotate(${i * -10})">
          <path d="M-180 0 Q-180 -110 0 -110 Q180 -110 180 0 Q180 80 0 80 Q-180 80 -180 0 Z" fill="${PALETTE.corn}"/>
          <path d="M-150 -10 Q-150 -85 0 -85 Q150 -85 150 -10 Q150 50 0 50 Q-150 50 -150 -10 Z" fill="${PALETTE.chiliDeep}"/>
          <path d="M-100 -55 Q-50 -75 0 -50 Q50 -25 100 -50" stroke="#d946a6" stroke-width="3" fill="none"/>
          <g fill="${PALETTE.jade}">
            <path d="M-50 -65 q-8 -10 -16 0 q8 -6 16 0 z"/>
            <path d="M30 -70 q-8 -10 -16 0 q8 -6 16 0 z"/>
          </g>
        </g>
      `).join("")}
    </g>
  `),
};

/* =========================================================================
   KIMCHI ELOTE
   Two charred corn cobs with kimchi crema, gochugaru, queso fresco,
   nori, lime. Black slate, moody.
   ========================================================================= */
const Elote: RecipeArt = {
  hero: () => svg(1600, 1200, `
    <rect width="1600" height="1200" fill="${PALETTE.ink}"/>
    <rect x="60" y="60" width="1480" height="1080" rx="32" fill="#1a1408"/>
    <ellipse cx="800" cy="680" rx="660" ry="200" fill="#0d0805"/>
    <ellipse cx="800" cy="660" rx="600" ry="180" fill="#170e07"/>
    <!-- Two corn cobs -->
    <g transform="translate(800 600)">
      ${[-1, 1].map((i) => `
        <g transform="translate(${i * 280} 30) rotate(${i * -20})">
          <!-- Cob -->
          <ellipse cx="0" cy="0" rx="100" ry="220" fill="${PALETTE.corn}"/>
          <ellipse cx="0" cy="0" rx="100" ry="220" fill="${PALETTE.cornDeep}" opacity="0.25"/>
          <!-- Kernels (textured rows) -->
          ${Array.from({ length: 16 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => {
              const x = -78 + col * 22 + (row % 2) * 11;
              const y = -200 + row * 27;
              return `<rect x="${x - 8}" y="${y - 10}" width="16" height="20" rx="3" fill="${row % 3 === 0 ? PALETTE.cornDeep : PALETTE.corn}"/>`;
            }).join("")
          ).join("")}
          <!-- Char marks -->
          <ellipse cx="-20" cy="-50" rx="20" ry="6" fill="${PALETTE.ink}" opacity="0.6"/>
          <ellipse cx="20" cy="80" rx="20" ry="6" fill="${PALETTE.ink}" opacity="0.6"/>
          <!-- Kimchi crema (dollops) -->
          <ellipse cx="0" cy="-180" rx="40" ry="10" fill="${PALETTE.bone}" opacity="0.85"/>
          <ellipse cx="-30" cy="120" rx="40" ry="10" fill="${PALETTE.bone}" opacity="0.85"/>
          <!-- Gochugaru (red specks) -->
          ${Array.from({ length: 30 }, () => chiliDots(-80 + Math.random() * 160, -200 + Math.random() * 400, PALETTE.chili)).join("")}
          <!-- Queso fresco (white crumbles) -->
          ${Array.from({ length: 12 }, () => `<rect x="${-80 + Math.random() * 160}" y="${-200 + Math.random() * 400}" width="6" height="6" rx="1" fill="${PALETTE.cream}"/>`).join("")}
          <!-- Nori shreds -->
          ${Array.from({ length: 10 }, () => `<rect x="${-80 + Math.random() * 160}" y="${-200 + Math.random() * 400}" width="2" height="14" fill="${PALETTE.tealDeep}"/>`).join("")}
        </g>
      `).join("")}
    </g>
    <!-- Lime wedges -->
    <g transform="translate(380 900)">
      <path d="M0 0 L40 -25 L0 -50 Z" fill="${PALETTE.jade}"/>
      <path d="M0 0 L40 -25 L0 -50 Z" fill="${PALETTE.cream}" opacity="0.4"/>
    </g>
  `),
  thumb: () => svg(800, 800, `
    <rect width="800" height="800" fill="${PALETTE.ink}"/>
    <ellipse cx="400" cy="400" rx="320" ry="120" fill="#0d0805"/>
    <g transform="translate(400 400) scale(0.55)">
      ${[-1, 1].map((i) => `
        <g transform="translate(${i * 250} 30) rotate(${i * -20})">
          <ellipse cx="0" cy="0" rx="100" ry="220" fill="${PALETTE.corn}"/>
          ${Array.from({ length: 12 }, (_, row) => Array.from({ length: 6 }, (_, col) => `<rect x="${-60 + col * 22 + (row % 2) * 11}" y="${-200 + row * 36}" width="16" height="22" rx="3" fill="${row % 3 === 0 ? PALETTE.cornDeep : PALETTE.corn}"/>`).join("")).join("")}
          ${Array.from({ length: 20 }, () => chiliDots(-80 + Math.random() * 160, -200 + Math.random() * 400, PALETTE.chili)).join("")}
          ${Array.from({ length: 8 }, () => `<rect x="${-80 + Math.random() * 160}" y="${-200 + Math.random() * 400}" width="6" height="6" rx="1" fill="${PALETTE.cream}"/>`).join("")}
        </g>
      `).join("")}
    </g>
  `),
  phone: () => svg(1200, 1500, `
    <rect width="1200" height="1500" fill="${PALETTE.ink}"/>
    <ellipse cx="600" cy="700" rx="540" ry="160" fill="#0d0805"/>
    <g transform="translate(600 700) scale(0.75)">
      ${[-1, 1].map((i) => `
        <g transform="translate(${i * 250} 30) rotate(${i * -20})">
          <ellipse cx="0" cy="0" rx="100" ry="220" fill="${PALETTE.corn}"/>
          ${Array.from({ length: 12 }, (_, row) => Array.from({ length: 6 }, (_, col) => `<rect x="${-60 + col * 22 + (row % 2) * 11}" y="${-200 + row * 36}" width="16" height="22" rx="3" fill="${row % 3 === 0 ? PALETTE.cornDeep : PALETTE.corn}"/>`).join("")).join("")}
          ${Array.from({ length: 20 }, () => chiliDots(-80 + Math.random() * 160, -200 + Math.random() * 400, PALETTE.chili)).join("")}
          ${Array.from({ length: 8 }, () => `<rect x="${-80 + Math.random() * 160}" y="${-200 + Math.random() * 400}" width="6" height="6" rx="1" fill="${PALETTE.cream}"/>`).join("")}
        </g>
      `).join("")}
    </g>
  `),
};

/* =========================================================================
   YUZU AGUACHILE HAMACHI
   Translucent hamachi sashimi in pale yellow yuzu broth, cucumber,
   shiso, sesame.
   ========================================================================= */
const Hamachi: RecipeArt = {
  hero: () => svg(1600, 1200, `
    <rect width="1600" height="1200" fill="${PALETTE.bone}"/>
    <ellipse cx="800" cy="660" rx="640" ry="220" fill="${PALETTE.bone200}"/>
    <!-- Plate -->
    <ellipse cx="800" cy="650" rx="600" ry="200" fill="${PALETTE.cream}"/>
    <ellipse cx="800" cy="650" rx="600" ry="200" fill="#fff3d8" opacity="0.4"/>
    <!-- Yuzu broth (pale yellow) -->
    <ellipse cx="800" cy="640" rx="540" ry="170" fill="#f4e3a4" opacity="0.7"/>
    <!-- Hamachi slices -->
    <g transform="translate(800 620)">
      ${[-2, -1, 0, 1, 2].map((i) => `
        <g transform="translate(${i * 130} ${(i % 2) * 18}) rotate(${i * 8})">
          <path d="M-50 -30 L50 0 L-50 30 Z" fill="#f5c97b"/>
          <path d="M-50 -30 L50 0 L-50 30 Z" fill="#e8a23a" opacity="0.4"/>
          <path d="M-50 -30 L-25 0 L-50 30 Z" fill="#fff3d8" opacity="0.4"/>
        </g>
      `).join("")}
    </g>
    <!-- Cucumber petals (overlapping arcs) -->
    <g transform="translate(800 720)" opacity="0.85">
      ${Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const x = Math.cos(angle) * 380;
        const y = Math.sin(angle) * 100;
        return `<ellipse cx="${x}" cy="${y}" rx="32" ry="14" fill="#a4d4a4" stroke="#3a6e4a" stroke-width="1.5" transform="rotate(${(angle * 180) / Math.PI} ${x} ${y})"/>`;
      }).join("")}
    </g>
    <!-- Shiso leaves -->
    <g fill="${PALETTE.jade}" opacity="0.9">
      <path d="M620 540 q20 -30 50 -10 q-10 30 -50 10 z"/>
      <path d="M920 580 q20 -30 50 -10 q-10 30 -50 10 z"/>
      <path d="M700 760 q20 -30 50 -10 q-10 30 -50 10 z"/>
    </g>
    <!-- Sesame -->
    ${Array.from({ length: 30 }, (_, k) => sesame(600 + (k * 37) % 400, 540 + ((k * 23) % 240), PALETTE.ink)).join("")}
  `),
  thumb: () => svg(800, 800, `
    <rect width="800" height="800" fill="${PALETTE.bone}"/>
    <ellipse cx="400" cy="420" rx="320" ry="120" fill="${PALETTE.cream}"/>
    <ellipse cx="400" cy="420" rx="280" ry="100" fill="#f4e3a4" opacity="0.7"/>
    <g transform="translate(400 420) scale(0.7)">
      ${[-2, -1, 0, 1, 2].map((i) => `
        <g transform="translate(${i * 80} ${(i % 2) * 12}) rotate(${i * 8})">
          <path d="M-50 -30 L50 0 L-50 30 Z" fill="#f5c97b"/>
          <path d="M-50 -30 L50 0 L-50 30 Z" fill="#e8a23a" opacity="0.4"/>
        </g>
      `).join("")}
    </g>
  `),
  phone: () => svg(1200, 1500, `
    <rect width="1200" height="1500" fill="${PALETTE.bone}"/>
    <ellipse cx="600" cy="700" rx="540" ry="180" fill="${PALETTE.cream}"/>
    <ellipse cx="600" cy="700" rx="480" ry="150" fill="#f4e3a4" opacity="0.7"/>
    <g transform="translate(600 700) scale(0.95)">
      ${[-2, -1, 0, 1, 2].map((i) => `
        <g transform="translate(${i * 100} ${(i % 2) * 16}) rotate(${i * 8})">
          <path d="M-50 -30 L50 0 L-50 30 Z" fill="#f5c97b"/>
          <path d="M-50 -30 L50 0 L-50 30 Z" fill="#e8a23a" opacity="0.4"/>
        </g>
      `).join("")}
    </g>
  `),
};

/* =========================================================================
   AL PASTOR BAO
   White pillowy bao buns with red al pastor pork, pineapple,
   cilantro, onion, salsa macha.
   ========================================================================= */
const Bao: RecipeArt = {
  hero: () => svg(1600, 1200, `
    <rect width="1600" height="1200" fill="${PALETTE.ink}"/>
    <rect x="60" y="60" width="1480" height="1080" rx="32" fill="#1f140a"/>
    <ellipse cx="800" cy="640" rx="640" ry="180" fill="#0d0805"/>
    <ellipse cx="800" cy="620" rx="600" ry="160" fill="#1a1006"/>
    <g transform="translate(800 600)">
      ${[-2, -1, 0, 1, 2].map((i) => `
        <g transform="translate(${i * 240} ${(i % 2) * 24})">
          <!-- Bottom bun -->
          <ellipse cx="0" cy="40" rx="150" ry="50" fill="${PALETTE.cream}"/>
          <ellipse cx="0" cy="36" rx="140" ry="44" fill="${PALETTE.bone50}"/>
          <!-- Filling (al pastor) -->
          <ellipse cx="0" cy="20" rx="120" ry="36" fill="${PALETTE.chili}"/>
          <ellipse cx="0" cy="14" rx="110" ry="30" fill="${PALETTE.chiliDeep}"/>
          <!-- Pineapple cubes -->
          <rect x="-60" y="0" width="22" height="22" rx="2" fill="#f5c14a"/>
          <rect x="-30" y="-4" width="22" height="22" rx="2" fill="#f5c14a"/>
          <rect x="20" y="2" width="22" height="22" rx="2" fill="#f5c14a"/>
          <rect x="50" y="-2" width="22" height="22" rx="2" fill="#f5c14a"/>
          <!-- Cilantro -->
          <g fill="${PALETTE.jade}">
            <path d="M-40 -20 q-8 -10 -16 0 q8 -6 16 0 z"/>
            <path d="M10 -25 q-8 -10 -16 0 q8 -6 16 0 z"/>
            <path d="M50 -18 q-8 -10 -16 0 q8 -6 16 0 z"/>
          </g>
          <!-- Onion (diced white) -->
          ${Array.from({ length: 8 }, (_, k) => `<rect x="${-50 + k * 14}" y="-8" width="6" height="6" fill="${PALETTE.bone50}"/>`).join("")}
          <!-- Top bun -->
          <ellipse cx="0" cy="-30" rx="150" ry="60" fill="${PALETTE.cream}"/>
          <ellipse cx="0" cy="-40" rx="140" ry="50" fill="${PALETTE.bone50}"/>
          <ellipse cx="0" cy="-50" rx="120" ry="38" fill="${PALETTE.cream}"/>
        </g>
      `).join("")}
    </g>
  `),
  thumb: () => svg(800, 800, `
    <rect width="800" height="800" fill="${PALETTE.ink}"/>
    <ellipse cx="400" cy="420" rx="320" ry="100" fill="#0d0805"/>
    <g transform="translate(400 400) scale(0.55)">
      ${[-2, -1, 0, 1, 2].map((i) => `
        <g transform="translate(${i * 180} ${(i % 2) * 18})">
          <ellipse cx="0" cy="40" rx="150" ry="50" fill="${PALETTE.cream}"/>
          <ellipse cx="0" cy="20" rx="120" ry="36" fill="${PALETTE.chili}"/>
          <rect x="-30" y="-4" width="22" height="22" rx="2" fill="#f5c14a"/>
          <rect x="20" y="2" width="22" height="22" rx="2" fill="#f5c14a"/>
          <ellipse cx="0" cy="-30" rx="150" ry="60" fill="${PALETTE.cream}"/>
        </g>
      `).join("")}
    </g>
  `),
  phone: () => svg(1200, 1500, `
    <rect width="1200" height="1500" fill="${PALETTE.ink}"/>
    <ellipse cx="600" cy="700" rx="540" ry="140" fill="#0d0805"/>
    <g transform="translate(600 700) scale(0.75)">
      ${[-2, -1, 0, 1, 2].map((i) => `
        <g transform="translate(${i * 200} ${(i % 2) * 22})">
          <ellipse cx="0" cy="40" rx="150" ry="50" fill="${PALETTE.cream}"/>
          <ellipse cx="0" cy="20" rx="120" ry="36" fill="${PALETTE.chili}"/>
          <rect x="-30" y="-4" width="22" height="22" rx="2" fill="#f5c14a"/>
          <ellipse cx="0" cy="-30" rx="150" ry="60" fill="${PALETTE.cream}"/>
        </g>
      `).join("")}
    </g>
  `),
};

/* =========================================================================
   RAMEN POZOLE ROJO
   Bowl of milky tonkotsu broth with guajillo oil ribbon, hominy,
   noodles, egg, cabbage, radish, scallion.
   ========================================================================= */
const Ramen: RecipeArt = {
  hero: () => svg(1600, 1200, `
    <rect width="1600" height="1200" fill="${PALETTE.ink}"/>
    <rect x="60" y="60" width="1480" height="1080" rx="32" fill="#1a1108"/>
    <ellipse cx="800" cy="640" rx="660" ry="200" fill="#0d0805"/>
    <ellipse cx="800" cy="620" rx="600" ry="180" fill="#241810"/>
    <!-- Bowl rim -->
    <ellipse cx="800" cy="600" rx="500" ry="120" fill="${PALETTE.inkSoft}"/>
    <ellipse cx="800" cy="600" rx="460" ry="100" fill="${PALETTE.cream}"/>
    <!-- Broth -->
    <ellipse cx="800" cy="600" rx="440" ry="88" fill="#f5e7c5"/>
    <!-- Chile oil ribbon -->
    <path d="M 400 600 Q 800 540 1200 600" stroke="${PALETTE.chili}" stroke-width="6" fill="none" opacity="0.85"/>
    <path d="M 500 590 Q 800 570 1100 600" stroke="${PALETTE.chiliDeep}" stroke-width="3" fill="none" opacity="0.6"/>
    <!-- Noodles (curly lines) -->
    <g stroke="${PALETTE.corn}" stroke-width="2.5" fill="none" opacity="0.7">
      <path d="M 500 580 Q 600 600 500 620"/>
      <path d="M 600 575 Q 700 595 600 615"/>
      <path d="M 700 570 Q 800 590 700 610"/>
      <path d="M 800 575 Q 900 595 800 615"/>
      <path d="M 900 580 Q 1000 600 900 620"/>
    </g>
    <!-- Hominy (white kernels) -->
    ${Array.from({ length: 20 }, () => `<ellipse cx="${500 + Math.random() * 600}" cy="${560 + Math.random() * 80}" rx="14" ry="10" fill="${PALETTE.cream}"/>`).join("")}
    <!-- Soft egg halves -->
    <g transform="translate(620 580)">
      <ellipse cx="0" cy="0" rx="40" ry="30" fill="${PALETTE.cream}"/>
      <ellipse cx="0" cy="0" rx="32" ry="22" fill="#f5c14a"/>
      <ellipse cx="0" cy="0" rx="22" ry="14" fill="#d97a1a"/>
    </g>
    <g transform="translate(950 590)">
      <ellipse cx="0" cy="0" rx="40" ry="30" fill="${PALETTE.cream}"/>
      <ellipse cx="0" cy="0" rx="32" ry="22" fill="#f5c14a"/>
      <ellipse cx="0" cy="0" rx="22" ry="14" fill="#d97a1a"/>
    </g>
    <!-- Radish slices -->
    ${Array.from({ length: 6 }, (_, i) => {
      const x = 520 + i * 110;
      return `<g transform="translate(${x} 640)">
        <circle cx="0" cy="0" r="14" fill="${PALETTE.cornSoft}"/>
        <circle cx="0" cy="0" r="14" fill="none" stroke="#d946a6" stroke-width="1.5"/>
      </g>`;
    }).join("")}
    <!-- Scallion rings (green) -->
    ${Array.from({ length: 10 }, () => `<circle cx="${500 + Math.random() * 600}" cy="${540 + Math.random() * 120}" r="4" fill="${PALETTE.jade}"/>`).join("")}
  `),
  thumb: () => svg(800, 800, `
    <rect width="800" height="800" fill="${PALETTE.ink}"/>
    <ellipse cx="400" cy="420" rx="320" ry="100" fill="${PALETTE.cream}"/>
    <ellipse cx="400" cy="420" rx="280" ry="80" fill="#f5e7c5"/>
    <path d="M 200 420 Q 400 380 600 420" stroke="${PALETTE.chili}" stroke-width="6" fill="none"/>
    ${Array.from({ length: 12 }, () => `<ellipse cx="${260 + Math.random() * 280}" cy="${400 + Math.random() * 40}" rx="10" ry="7" fill="${PALETTE.cream}"/>`).join("")}
    <g transform="translate(400 410)">
      <ellipse cx="0" cy="0" rx="30" ry="22" fill="${PALETTE.cream}"/>
      <ellipse cx="0" cy="0" rx="22" ry="14" fill="#d97a1a"/>
    </g>
  `),
  phone: () => svg(1200, 1500, `
    <rect width="1200" height="1500" fill="${PALETTE.ink}"/>
    <ellipse cx="600" cy="700" rx="540" ry="160" fill="${PALETTE.cream}"/>
    <ellipse cx="600" cy="700" rx="480" ry="130" fill="#f5e7c5"/>
    <path d="M 300 700 Q 600 640 900 700" stroke="${PALETTE.chili}" stroke-width="8" fill="none"/>
    ${Array.from({ length: 20 }, () => `<ellipse cx="${400 + Math.random() * 400}" cy="${670 + Math.random() * 60}" rx="12" ry="9" fill="${PALETTE.cream}"/>`).join("")}
    <g transform="translate(600 690)">
      <ellipse cx="0" cy="0" rx="40" ry="30" fill="${PALETTE.cream}"/>
      <ellipse cx="0" cy="0" rx="30" ry="20" fill="#d97a1a"/>
    </g>
  `),
};

/* =========================================================================
   CHAMOY-FURIKAKE POPCORN
   Black bowl of red-orange chamoy popcorn with furikake, tajin.
   ========================================================================= */
const Popcorn: RecipeArt = {
  hero: () => svg(1600, 1200, `
    <rect width="1600" height="1200" fill="${PALETTE.ink}"/>
    <ellipse cx="800" cy="660" rx="640" ry="220" fill="#0d0805"/>
    <ellipse cx="800" cy="640" rx="600" ry="200" fill="#1a1006"/>
    <ellipse cx="800" cy="620" rx="500" ry="160" fill="#2a1a0d"/>
    <ellipse cx="800" cy="600" rx="460" ry="140" fill="#1a1006"/>
    <!-- Popcorn -->
    <g>
      ${Array.from({ length: 80 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 380;
        const x = 800 + Math.cos(angle) * r;
        const y = 600 + Math.sin(angle) * r * 0.45;
        const size = 14 + Math.random() * 14;
        return `<g transform="translate(${x} ${y})">
          <circle cx="0" cy="0" r="${size}" fill="${PALETTE.cream}"/>
          <path d="M-${size * 0.4} 0 Q0 -${size} ${size * 0.4} 0 Q0 ${size * 0.6} -${size * 0.4} 0 Z" fill="${PALETTE.cream}"/>
          <path d="M-${size * 0.3} -${size * 0.2} Q0 -${size * 0.9} ${size * 0.3} -${size * 0.2} Q0 -${size * 0.5} -${size * 0.3} -${size * 0.2} Z" fill="#ff7a3a" opacity="${0.3 + Math.random() * 0.5}"/>
        </g>`;
      }).join("")}
    </g>
    <!-- Furikake specks (green-black) -->
    ${Array.from({ length: 60 }, () => chiliDots(500 + Math.random() * 600, 500 + Math.random() * 200, PALETTE.jade)).join("")}
    ${Array.from({ length: 60 }, () => chiliDots(500 + Math.random() * 600, 500 + Math.random() * 200, PALETTE.ink)).join("")}
    <!-- Tajin red specks -->
    ${Array.from({ length: 80 }, () => chiliDots(500 + Math.random() * 600, 500 + Math.random() * 200, PALETTE.chili)).join("")}
  `),
  thumb: () => svg(800, 800, `
    <rect width="800" height="800" fill="${PALETTE.ink}"/>
    <ellipse cx="400" cy="420" rx="320" ry="120" fill="#1a1006"/>
    <g>
      ${Array.from({ length: 40 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 220;
        const x = 400 + Math.cos(angle) * r;
        const y = 420 + Math.sin(angle) * r * 0.4;
        const size = 10 + Math.random() * 10;
        return `<circle cx="${x}" cy="${y}" r="${size}" fill="${PALETTE.cream}"/>`;
      }).join("")}
    </g>
    ${Array.from({ length: 30 }, () => chiliDots(300 + Math.random() * 200, 350 + Math.random() * 150, PALETTE.chili)).join("")}
  `),
  phone: () => svg(1200, 1500, `
    <rect width="1200" height="1500" fill="${PALETTE.ink}"/>
    <ellipse cx="600" cy="700" rx="500" ry="160" fill="#1a1006"/>
    <g>
      ${Array.from({ length: 60 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 360;
        const x = 600 + Math.cos(angle) * r;
        const y = 700 + Math.sin(angle) * r * 0.45;
        const size = 14 + Math.random() * 12;
        return `<circle cx="${x}" cy="${y}" r="${size}" fill="${PALETTE.cream}"/>`;
      }).join("")}
    </g>
    ${Array.from({ length: 50 }, () => chiliDots(400 + Math.random() * 400, 580 + Math.random() * 240, PALETTE.chili)).join("")}
  `),
};

/* =========================================================================
   MISO MEZCAL FLAN
   Silken caramel flan with sesame brittle on a white plate.
   ========================================================================= */
const Flan: RecipeArt = {
  hero: () => svg(1600, 1200, `
    <rect width="1600" height="1200" fill="${PALETTE.bone}"/>
    <ellipse cx="800" cy="660" rx="600" ry="200" fill="${PALETTE.bone200}"/>
    <ellipse cx="800" cy="640" rx="500" ry="180" fill="${PALETTE.cream}"/>
    <ellipse cx="800" cy="640" rx="500" ry="180" fill="#f5e7d3" opacity="0.5"/>
    <!-- Caramel pool -->
    <ellipse cx="800" cy="640" rx="380" ry="120" fill="#8a4513" opacity="0.8"/>
    <ellipse cx="800" cy="630" rx="320" ry="100" fill="#a8581a" opacity="0.7"/>
    <!-- Flan body (inverted dome) -->
    <path d="M 500 640 Q 500 460 800 460 Q 1100 460 1100 640 Z" fill="${PALETTE.cream}"/>
    <path d="M 500 640 Q 500 460 800 460 Q 1100 460 1100 640 Z" fill="#f5d7a0" opacity="0.6"/>
    <!-- Caramel glaze on top -->
    <ellipse cx="800" cy="465" rx="280" ry="20" fill="#7a3508"/>
    <ellipse cx="800" cy="462" rx="260" ry="14" fill="#a8581a"/>
    <!-- Sesame brittle shards -->
    ${Array.from({ length: 24 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const r = 200 + Math.random() * 80;
      const x = 800 + Math.cos(angle) * r;
      const y = 520 + Math.sin(angle) * r * 0.5;
      return `<g transform="translate(${x} ${y}) rotate(${Math.random() * 360})">
        <polygon points="0,0 12,4 16,12 8,18 -4,16 -10,8" fill="${PALETTE.cream}"/>
        <polygon points="0,0 12,4 16,12 8,18 -4,16 -10,8" fill="${PALETTE.corn}" opacity="0.5"/>
        ${Array.from({ length: 6 }, () => `<circle cx="${Math.random() * 16 - 8}" cy="${Math.random() * 16 - 8}" r="1" fill="${PALETTE.ink}"/>`).join("")}
      </g>`;
    }).join("")}
  `),
  thumb: () => svg(800, 800, `
    <rect width="800" height="800" fill="${PALETTE.bone}"/>
    <ellipse cx="400" cy="420" rx="320" ry="120" fill="${PALETTE.cream}"/>
    <ellipse cx="400" cy="420" rx="240" ry="80" fill="#8a4513" opacity="0.7"/>
    <path d="M 200 420 Q 200 280 400 280 Q 600 280 600 420 Z" fill="${PALETTE.cream}"/>
    <ellipse cx="400" cy="282" rx="200" ry="14" fill="#7a3508"/>
    ${Array.from({ length: 12 }, () => `<polygon points="${380 + Math.random() * 40},${300 + Math.random() * 30} ${390 + Math.random() * 30},${300 + Math.random() * 30} ${400 + Math.random() * 20},${310 + Math.random() * 30} ${390 + Math.random() * 20},${320 + Math.random() * 30}" fill="${PALETTE.corn}" opacity="0.7"/>`).join("")}
  `),
  phone: () => svg(1200, 1500, `
    <rect width="1200" height="1500" fill="${PALETTE.bone}"/>
    <ellipse cx="600" cy="700" rx="480" ry="180" fill="${PALETTE.cream}"/>
    <ellipse cx="600" cy="700" rx="380" ry="130" fill="#8a4513" opacity="0.7"/>
    <path d="M 320 700 Q 320 500 600 500 Q 880 500 880 700 Z" fill="${PALETTE.cream}"/>
    <ellipse cx="600" cy="503" rx="270" ry="18" fill="#7a3508"/>
  `),
};

/* =========================================================================
   TAMARINDO SHOYU WINGS
   Glossy mahogany wings with sesame and scallion on a black slate.
   ========================================================================= */
const Wings: RecipeArt = {
  hero: () => svg(1600, 1200, `
    <rect width="1600" height="1200" fill="${PALETTE.ink}"/>
    <ellipse cx="800" cy="660" rx="640" ry="200" fill="#0d0805"/>
    <ellipse cx="800" cy="640" rx="600" ry="180" fill="#1a1006"/>
    <g transform="translate(800 620)">
      ${Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 180;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r * 0.6;
        const rot = (angle * 180) / Math.PI + 90;
        return `<g transform="translate(${x} ${y}) rotate(${rot})">
          <ellipse cx="0" cy="0" rx="60" ry="80" fill="#3a1408"/>
          <ellipse cx="0" cy="0" rx="56" ry="76" fill="#5a1f0c"/>
          <ellipse cx="0" cy="-20" rx="40" ry="50" fill="#7a2f12" opacity="0.8"/>
          <ellipse cx="0" cy="-30" rx="20" ry="20" fill="#a0451a" opacity="0.7"/>
        </g>`;
      }).join("")}
      <!-- Sesame + scallion garnish -->
      ${Array.from({ length: 30 }, () => sesame(-200 + Math.random() * 400, -120 + Math.random() * 240, PALETTE.cream)).join("")}
      ${Array.from({ length: 12 }, () => `<circle cx="${-200 + Math.random() * 400}" cy="${-120 + Math.random() * 240}" r="3" fill="${PALETTE.jade}"/>`).join("")}
      <!-- Fresno chile slices -->
      ${Array.from({ length: 6 }, () => `<circle cx="${-200 + Math.random() * 400}" cy="${-120 + Math.random() * 240}" r="10" fill="${PALETTE.chili}"/>`).join("")}
    </g>
  `),
  thumb: () => svg(800, 800, `
    <rect width="800" height="800" fill="${PALETTE.ink}"/>
    <ellipse cx="400" cy="420" rx="320" ry="120" fill="#0d0805"/>
    <g transform="translate(400 410)">
      ${Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 130;
        const y = Math.sin(angle) * 70;
        return `<ellipse cx="${x}" cy="${y}" rx="40" ry="55" fill="#5a1f0c"/>`;
      }).join("")}
    </g>
    ${Array.from({ length: 15 }, () => sesame(300 + Math.random() * 200, 350 + Math.random() * 150, PALETTE.cream)).join("")}
  `),
  phone: () => svg(1200, 1500, `
    <rect width="1200" height="1500" fill="${PALETTE.ink}"/>
    <ellipse cx="600" cy="700" rx="500" ry="160" fill="#0d0805"/>
    <g transform="translate(600 700)">
      ${Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 180;
        const y = Math.sin(angle) * 100;
        return `<ellipse cx="${x}" cy="${y}" rx="50" ry="70" fill="#5a1f0c"/>`;
      }).join("")}
    </g>
    ${Array.from({ length: 20 }, () => sesame(400 + Math.random() * 400, 580 + Math.random() * 240, PALETTE.cream)).join("")}
  `),
};

/* =========================================================================
   HORCHATA TRES LECHES MATCHA
   White tres leches with green matcha stripe.
   ========================================================================= */
const Matcha: RecipeArt = {
  hero: () => svg(1600, 1200, `
    <rect width="1600" height="1200" fill="${PALETTE.bone}"/>
    <ellipse cx="800" cy="660" rx="600" ry="200" fill="${PALETTE.bone200}"/>
    <ellipse cx="800" cy="640" rx="500" ry="180" fill="${PALETTE.cream}"/>
    <!-- Square cake slice -->
    <g transform="translate(800 640)">
      <!-- Sponge bottom -->
      <rect x="-200" y="-50" width="400" height="160" fill="${PALETTE.cream}"/>
      <rect x="-200" y="-50" width="400" height="20" fill="#e8d8b5"/>
      <!-- Whipped cream layer -->
      <rect x="-200" y="-80" width="400" height="30" fill="${PALETTE.white}"/>
      <rect x="-200" y="-80" width="400" height="10" fill="#f5e7d3" opacity="0.6"/>
      <!-- Matcha stripe (diagonal) -->
      <polygon points="-200,-80 200,-80 0,30" fill="${PALETTE.jade}"/>
      <polygon points="-200,-80 200,-80 100,0" fill="#1d4a30"/>
      <!-- Matcha powder dust -->
      ${Array.from({ length: 50 }, () => chiliDots(-180 + Math.random() * 360, -80 + Math.random() * 110, PALETTE.jade)).join("")}
    </g>
    <!-- Cinnamon shadow ring -->
    <ellipse cx="800" cy="700" rx="280" ry="40" fill="#8a4513" opacity="0.15"/>
  `),
  thumb: () => svg(800, 800, `
    <rect width="800" height="800" fill="${PALETTE.bone}"/>
    <ellipse cx="400" cy="420" rx="320" ry="120" fill="${PALETTE.cream}"/>
    <g transform="translate(400 420)">
      <rect x="-160" y="-30" width="320" height="120" fill="${PALETTE.cream}"/>
      <rect x="-160" y="-60" width="320" height="30" fill="${PALETTE.white}"/>
      <polygon points="-160,-60 160,-60 0,30" fill="${PALETTE.jade}"/>
    </g>
  `),
  phone: () => svg(1200, 1500, `
    <rect width="1200" height="1500" fill="${PALETTE.bone}"/>
    <ellipse cx="600" cy="700" rx="480" ry="180" fill="${PALETTE.cream}"/>
    <g transform="translate(600 700)">
      <rect x="-200" y="-50" width="400" height="160" fill="${PALETTE.cream}"/>
      <rect x="-200" y="-80" width="400" height="30" fill="${PALETTE.white}"/>
      <polygon points="-200,-80 200,-80 0,30" fill="${PALETTE.jade}"/>
    </g>
  `),
};

/* =========================================================================
   GENERIC FALLBACK (when slug doesn't match)
   Editorial brand mark, not a blank box.
   ========================================================================= */
const Generic: RecipeArt = {
  hero: () => svg(1600, 1200, `
    <rect width="1600" height="1200" fill="${PALETTE.bone}"/>
    <ellipse cx="800" cy="660" rx="640" ry="220" fill="${PALETTE.bone200}"/>
    <circle cx="800" cy="600" r="180" fill="${PALETTE.chili}"/>
    <circle cx="800" cy="600" r="120" fill="${PALETTE.bone50}"/>
    <text x="800" y="620" font-family="Georgia, serif" font-size="80" font-weight="600" fill="${PALETTE.chili}" text-anchor="middle">M</text>
    <text x="800" y="900" font-family="Georgia, serif" font-size="56" font-weight="600" fill="${PALETTE.ink}" text-anchor="middle">Mestizo Umami</text>
    <text x="800" y="950" font-family="Inter, sans-serif" font-size="20" letter-spacing="6" fill="${PALETTE.inkMuted}" text-anchor="middle">THE TRILINGUAL KITCHEN</text>
  `),
  thumb: () => svg(800, 800, `
    <rect width="800" height="800" fill="${PALETTE.bone}"/>
    <circle cx="400" cy="400" r="160" fill="${PALETTE.chili}"/>
    <circle cx="400" cy="400" r="100" fill="${PALETTE.bone50}"/>
    <text x="400" y="425" font-family="Georgia, serif" font-size="80" font-weight="600" fill="${PALETTE.chili}" text-anchor="middle">M</text>
    <text x="400" y="640" font-family="Georgia, serif" font-size="40" font-weight="600" fill="${PALETTE.ink}" text-anchor="middle">Mestizo Umami</text>
  `),
  phone: () => svg(1200, 1500, `
    <rect width="1200" height="1500" fill="${PALETTE.bone}"/>
    <circle cx="600" cy="600" r="200" fill="${PALETTE.chili}"/>
    <circle cx="600" cy="600" r="130" fill="${PALETTE.bone50}"/>
    <text x="600" y="630" font-family="Georgia, serif" font-size="100" font-weight="600" fill="${PALETTE.chili}" text-anchor="middle">M</text>
    <text x="600" y="1000" font-family="Georgia, serif" font-size="48" font-weight="600" fill="${PALETTE.ink}" text-anchor="middle">Mestizo Umami</text>
  `),
};

/* Public dispatch */
const ART: Record<string, RecipeArt> = {
  "miso-mole-short-rib-tacos": Tacos,
  "kimchi-elote": Elote,
  "yuzu-aguachile-hamachi": Hamachi,
  "al-pastor-bao": Bao,
  "ramen-pozole-rojo": Ramen,
  "chamoy-furikake-popcorn": Popcorn,
  "miso-mezcal-flan": Flan,
  "tamarindo-shoyu-glazed-wings": Wings,
  "horchata-tres-leches-matcha": Matcha,
};

export function fallbackFor(slug: string, size: ArtSize): string {
  const exact = ART[slug];
  const art = exact ?? Generic;
  let raw: string;
  switch (size) {
    case "hero": raw = art.hero(); break;
    case "thumb": raw = art.thumb(); break;
    case "phone": raw = art.phone(); break;
  }
  return encodeSvg(raw);
}
