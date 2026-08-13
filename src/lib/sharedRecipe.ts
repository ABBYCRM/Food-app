export type SharedRecipe = {
  title: string;
  subtitle: string;
  story: string;
  ingredients: string[];
  method: string[];
  serves: number;
  minutes: number;
  forkedFrom?: string;
};

const MAX_FRAGMENT_LENGTH = 300_000;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 8_192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8_192));
  }
  return btoa(binary);
}

function boundedString(value: unknown, max: number, required = false): value is string {
  return typeof value === "string" && value.length <= max && (!required || value.trim().length > 0);
}

function boundedStringList(value: unknown, count: number, itemLength: number): value is string[] {
  return Array.isArray(value)
    && value.length <= count
    && value.every((item) => boundedString(item, itemLength, true));
}

export function portableSharedRecipe(value: SharedRecipe): SharedRecipe {
  return {
    title: value.title,
    subtitle: value.subtitle,
    story: value.story,
    ingredients: [...value.ingredients],
    method: [...value.method],
    serves: value.serves,
    minutes: value.minutes,
    ...(value.forkedFrom ? { forkedFrom: value.forkedFrom } : {}),
  };
}

export function encodeSharedRecipe(value: SharedRecipe): string {
  const bytes = new TextEncoder().encode(JSON.stringify(portableSharedRecipe(value)));
  const encoded = bytesToBase64(bytes)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
  if (encoded.length > MAX_FRAGMENT_LENGTH) {
    throw new Error("This recipe is too large for a share link");
  }
  return encoded;
}

export function decodeSharedRecipe(fragment: string): SharedRecipe | null {
  if (!fragment || fragment.length > MAX_FRAGMENT_LENGTH || !/^[A-Za-z0-9_-]+$/.test(fragment)) return null;
  try {
    const padding = "=".repeat((4 - fragment.length % 4) % 4);
    const binary = atob(fragment.replaceAll("-", "+").replaceAll("_", "/") + padding);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    if (!boundedString(parsed.title, 200, true)) return null;
    if (!boundedString(parsed.subtitle, 500)) return null;
    if (!boundedString(parsed.story, 10_000)) return null;
    if (!boundedStringList(parsed.ingredients, 200, 2_000)) return null;
    if (!boundedStringList(parsed.method, 100, 5_000)) return null;
    if (!Number.isInteger(parsed.serves) || Number(parsed.serves) < 1 || Number(parsed.serves) > 50) return null;
    if (!Number.isInteger(parsed.minutes) || Number(parsed.minutes) < 1 || Number(parsed.minutes) > 2_000) return null;
    if (parsed.forkedFrom !== undefined && (
      !boundedString(parsed.forkedFrom, 260, true) || !slugPattern.test(parsed.forkedFrom)
    )) return null;

    return {
      title: parsed.title,
      subtitle: parsed.subtitle,
      story: parsed.story,
      ingredients: parsed.ingredients,
      method: parsed.method,
      serves: Number(parsed.serves),
      minutes: Number(parsed.minutes),
      ...(typeof parsed.forkedFrom === "string" ? { forkedFrom: parsed.forkedFrom } : {}),
    };
  } catch {
    return null;
  }
}
