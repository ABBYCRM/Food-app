---
name: Mestizo Umami recipe data architecture
description: How recipes are split across 4 TypeScript files and re-exported from recipes.ts
---
Recipe data in 4 category files (breakfast-recipes.ts, lunch-recipes.ts, dinner-recipes.ts, snack-recipes.ts), all imported and re-exported from recipes.ts. The Recipe interface mealSlots union must include "brunch" and "side" — the breakfast subagent added these.

Subagents writing large recipe files twice inserted stray `import` statements mid-array, causing TS1005 errors. Fix with Python: open file, drop any line containing "import" after line 5, rewrite.

**Why:** Subagents lose context mid-generation and insert stray lines. Always grep for stray imports inside arrays before typechecking.
**How to apply:** After any subagent writes a large data file, run: grep -n "^import" src/data/*.ts and remove any that appear after line 10.
