/**
 * User workspace & recipe routes — all operations scoped to req.user.id.
 *
 * GET  /api/workspace        → fetch user's saved workspace document
 * PUT  /api/workspace        → save workspace document
 * GET  /api/recipes          → list user's custom recipes
 * POST /api/recipes          → create a custom recipe
 * GET  /api/recipes/:id      → get one recipe (ownership verified)
 * PUT  /api/recipes/:id      → update recipe (ownership verified)
 * DELETE /api/recipes/:id    → delete recipe (ownership verified)
 * GET  /api/export           → export all user data
 * POST /api/import           → import user data
 *
 * POST /api/affiliate/click  → record an affiliate click
 * GET  /api/instacart/status → identify the supported Instacart link flow
 * POST /api/instacart/shopping → create Instacart shopping link
 */
import { Router } from "express";
import { z } from "zod";
import { repos } from "../lib/auth-repos.js";
import { requireEntitlement } from "../lib/entitlements.js";
import { containsClientIdentity } from "../lib/security.js";
import type { AuthMiddleware } from "./auth.js";
import type { InstacartService } from "../lib/instacart.js";
import { requestHash } from "../lib/instacart.js";

const recipeIdSchema = z.string().uuid();

const recipeBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  subtitle: z.string().trim().max(300).optional().transform((v) => v ?? ""),
  story: z.string().trim().max(5_000).optional().transform((v) => v ?? ""),
  ingredients: z.array(z.unknown()).min(1).max(200),
  method: z.array(z.unknown()).min(1).max(100),
  serves: z.number().int().min(1).max(50),
  minutes: z.number().int().min(1).max(2_000),
  forkedFrom: z.string().optional(),
}).strict();

const affiliateSchema = z.object({
  vendor: z.string().min(1).max(100),
  destinationHost: z.string().min(1).max(253),
  itemCount: z.number().int().min(1).max(10_000).optional().transform((v) => v ?? 1),
}).strict();

const instacartIngredient = z.object({
  name: z.string().trim().min(1).max(200),
  displayText: z.string().trim().min(1).max(300).optional(),
  quantity: z.number().finite().positive().max(100_000).optional(),
  unit: z.string().trim().min(1).max(40).optional(),
}).strict();

const instacartBaseSchema = z.object({
  title: z.string().trim().min(1).max(200),
  ingredients: z.array(instacartIngredient).min(1).max(100),
  partnerLinkbackUrl: z.string().url().max(2_048).optional(),
});

const instacartShoppingSchema = z.discriminatedUnion("mode", [
  instacartBaseSchema.extend({ mode: z.literal("list") }).strict(),
  instacartBaseSchema.extend({
    mode: z.literal("recipe"),
    servings: z.number().int().min(1).max(1_000).optional(),
    cookingTime: z.number().int().min(1).max(100_000).optional(),
    externalReferenceId: z.string().trim().min(1).max(200).optional(),
    instructions: z.array(z.string().trim().min(1).max(1_000)).max(100).optional(),
  }).strict(),
]);

const instacartRetailerQuerySchema = z.object({
  postalCode: z.string().trim().regex(/^\d{5}$|^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/),
  countryCode: z.enum(["US", "CA"]).default("US"),
}).strict();

function parseInput<T>(schema: z.ZodType<T>, body: unknown, res: import("express").Response): T | null {
  if (containsClientIdentity(body)) {
    res.status(400).json({ error: "Tenant identity must not be supplied by the client", code: "INVALID_INPUT" });
    return null;
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `${i.path.join(".") || "input"}: ${i.message}`).join("; ");
    res.status(400).json({ error: msg, code: "INVALID_INPUT" });
    return null;
  }
  return parsed.data;
}

export function createWorkspaceRouter(auth: AuthMiddleware, instacartService: InstacartService | null): Router {
  const router = Router();
  const protect = requireEntitlement();
  const instacartUnavailable = (res: import("express").Response) => res.status(503).json({
    available: false,
    connection: "not_required",
    error: "Instacart shopping is temporarily unavailable. Please try again later.",
    code: "INSTACART_UNAVAILABLE",
  });

  // All workspace routes require authentication
  router.use(auth.resolveAuthentication, auth.requireAuthentication);

  // ── Workspace ─────────────────────────────────────────────────────────────

  router.get("/workspace", protect, async (req, res, next) => {
    try {
      const doc = await repos.getWorkspaceForUser(req.user!.id);
      return res.json({ workspace: doc });
    } catch (err) { return next(err); }
  });

  router.put("/workspace", auth.requireCsrf, protect, async (req, res, next) => {
    try {
      if (containsClientIdentity(req.body)) {
        return res.status(400).json({ error: "Tenant identity must not be supplied by the client", code: "INVALID_INPUT" });
      }
      await repos.putWorkspaceForUser(req.user!.id, req.body);
      return res.json({ ok: true });
    } catch (err) { return next(err); }
  });

  // ── Recipes ───────────────────────────────────────────────────────────────

  router.get("/recipes", protect, async (req, res, next) => {
    try {
      const recipes = await repos.listRecipesForUser(req.user!.id);
      return res.json({ recipes });
    } catch (err) { return next(err); }
  });

  router.post("/recipes", auth.requireCsrf, protect, async (req, res, next) => {
    try {
      const data = parseInput(recipeBodySchema, req.body, res);
      if (!data) return;
      const recipe = await repos.createRecipeForUser(req.user!.id, data as Parameters<typeof repos.createRecipeForUser>[1]);
      return res.status(201).json({ recipe });
    } catch (err) { return next(err); }
  });

  router.get("/recipes/:id", protect, async (req, res, next) => {
    try {
      const idParsed = recipeIdSchema.safeParse(req.params["id"]);
      if (!idParsed.success) return res.status(404).json({ error: "Recipe not found", code: "NOT_FOUND" });
      const recipe = await repos.getRecipeForUser(req.user!.id, idParsed.data);
      if (!recipe) return res.status(404).json({ error: "Recipe not found", code: "NOT_FOUND" });
      return res.json({ recipe });
    } catch (err) { return next(err); }
  });

  router.put("/recipes/:id", auth.requireCsrf, protect, async (req, res, next) => {
    try {
      const idParsed = recipeIdSchema.safeParse(req.params["id"]);
      if (!idParsed.success) return res.status(404).json({ error: "Recipe not found", code: "NOT_FOUND" });
      const data = parseInput(recipeBodySchema.partial(), req.body, res);
      if (!data) return;
      const recipe = await repos.updateRecipeForUser(req.user!.id, idParsed.data, data);
      if (!recipe) return res.status(404).json({ error: "Recipe not found", code: "NOT_FOUND" });
      return res.json({ recipe });
    } catch (err) { return next(err); }
  });

  router.delete("/recipes/:id", auth.requireCsrf, protect, async (req, res, next) => {
    try {
      const idParsed = recipeIdSchema.safeParse(req.params["id"]);
      if (!idParsed.success) return res.status(404).json({ error: "Recipe not found", code: "NOT_FOUND" });
      const deleted = await repos.deleteRecipeForUser(req.user!.id, idParsed.data);
      if (!deleted) return res.status(404).json({ error: "Recipe not found", code: "NOT_FOUND" });
      return res.json({ ok: true });
    } catch (err) { return next(err); }
  });

  // ── Export / import ───────────────────────────────────────────────────────

  router.get("/export", protect, async (req, res, next) => {
    try {
      const data = await repos.exportDataForUser(req.user!.id);
      return res.json(data);
    } catch (err) { return next(err); }
  });

  router.post("/import", auth.requireCsrf, protect, async (req, res, next) => {
    try {
      if (containsClientIdentity(req.body)) {
        return res.status(400).json({ error: "Tenant identity must not be supplied by the client", code: "INVALID_INPUT" });
      }
      const result = await repos.importDataForUser(req.user!.id, req.body as {
        workspace: unknown;
        recipes: Parameters<typeof repos.createRecipeForUser>[1][];
      });
      return res.json(result);
    } catch (err) { return next(err); }
  });

  // ── Affiliate clicks ──────────────────────────────────────────────────────

  router.post("/affiliate/click", async (req, res, next) => {
    try {
      const data = parseInput(affiliateSchema, req.body, res);
      if (!data) return;
      const id = await repos.recordAffiliateClickForUser(req.user!.id, data as Parameters<typeof repos.recordAffiliateClickForUser>[1]);
      return res.json({ id });
    } catch (err) { return next(err); }
  });

  // ── Instacart shopping ────────────────────────────────────────────────────

  // Composio's current Instacart toolkit is NO_AUTH. The authenticated Mestizo
  // user is still always used to derive the server-side Composio identity, but
  // their Instacart sign-in happens on the generated Instacart page. Returning
  // this explicitly prevents the UI from inventing a connection state.
  router.get("/instacart/status", protect, (_req, res) => {
    if (!instacartService) return instacartUnavailable(res);
    return res.json({
      available: true,
      connection: "not_required",
      signInOnInstacart: true,
    });
  });

  router.get("/instacart/retailers", protect, async (req, res, next) => {
    try {
      if (!instacartService) return instacartUnavailable(res);
      const parsed = instacartRetailerQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({ error: "A valid US or Canadian postal code is required", code: "INVALID_INPUT" });
      }
      const retailers = await instacartService.getNearbyRetailers(
        req.user!.id,
        parsed.data.postalCode,
        parsed.data.countryCode,
      );
      return res.json({ retailers });
    } catch (err) { return next(err); }
  });

  router.post("/instacart/shopping", auth.requireCsrf, protect, async (req, res, next) => {
    try {
      if (!instacartService) return instacartUnavailable(res);
      const data = parseInput(instacartShoppingSchema, req.body, res);
      if (!data) return;

      const hash   = requestHash(data as Parameters<typeof requestHash>[0]);
      const cached = await repos.getInstacartLinkForUser(req.user!.id, hash);
      if (cached) return res.json({ url: cached });

      const url = await instacartService.createShoppingPage(
        req.user!.id,
        data as Parameters<typeof instacartService.createShoppingPage>[1],
      );
      const expiresAt = new Date(Date.now() + 365 * 86_400_000);
      await repos.putInstacartLinkForUser(req.user!.id, hash, url, expiresAt);
      return res.json({ url });
    } catch (err) { return next(err); }
  });

  return router;
}
