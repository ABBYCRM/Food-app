#!/usr/bin/env python3
"""
Enhance all recipe method steps across 4 data files.
Calls OpenAI API (via Replit proxy) to rewrite each recipe's method with:
- Exact quantities from the ingredients list referenced in each step
- Temperatures, timings, pan sizes, visual doneness cues
- 5-7 clear steps a home cook can actually follow
Processes all 4 files in parallel threads, batching 3 recipes per API call.
"""

import os, re, json, time, threading, textwrap
from urllib import request, error as urlerror

BASE_URL = os.environ["AI_INTEGRATIONS_OPENAI_BASE_URL"].rstrip("/")
API_KEY  = os.environ["AI_INTEGRATIONS_OPENAI_API_KEY"]
MODEL    = "gpt-5.6-luna"   # fast + cheap for high-volume rewrite task
BATCH    = 3                # recipes per API call
CONC     = 4                # concurrent API calls per file thread

FILES = [
    "artifacts/mestizo-umami/src/data/breakfast-recipes.ts",
    "artifacts/mestizo-umami/src/data/lunch-recipes.ts",
    "artifacts/mestizo-umami/src/data/dinner-recipes.ts",
    "artifacts/mestizo-umami/src/data/snack-recipes.ts",
]

# ── helpers ──────────────────────────────────────────────────────────────────

def parse_recipes(content: str) -> list[dict]:
    """
    Extract every recipe's slug, title, ingredients, and method from the TS file.
    Returns list of dicts with keys: slug, title, ingredients_text, method_text,
    method_start, method_end (character positions in content).
    """
    results = []

    # Find all recipe blocks by locating each `slug:` + crawling to closing `},`
    for m in re.finditer(r'slug:\s*"([^"]+)"', content):
        slug = m.group(1)
        block_start = m.start()

        # title
        title_m = re.search(r'title:\s*"([^"]+)"', content[block_start:block_start+400])
        title = title_m.group(1) if title_m else slug

        # ingredients block
        ing_m = re.search(
            r'ingredients:\s*\[(.*?)\]',
            content[block_start:block_start+3000],
            re.DOTALL
        )
        ingredients_text = ing_m.group(1).strip() if ing_m else ""

        # method block — find absolute positions in content
        rel_method = re.search(
            r'method:\s*\[',
            content[block_start:block_start+3000]
        )
        if not rel_method:
            continue

        method_open = block_start + rel_method.end() - 1   # position of '['
        # walk to matching ']'
        depth = 0
        i = method_open
        while i < len(content):
            if content[i] == '[': depth += 1
            elif content[i] == ']':
                depth -= 1
                if depth == 0:
                    method_close = i   # position of ']'
                    break
            i += 1
        else:
            continue

        method_text = content[method_open+1:method_close].strip()
        results.append({
            "slug": slug,
            "title": title,
            "ingredients_text": ingredients_text,
            "method_text": method_text,
            "method_open": method_open,   # index of '[' in content
            "method_close": method_close, # index of ']' in content
        })

    return results


def parse_ingredients(ing_text: str) -> list[str]:
    """Turn raw TS ingredient objects into readable strings for the prompt."""
    lines = []
    for m in re.finditer(
        r'qty:\s*"([^"]*)".*?unit:\s*"([^"]*)".*?item:\s*"([^"]*)"(?:.*?note:\s*"([^"]*)")?',
        ing_text, re.DOTALL
    ):
        qty, unit, item, note = m.groups()
        part = f"{qty} {unit} {item}".strip()
        if note:
            part += f" ({note})"
        lines.append(part)
    return lines


def call_openai(messages: list[dict], retries=5) -> str:
    payload = json.dumps({
        "model": MODEL,
        "max_completion_tokens": 4096,
        "messages": messages,
    }).encode()

    for attempt in range(retries):
        try:
            req = request.Request(
                f"{BASE_URL}/chat/completions",
                data=payload,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {API_KEY}",
                },
                method="POST"
            )
            with request.urlopen(req, timeout=90) as resp:
                body = json.loads(resp.read())
                return body["choices"][0]["message"]["content"]
        except Exception as e:
            wait = 2 ** attempt
            print(f"  [retry {attempt+1}/{retries}] {e} — waiting {wait}s")
            time.sleep(wait)
    raise RuntimeError(f"API failed after {retries} retries")


def build_method_ts(steps: list[dict]) -> str:
    """Convert a list of {step, text} dicts back to TS array contents."""
    parts = []
    for s in steps:
        text = s["text"].replace('"', '\\"')
        parts.append(f'      {{ step: {s["step"]}, text: "{text}" }}')
    return "\n" + ",\n".join(parts) + "\n    "


def enhance_batch(recipes: list[dict]) -> list[list[dict]]:
    """Call AI once for a batch of recipes; return list of step arrays."""
    items = []
    for r in recipes:
        ings = parse_ingredients(r["ingredients_text"])
        ing_str = "\n".join(f"  - {i}" for i in ings) if ings else "(see recipe)"
        items.append(
            f'RECIPE {recipes.index(r)+1}: {r["title"]}\n'
            f'Ingredients:\n{ing_str}\n'
            f'Current steps:\n{r["method_text"]}'
        )

    prompt = textwrap.dedent(f"""
        You are a professional recipe editor. For each recipe below, rewrite
        its cooking method as 5–7 clear, detailed steps that a home cook can
        follow without guessing.

        Rules (apply to ALL recipes):
        1. Every step must reference the EXACT quantities from the ingredients list
           (e.g. "add the 2 tbsp white miso paste", not "add some miso").
        2. Include oven/pan temperatures, timing, and visual doneness cues.
        3. Mention pan/dish sizes where relevant (e.g. "10-inch skillet",
           "9×13 baking dish").
        4. Split compound actions into their own steps if they are distinct tasks.
        5. Write in second-person imperative ("Heat...", "Add...", "Stir...").
        6. Each step text must be a single complete English sentence (or two if
           genuinely inseparable), 60–160 characters long.
        7. Do NOT add ingredients not in the list; do NOT change cooking times or
           temperatures unless the current ones are obviously wrong.

        Return ONLY a JSON array of arrays, one inner array per recipe, each
        inner array containing objects with "step" (integer, 1-based) and "text"
        (string). No markdown fences, no explanation — raw JSON only.

        Example output format for 2 recipes with 3 steps each:
        [
          [
            {{"step": 1, "text": "Heat a 12-inch skillet over medium-high heat and add the 2 tbsp olive oil."}},
            {{"step": 2, "text": "Add the 4 garlic cloves, minced, and sauté for 1 minute until fragrant and golden."}},
            {{"step": 3, "text": "Stir in the 1 can diced tomatoes and simmer for 10 minutes until slightly thickened."}}
          ],
          [
            {{"step": 1, "text": "Preheat oven to 400°F (200°C) and line a baking sheet with parchment paper."}},
            {{"step": 2, "text": "Toss the 2 cups broccoli florets with the 1 tbsp olive oil, salt, and pepper."}},
            {{"step": 3, "text": "Spread in a single layer and roast for 20 minutes until edges are crispy and charred."}}
          ]
        ]

        Recipes to process:

        {chr(10).join(f"---{chr(10)}{item}" for item in items)}
    """).strip()

    content = call_openai([{"role": "user", "content": prompt}])

    # strip any accidental markdown fences
    content = re.sub(r'^```[a-z]*\n?', '', content.strip())
    content = re.sub(r'\n?```$', '', content.strip())

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        # try to salvage — find the outermost [ ... ]
        m = re.search(r'\[\s*\[', content)
        if m:
            end = content.rfind(']') + 1
            parsed = json.loads(content[m.start():end])
        else:
            raise

    return parsed


# ── per-file processor ───────────────────────────────────────────────────────

def process_file(filepath: str, lock: threading.Lock, counters: dict):
    full_path = f"/home/runner/workspace/{filepath}"
    fname = filepath.split("/")[-1]

    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()

    recipes = parse_recipes(content)
    print(f"[{fname}] {len(recipes)} recipes found")

    # Process in batches, collecting (method_open, method_close, new_inner) tuples
    replacements = []  # list of (method_open, method_close, new_inner_ts)
    sem = threading.Semaphore(CONC)

    batch_results = [None] * ((len(recipes) + BATCH - 1) // BATCH)
    threads = []

    def do_batch(batch_idx: int, batch: list[dict]):
        with sem:
            try:
                result = enhance_batch(batch)
                batch_results[batch_idx] = result
                print(f"  [{fname}] batch {batch_idx+1} done ({len(batch)} recipes)")
            except Exception as e:
                print(f"  [{fname}] batch {batch_idx+1} ERROR: {e}")
                batch_results[batch_idx] = None

    for bi, start in enumerate(range(0, len(recipes), BATCH)):
        batch = recipes[start:start+BATCH]
        t = threading.Thread(target=do_batch, args=(bi, batch))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    # Collect replacements (in reverse order so positions don't shift)
    for bi, start in enumerate(range(0, len(recipes), BATCH)):
        batch = recipes[start:start+BATCH]
        result = batch_results[bi]
        if result is None:
            print(f"  [{fname}] skipping batch {bi+1} due to error")
            continue
        for ri, (recipe, steps) in enumerate(zip(batch, result)):
            if not steps:
                continue
            new_inner = build_method_ts(steps)
            replacements.append((recipe["method_open"], recipe["method_close"], new_inner))

    # Apply replacements in reverse order (highest position first)
    replacements.sort(key=lambda x: x[0], reverse=True)
    new_content = content
    applied = 0
    for m_open, m_close, new_inner in replacements:
        new_content = new_content[:m_open+1] + new_inner + new_content[m_close:]
        applied += 1

    with open(full_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    with lock:
        counters["total"] += applied
    print(f"[{fname}] ✓ {applied} recipes enhanced and written")


# ── main ─────────────────────────────────────────────────────────────────────

def main():
    lock = threading.Lock()
    counters = {"total": 0}
    threads = []

    for filepath in FILES:
        t = threading.Thread(target=process_file, args=(filepath, lock, counters))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    print(f"\n✅ Done — {counters['total']} recipes enhanced across {len(FILES)} files")


if __name__ == "__main__":
    main()
