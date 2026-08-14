import type { IllustrationKey } from "@/components/plating-illustrations";

export interface PlatingStep {
  illustration: IllustrationKey;
  caption: string;   // Short instructional text extracted from the method step
  fullText: string;  // Original method text
  stepNum: number;
}

// ─── Keyword → illustration map (ordered: more specific first) ────────────────

const RULES: Array<{ patterns: RegExp; illus: IllustrationKey }> = [
  // Eggs — must come before generic "place / top" rules
  { patterns: /sunny.side|sunny side/i,               illus: "egg-sunny"       },
  { patterns: /over.easy|flip.*(egg|the)/i,           illus: "egg-overeasy"    },
  { patterns: /fry.*(egg|them)|fried egg/i,           illus: "egg-overeasy"    },
  { patterns: /poach/i,                               illus: "egg-poach"       },
  // Avocado
  { patterns: /avocado|guacamole/i,                   illus: "avocado-fan"     },
  // Taco / wrap
  { patterns: /fold.*taco|taco.*fold|wrap|burrito/i,  illus: "taco-fold"       },
  // Bowl / broth
  { patterns: /ladle.*(broth|soup|into bowl)|pour.*(broth|dashi|soup)/i, illus: "broth-pour" },
  { patterns: /bowl|ramen|pozole|soup/i,              illus: "bowl-build"      },
  // Ladle / pour sauce
  { patterns: /ladle|spoon.*(over|sauce|mole|salsa)|pour.*(salsa|mole|sauce|over)/i, illus: "ladle-pour" },
  // Drizzle
  { patterns: /drizzle/i,                             illus: "drizzle"         },
  // Crema / sour cream
  { patterns: /crema|sour cream|crème/i,              illus: "crema-swirl"     },
  // Lime / citrus
  { patterns: /squeeze.*(lime|lemon)|lime.*(wedge|squeeze)|finish.*(lime|lemon)/i, illus: "lime-squeeze" },
  // Garnish / crumble cheese
  { patterns: /garnish|queso|cotija|crumble|crumbled|sprinkle.*(cheese|cotija)/i, illus: "garnish-crumble" },
  // Herb scatter
  { patterns: /cilantro|parsley|shiso|scallion|green onion|herb|nori|furikake/i, illus: "herb-scatter" },
  // Sesame / seeds
  { patterns: /sesame|pepita|pine nut|seed/i,         illus: "sesame-top"      },
  // Beans spread
  { patterns: /bean|refried|black bean|pinto/i,       illus: "beans-spread"    },
  // Spread / smear
  { patterns: /spread|smear/i,                        illus: "spread-base"     },
  // Tortilla base
  { patterns: /tortilla|tostada|totopos/i,             illus: "tortilla-base"   },
  // Protein slice / fan
  { patterns: /slice|sliced|rest.*and cut|cut.*and (serve|arrange|fan)/i, illus: "slice-protein" },
  // Layer stack
  { patterns: /layer|stack|assemble/i,                illus: "layer-stack"     },
  // Generic plate / serve / top / divide
  { patterns: /plate|arrange|divide.*between|top with|place.*(on|over|atop)|serve/i, illus: "plate-present" },
];

// ─── Assembly step detector ────────────────────────────────────────────────────

const ASSEMBLY_KEYWORDS =
  /place|top with|arrange|layer|stack|divide|ladle|spoon over|pour.*over|garnish|scatter|sprinkle|fold|wrap|serve|plate|assemble|spread|drizzle|crumble|squeeze|finish with|add.*(on top|over)/i;

const COOKING_ONLY_KEYWORDS =
  /^(heat|preheat|season|marinate|mix|whisk|blend|reduce|simmer|boil|bring|roast|bake|sear|cover|refrigerate|let rest|allow|toast|rehydrate|render|sweat)/i;

function isAssemblyStep(text: string): boolean {
  return ASSEMBLY_KEYWORDS.test(text) && !COOKING_ONLY_KEYWORDS.test(text.trim());
}

function matchIllustration(text: string): IllustrationKey {
  for (const rule of RULES) {
    if (rule.patterns.test(text)) return rule.illus;
  }
  return "plate-present"; // safe fallback
}

/**
 * Short caption: the first imperative clause (up to 60 chars).
 * Strips measurements and quantity references to focus on the action.
 */
function makeCaption(text: string): string {
  // Take up to first sentence or 70 chars
  const firstSentence = text.split(/[.;]/)[0].trim();
  // Remove quantity references like "2 tbsp" "1/2 cup"
  const clean = firstSentence
    .replace(/\b\d+[\d\/\s]*(?:cup|tbsp|tsp|oz|lb|kg|g|ml|L|piece|clove|slice)s?\b/gi, "")
    .replace(/\b(the|a|an)\b\s+/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return clean.length > 72 ? clean.slice(0, 70).replace(/\s\S+$/, "") + "…" : clean;
}

// ─── Main export ───────────────────────────────────────────────────────────────

export interface RecipeMethodStep {
  step: number;
  text: string;
}

/**
 * Extracts plating/assembly steps from a recipe's method and maps each
 * to an illustration + caption. Returns 3–5 steps max.
 */
export function extractPlatingSteps(method: RecipeMethodStep[]): PlatingStep[] {
  if (!method || method.length === 0) return [];

  // Phase 1: find all assembly steps
  let assembly = method.filter((s) => isAssemblyStep(s.text));

  // Phase 2: if fewer than 2 assembly steps detected, take the last 3 steps
  if (assembly.length < 2) {
    assembly = method.slice(-Math.min(4, method.length));
  }

  // Phase 3: cap at 5 steps, prefer the last ones
  if (assembly.length > 5) assembly = assembly.slice(-5);

  // Phase 4: de-duplicate illustrations (prefer earlier occurrence)
  const seen = new Set<IllustrationKey>();
  const deduped: typeof assembly = [];
  for (const step of assembly) {
    const illus = matchIllustration(step.text);
    if (!seen.has(illus)) {
      seen.add(illus);
      deduped.push(step);
    } else {
      // Keep it but try next best
      deduped.push(step);
    }
  }

  return deduped.map((step) => ({
    illustration: matchIllustration(step.text),
    caption: makeCaption(step.text),
    fullText: step.text,
    stepNum: step.step,
  }));
}
