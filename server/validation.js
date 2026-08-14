import { z } from "zod";
import { containsClientIdentity } from "./security.js";

const localeSchema = z.enum(["en", "es", "pt"]);
const allergenSchema = z.enum([
  "gluten", "soy", "sesame", "dairy", "egg", "fish", "shellfish", "nuts", "pork", "alcohol",
]);
const dietarySchema = z.enum(["vegetarian", "vegan", "pescatarian", "glutenFree", "dairyFree", "pork"]);
const slugSchema = z.string().min(1).max(260).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const workspaceSchema = z.object({
  locale: localeSchema,
  zip: z.string().trim().max(16).regex(/^[0-9A-Za-z -]*$/),
  favorites: z.array(slugSchema).max(500),
  notesByRecipe: z.record(slugSchema, z.string().max(10_000)),
  planner: z.record(z.string().regex(/^\d{4}-\d{2}-\d{2}$/), slugSchema),
  avoiding: z.array(allergenSchema).max(20),
  dietary: z.array(dietarySchema).max(20),
}).strict();

export const defaultWorkspace = Object.freeze({
  locale: "en",
  zip: "",
  favorites: [],
  notesByRecipe: {},
  planner: {},
  avoiding: [],
  dietary: [],
});

export const recipeCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  subtitle: z.string().trim().max(500).default(""),
  story: z.string().trim().max(10_000).default(""),
  ingredients: z.array(z.string().trim().min(1).max(2_000)).max(200),
  method: z.array(z.string().trim().min(1).max(5_000)).max(100),
  serves: z.number().int().min(1).max(50),
  minutes: z.number().int().min(1).max(2_000),
  forkedFrom: slugSchema.optional(),
}).strict();

export const recipeUpdateSchema = recipeCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one recipe field is required",
);

const portableRecipeSchema = recipeCreateSchema.extend({
  id: z.string().uuid().optional(),
  createdAt: z.number().finite().optional(),
}).strict().transform(({ id: _id, createdAt: _createdAt, ...recipe }) => recipe);

export const importSchema = z.object({
  workspace: workspaceSchema,
  recipes: z.array(portableRecipeSchema).max(1_000),
}).strict();

export const affiliateClickSchema = z.object({
  vendor: z.enum(["amazon", "walmart", "instacart"]),
  destinationHost: z.enum([
    "amazon.com", "www.amazon.com", "walmart.com", "www.walmart.com",
    "instacart.com", "www.instacart.com", "connect.instacart.com",
  ]),
  itemCount: z.number().int().min(1).max(1_000),
}).strict();

const instacartIngredientSchema = z.object({
  name: z.string().trim().min(1).max(200),
  displayText: z.string().trim().min(1).max(300).optional(),
  quantity: z.number().finite().positive().max(100_000).optional(),
  unit: z.enum([
    "cup", "milliliter", "liter", "tablespoon", "teaspoon", "gram", "kilogram",
    "ounce", "pound", "each", "bunch", "can", "ears", "head", "package", "packet",
  ]).optional(),
}).strict().refine(
  (value) => (value.quantity === undefined) === (value.unit === undefined),
  "quantity and unit must be supplied together",
);

const instacartBase = {
  title: z.string().trim().min(1).max(200),
  ingredients: z.array(instacartIngredientSchema).min(1).max(100),
  partnerLinkbackUrl: z.string().url().max(2_048).optional(),
};

export const instacartShoppingSchema = z.discriminatedUnion("mode", [
  z.object({
    ...instacartBase,
    mode: z.literal("list"),
  }).strict(),
  z.object({
    ...instacartBase,
    mode: z.literal("recipe"),
    servings: z.number().int().min(1).max(1_000).optional(),
    cookingTime: z.number().int().min(1).max(100_000).optional(),
    externalReferenceId: z.string().trim().min(1).max(200).optional(),
    instructions: z.array(z.string().trim().min(1).max(1_000)).max(100).optional(),
  }).strict(),
]);

export const checkoutCompleteSchema = z.object({
  sessionId: z.string().min(8).max(255),
}).strict();

export function parseClientInput(schema, value) {
  if (containsClientIdentity(value)) {
    return { success: false, error: "Tenant identity must not be supplied by the client" };
  }
  const result = schema.safeParse(value);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues.map((issue) => `${issue.path.join(".") || "input"}: ${issue.message}`).join("; "),
    };
  }
  return { success: true, data: result.data };
}
