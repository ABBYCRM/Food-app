const fs = require('fs');

const p1 = fs.readFileSync('lunch-1.txt', 'utf8');
// part 1 ends with `];` which we need to replace with `,`
const p1fixed = p1.replace(/\];\s*$/, ',\n');

const p2 = fs.readFileSync('lunch-2.txt', 'utf8');
// part 2 starts with `export const lunchRecipesPart2 = [` and ends with `];`
const p2fixed = p2.replace(/^export const lunchRecipesPart2 = \[\n/, '').replace(/\];\s*$/, ',\n');

const p3 = fs.readFileSync('lunch-3.txt', 'utf8');
// part 3 starts with `export const lunchRecipesPart3 = [` and ends with `];`
const p3fixed = p3.replace(/^export const lunchRecipesPart3 = \[\n/, '').replace(/\];\s*$/, '\n];\n');

fs.writeFileSync('artifacts/mestizo-umami/src/data/lunch-recipes.ts', p1fixed + p2fixed + p3fixed);
