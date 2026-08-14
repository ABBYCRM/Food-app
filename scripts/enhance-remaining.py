#!/usr/bin/env python3
"""
Second pass: enhance only the recipes whose steps are still thin (<80 chars avg).
Runs with lower concurrency (2) to avoid 429s.
"""

import os, re, json, time, threading
from urllib import request

BASE_URL = os.environ["AI_INTEGRATIONS_OPENAI_BASE_URL"].rstrip("/")
API_KEY  = os.environ["AI_INTEGRATIONS_OPENAI_API_KEY"]
MODEL    = "gpt-5.6-luna"
BATCH    = 2       # smaller batches
CONC     = 2       # lower concurrency

FILES = [
    "artifacts/mestizo-umami/src/data/breakfast-recipes.ts",
    "artifacts/mestizo-umami/src/data/lunch-recipes.ts",
    "artifacts/mestizo-umami/src/data/dinner-recipes.ts",
    "artifacts/mestizo-umami/src/data/snack-recipes.ts",
]

def parse_recipes(content):
    results = []
    for m in re.finditer(r'slug:\s*"([^"]+)"', content):
        slug = m.group(1)
        block_start = m.start()
        title_m = re.search(r'title:\s*"([^"]+)"', content[block_start:block_start+400])
        title = title_m.group(1) if title_m else slug
        ing_m = re.search(r'ingredients:\s*\[(.*?)\]', content[block_start:block_start+3000], re.DOTALL)
        ingredients_text = ing_m.group(1).strip() if ing_m else ""
        rel_method = re.search(r'method:\s*\[', content[block_start:block_start+3000])
        if not rel_method:
            continue
        method_open = block_start + rel_method.end() - 1
        depth, i = 0, method_open
        while i < len(content):
            if content[i] == '[': depth += 1
            elif content[i] == ']':
                depth -= 1
                if depth == 0:
                    method_close = i
                    break
            i += 1
        else:
            continue
        method_text = content[method_open+1:method_close].strip()
        results.append({
            "slug": slug, "title": title,
            "ingredients_text": ingredients_text,
            "method_text": method_text,
            "method_open": method_open, "method_close": method_close,
        })
    return results

def parse_ingredients(ing_text):
    lines = []
    for m in re.finditer(
        r'qty:\s*"([^"]*)".*?unit:\s*"([^"]*)".*?item:\s*"([^"]*)"(?:.*?note:\s*"([^"]*)")?',
        ing_text, re.DOTALL):
        qty, unit, item, note = m.groups()
        part = f"{qty} {unit} {item}".strip()
        if note: part += f" ({note})"
        lines.append(part)
    return lines

def is_thin(recipe):
    steps = re.findall(r'text:\s*"([^"]+)"', recipe["method_text"])
    return steps and any(len(s) < 80 for s in steps[:5])

def call_openai(messages, retries=6):
    payload = json.dumps({"model": MODEL, "max_completion_tokens": 4096, "messages": messages}).encode()
    for attempt in range(retries):
        try:
            req = request.Request(
                f"{BASE_URL}/chat/completions", data=payload,
                headers={"Content-Type":"application/json","Authorization":f"Bearer {API_KEY}"},
                method="POST")
            with request.urlopen(req, timeout=90) as resp:
                return json.loads(resp.read())["choices"][0]["message"]["content"]
        except Exception as e:
            wait = 3 * (2 ** attempt)
            print(f"  [retry {attempt+1}/{retries}] {e} — waiting {wait}s")
            time.sleep(wait)
    raise RuntimeError("API failed after retries")

def enhance_batch(recipes):
    items = []
    for r in recipes:
        ings = parse_ingredients(r["ingredients_text"])
        ing_str = "\n".join(f"  - {i}" for i in ings) or "(see recipe)"
        items.append(
            f'RECIPE {recipes.index(r)+1}: {r["title"]}\n'
            f'Ingredients:\n{ing_str}\n'
            f'Current steps (to be improved):\n{r["method_text"]}'
        )

    prompt = (
        "You are a professional recipe editor. For each recipe, rewrite the cooking method "
        "as 5–7 clear, detailed steps a home cook can follow.\n\n"
        "Rules:\n"
        "1. Reference EXACT quantities from the ingredients list in each step.\n"
        "2. Include oven/pan temperatures, timing, and visual doneness cues.\n"
        "3. Mention pan/dish sizes where relevant.\n"
        "4. Write in second-person imperative ('Heat...', 'Add...', 'Stir...').\n"
        "5. Each step: 60–160 chars, one clear action.\n"
        "6. Do NOT add ingredients not in the list.\n\n"
        "Return ONLY a JSON array of arrays, one inner array per recipe, each with "
        "{\"step\": N, \"text\": \"...\"}. No markdown, no explanation — raw JSON only.\n\n"
        "Recipes:\n\n" +
        "\n---\n".join(items)
    )

    content = call_openai([{"role": "user", "content": prompt}])
    content = re.sub(r'^```[a-z]*\n?', '', content.strip())
    content = re.sub(r'\n?```$', '', content.strip())
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        m = re.search(r'\[\s*\[', content)
        if m:
            end = content.rfind(']') + 1
            return json.loads(content[m.start():end])
        raise

def build_method_ts(steps):
    parts = []
    for s in steps:
        text = s["text"].replace('"', '\\"')
        parts.append(f'      {{ step: {s["step"]}, text: "{text}" }}')
    return "\n" + ",\n".join(parts) + "\n    "

def process_file(filepath, lock, counters):
    full_path = f"/home/runner/workspace/{filepath}"
    fname = filepath.split("/")[-1]
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()

    all_recipes = parse_recipes(content)
    thin = [r for r in all_recipes if is_thin(r)]
    print(f"[{fname}] {len(thin)} thin recipes to enhance")
    if not thin:
        print(f"[{fname}] nothing to do")
        return

    sem = threading.Semaphore(CONC)
    batch_results = [None] * ((len(thin) + BATCH - 1) // BATCH)
    threads = []

    def do_batch(bi, batch):
        with sem:
            try:
                time.sleep(bi * 0.5)   # stagger starts slightly
                result = enhance_batch(batch)
                batch_results[bi] = result
                print(f"  [{fname}] batch {bi+1} done ({len(batch)} recipes)")
            except Exception as e:
                print(f"  [{fname}] batch {bi+1} ERROR: {e}")

    for bi, start in enumerate(range(0, len(thin), BATCH)):
        batch = thin[start:start+BATCH]
        t = threading.Thread(target=do_batch, args=(bi, batch))
        threads.append(t)
        t.start()
    for t in threads:
        t.join()

    replacements = []
    for bi, start in enumerate(range(0, len(thin), BATCH)):
        batch = thin[start:start+BATCH]
        result = batch_results[bi]
        if not result:
            continue
        for recipe, steps in zip(batch, result):
            if not steps:
                continue
            replacements.append((recipe["method_open"], recipe["method_close"], build_method_ts(steps)))

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
    print(f"[{fname}] ✓ {applied} recipes enhanced")

def main():
    lock = threading.Lock()
    counters = {"total": 0}
    threads = []
    for fp in FILES:
        t = threading.Thread(target=process_file, args=(fp, lock, counters))
        threads.append(t)
        t.start()
    for t in threads:
        t.join()
    print(f"\n✅ Done — {counters['total']} additional recipes enhanced")

if __name__ == "__main__":
    main()
