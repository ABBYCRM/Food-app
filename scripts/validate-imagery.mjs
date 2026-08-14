import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_ROOT = join(ROOT, "public", "img");

const RECIPE_SLUGS = [
  "miso-mole-short-rib-tacos",
  "kimchi-elote",
  "yuzu-aguachile-hamachi",
  "al-pastor-bao",
  "ramen-pozole-rojo",
  "chamoy-furikake-popcorn",
  "miso-mezcal-flan",
  "tamarindo-shoyu-glazed-wings",
  "horchata-tres-leches-matcha",
];

const PANTRY_SLUGS = [
  "soy-sauce", "dried-chiles", "ginger", "corn-masa",
  "miso", "lime-yuzu", "kombu", "agave",
];

const TECHNIQUE_SLUGS = ["chile-bloom", "dashi-meets-caldo", "tortilla-press"];

function jpegDimensions(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) throw new Error("not a JPEG");
  let offset = 2;
  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }
    const length = buffer.readUInt16BE(offset + 2);
    if (length < 2) throw new Error("invalid JPEG segment");
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += length + 2;
  }
  throw new Error("JPEG dimensions not found");
}

const expected = [
  ...RECIPE_SLUGS.flatMap((slug) => [
    { path: join("recipes", `${slug}-hero.jpg`), width: 1448, height: 1086 },
    { path: join("recipes", `${slug}-thumb.jpg`), width: 960, height: 960 },
  ]),
  ...PANTRY_SLUGS.map((slug) => ({ path: join("pantry", `${slug}.jpg`), width: 1448, height: 1086 })),
  ...TECHNIQUE_SLUGS.map((slug) => ({ path: join("techniques", `${slug}.jpg`), width: 1448, height: 1086 })),
];

const errors = [];
const hashes = new Map();

for (const asset of expected) {
  const absolute = join(IMAGE_ROOT, asset.path);
  try {
    const bytes = await readFile(absolute);
    if (bytes.length < 50_000) errors.push(`${asset.path}: suspiciously small (${bytes.length} bytes)`);
    const dimensions = jpegDimensions(bytes);
    if (dimensions.width !== asset.width || dimensions.height !== asset.height) {
      errors.push(`${asset.path}: expected ${asset.width}×${asset.height}, got ${dimensions.width}×${dimensions.height}`);
    }
    const hash = createHash("sha256").update(bytes).digest("hex");
    const duplicate = hashes.get(hash);
    if (duplicate) errors.push(`${asset.path}: duplicate of ${duplicate}`);
    else hashes.set(hash, asset.path);
  } catch (error) {
    errors.push(`${asset.path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (errors.length > 0) {
  console.error("Imagery validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Imagery validation passed: ${expected.length} vendored assets.`);
}
