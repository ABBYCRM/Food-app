import { randomBytes, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import compression from "compression";
import express from "express";
import helmet from "helmet";
import { z } from "zod";
import { createAuthentication } from "./auth.js";
import { createEntitlementMiddleware, describeEntitlement } from "./entitlements.js";
import {
  clearOpaqueCookie,
  containsClientIdentity,
  csrfToken,
  decryptString,
  encryptString,
  getCookie,
  normalizeReturnTo,
  OIDC_COOKIE_BASE,
  randomCredential,
  SESSION_COOKIE_BASE,
  setOpaqueCookie,
  sha256,
} from "./security.js";
import {
  affiliateClickSchema,
  checkoutCompleteSchema,
  defaultWorkspace,
  importSchema,
  instacartShoppingSchema,
  parseClientInput,
  recipeCreateSchema,
  recipeUpdateSchema,
  workspaceSchema,
} from "./validation.js";

const rootDirectory = fileURLToPath(new URL("../", import.meta.url));
const recipeIdSchema = z.string().uuid();
const portalBillingStatuses = new Set(["past_due", "unpaid", "incomplete", "paused"]);

function requestInput(schema, req, res) {
  const parsed = parseClientInput(schema, req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error, code: "INVALID_INPUT" });
    return null;
  }
  return parsed.data;
}

function providerExpiration(now, expiresIn) {
  return typeof expiresIn === "number" && Number.isFinite(expiresIn)
    ? new Date(now.getTime() + expiresIn * 1_000)
    : null;
}

export function createApp({
  config,
  database,
  repositories,
  oidcService,
  billingService,
  instacartService,
  seoService,
  clock = () => new Date(),
}) {
  const app = express();
  const authentication = createAuthentication({ repositories, config, oidcService, clock });
  const requireEntitlement = createEntitlementMiddleware({ repositories, clock });

  if (config.trustProxy) app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    req.requestId = randomUUID();
    res.locals.cspNonce = randomBytes(18).toString("base64");
    res.setHeader("X-Request-Id", req.requestId);
    next();
  });
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://image.pollinations.ai"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'", (_req, res) => `'nonce-${res.locals.cspNonce}'`],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        upgradeInsecureRequests: config.isProduction ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }));
  app.use(compression());

  app.get("/healthz", (_req, res) => res.status(200).type("text/plain").send("ok"));
  app.get("/readyz", async (_req, res, next) => {
    try {
      await database.query("SELECT 1 AS ready");
      res.status(200).json({ ready: true });
    } catch (error) {
      next(Object.assign(error, { statusCode: 503 }));
    }
  });

  app.post(
    "/api/billing/webhook",
    express.raw({ type: "application/json", limit: "1mb" }),
    async (req, res, next) => {
      try {
        const signature = req.get("stripe-signature");
        if (!signature) return res.status(400).json({ error: "Missing Stripe signature" });
        const event = billingService.constructWebhookEvent(req.body, signature);
        await billingService.processWebhook(event);
        return res.status(200).json({ received: true });
      } catch (error) {
        if (error?.type === "StripeSignatureVerificationError") {
          return res.status(400).json({ error: "Invalid Stripe signature" });
        }
        return next(error);
      }
    },
  );

  app.use(express.json({ limit: "256kb", strict: true }));
  app.use(authentication.resolveAuthentication);
  app.use("/api", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store, private");
    next();
  });

  app.get("/api/auth/login", async (req, res, next) => {
    try {
      const now = clock();
      const attemptCredential = randomCredential();
      const verifier = oidcService.randomPkceVerifier();
      const challenge = await oidcService.calculatePkceChallenge(verifier);
      const state = oidcService.randomState();
      const nonce = oidcService.randomNonce();
      const returnTo = normalizeReturnTo(req.query.return_to);
      await repositories.createOidcAttempt({
        idHash: sha256(attemptCredential),
        stateHash: sha256(state),
        pkceVerifierCiphertext: encryptString(verifier, config.encryptionKey),
        nonce,
        returnTo,
        expiresAt: new Date(now.getTime() + config.oidcAttemptTtlSeconds * 1_000),
        now,
      });
      const authorizationUrl = await oidcService.authorizationUrl({ codeChallenge: challenge, state, nonce });
      setOpaqueCookie(res, OIDC_COOKIE_BASE, attemptCredential, config.oidcAttemptTtlSeconds, config);
      return res.redirect(303, authorizationUrl);
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/auth/callback", async (req, res, next) => {
    const attemptCredential = getCookie(req, OIDC_COOKIE_BASE, config);
    const state = typeof req.query.state === "string" ? req.query.state : null;
    if (!attemptCredential || !state || req.query.error) {
      clearOpaqueCookie(res, OIDC_COOKIE_BASE, config);
      return res.status(400).json({ error: "OIDC callback validation failed" });
    }
    try {
      const attempt = await repositories.consumeOidcAttempt(
        sha256(attemptCredential),
        sha256(state),
        clock(),
      );
      if (!attempt) {
        clearOpaqueCookie(res, OIDC_COOKIE_BASE, config);
        return res.status(400).json({ error: "OIDC login attempt is invalid or expired" });
      }
      const tokens = await oidcService.exchangeCallback(
        new URL(req.originalUrl, config.publicBaseUrl),
        {
          pkceVerifier: decryptString(attempt.pkceVerifierCiphertext, config.encryptionKey),
          expectedState: state,
          expectedNonce: attempt.nonce,
        },
      );
      const now = clock();
      const user = await repositories.upsertVerifiedOidcUser({
        issuer: tokens.issuer,
        subject: tokens.subject,
        email: tokens.email,
        displayName: tokens.displayName,
        now,
      });
      await repositories.ensureTrialForUser(user.id, { trialDays: config.trialDays, now });

      const sessionCredential = randomCredential();
      await repositories.createSession({
        idHash: sha256(sessionCredential),
        userId: user.id,
        accessTokenCiphertext: encryptString(tokens.accessToken, config.encryptionKey),
        refreshTokenCiphertext: encryptString(tokens.refreshToken, config.encryptionKey),
        idTokenCiphertext: encryptString(tokens.idToken, config.encryptionKey),
        providerExpiresAt: providerExpiration(now, tokens.expiresIn),
        expiresAt: new Date(now.getTime() + config.sessionTtlSeconds * 1_000),
        now,
      });
      clearOpaqueCookie(res, OIDC_COOKIE_BASE, config);
      setOpaqueCookie(res, SESSION_COOKIE_BASE, sessionCredential, config.sessionTtlSeconds, config);
      return res.redirect(303, attempt.returnTo);
    } catch (error) {
      clearOpaqueCookie(res, OIDC_COOKIE_BASE, config);
      return next(error);
    }
  });

  app.get("/api/public/config", (_req, res) => res.status(200).json({
    trialDays: config.trialDays,
    priceDisplay: config.stripe.priceDisplay,
  }));

  app.use("/api", (req, res, next) => {
    if (containsClientIdentity(req.query) || containsClientIdentity(req.body)) {
      return res.status(400).json({
        error: "Tenant identity must not be supplied by the client",
        code: "CLIENT_IDENTITY_REJECTED",
      });
    }
    return next();
  });

  app.get("/api/auth/session", authentication.requireAuthentication, async (req, res, next) => {
    try {
      const subscription = await repositories.getSubscriptionForUser(req.user.id);
      const entitlement = describeEntitlement(subscription, clock());
      return res.status(200).json({
        authenticated: true,
        user: { displayName: req.user.displayName, email: req.user.email },
        entitlement,
        billing: {
          priceDisplay: config.stripe.priceDisplay,
          canManage: Boolean(subscription?.stripeCustomerId),
          paywallAction: subscription?.stripeSubscriptionId && portalBillingStatuses.has(subscription.status)
            ? "portal"
            : "checkout",
        },
        csrfToken: csrfToken(req.authSession.credential, config.csrfSecret),
      });
    } catch (error) {
      return next(error);
    }
  });

  app.post(
    "/api/auth/logout",
    authentication.requireAuthentication,
    authentication.requireCsrf,
    async (req, res, next) => {
      let idToken = null;
      try {
        idToken = decryptString(req.authSession.idTokenCiphertext, config.encryptionKey);
      } catch {
        idToken = null;
      }
      try {
        await repositories.revokeSessionForUser(req.authSession.idHash, req.user.id);
        clearOpaqueCookie(res, SESSION_COOKIE_BASE, config);
        let redirectUrl = config.publicBaseUrl;
        try {
          redirectUrl = await oidcService.endSessionUrl(idToken) ?? config.publicBaseUrl;
        } catch {
          redirectUrl = config.publicBaseUrl;
        }
        return res.status(200).json({ loggedOut: true, redirectUrl });
      } catch (error) {
        clearOpaqueCookie(res, SESSION_COOKIE_BASE, config);
        return next(error);
      }
    },
  );

  const protectedRead = [authentication.requireAuthentication, requireEntitlement];
  const protectedWrite = [authentication.requireAuthentication, authentication.requireCsrf, requireEntitlement];

  app.get("/api/workspace", ...protectedRead, async (req, res, next) => {
    try {
      let workspace = await repositories.getWorkspaceForUser(req.user.id);
      if (!workspace) workspace = await repositories.putWorkspaceForUser(req.user.id, defaultWorkspace, clock());
      return res.status(200).json(workspace);
    } catch (error) {
      return next(error);
    }
  });

  app.put("/api/workspace", ...protectedWrite, async (req, res, next) => {
    const input = requestInput(workspaceSchema, req, res);
    if (!input) return;
    try {
      return res.status(200).json(await repositories.putWorkspaceForUser(req.user.id, input, clock()));
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/recipes", ...protectedRead, async (req, res, next) => {
    try {
      return res.status(200).json({ recipes: await repositories.listRecipesForUser(req.user.id) });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/recipes/:id", ...protectedRead, async (req, res, next) => {
    const id = recipeIdSchema.safeParse(req.params.id);
    if (!id.success) return res.status(404).json({ error: "Recipe not found" });
    try {
      const recipe = await repositories.getRecipeForUser(req.user.id, id.data);
      return recipe
        ? res.status(200).json({ recipe })
        : res.status(404).json({ error: "Recipe not found" });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/recipes", ...protectedWrite, async (req, res, next) => {
    const input = requestInput(recipeCreateSchema, req, res);
    if (!input) return;
    try {
      return res.status(201).json({ recipe: await repositories.createRecipeForUser(req.user.id, input, clock()) });
    } catch (error) {
      return next(error);
    }
  });

  app.patch("/api/recipes/:id", ...protectedWrite, async (req, res, next) => {
    const id = recipeIdSchema.safeParse(req.params.id);
    if (!id.success) return res.status(404).json({ error: "Recipe not found" });
    const input = requestInput(recipeUpdateSchema, req, res);
    if (!input) return;
    try {
      const recipe = await repositories.updateRecipeForUser(req.user.id, id.data, input, clock());
      return recipe
        ? res.status(200).json({ recipe })
        : res.status(404).json({ error: "Recipe not found" });
    } catch (error) {
      return next(error);
    }
  });

  app.delete("/api/recipes/:id", ...protectedWrite, async (req, res, next) => {
    const id = recipeIdSchema.safeParse(req.params.id);
    if (!id.success) return res.status(404).json({ error: "Recipe not found" });
    try {
      const deleted = await repositories.deleteRecipeForUser(req.user.id, id.data);
      return deleted ? res.status(204).end() : res.status(404).json({ error: "Recipe not found" });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/data/export", ...protectedRead, async (req, res, next) => {
    try {
      const data = await repositories.exportDataForUser(req.user.id);
      return res.status(200).json({ format: "mestizo-umami-v1", ...data });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/data/import", ...protectedWrite, async (req, res, next) => {
    const raw = req.body?.format === "mestizo-umami-v1"
      ? { workspace: req.body.workspace, recipes: req.body.recipes }
      : req.body;
    const input = requestInput(importSchema, { ...req, body: raw }, res);
    if (!input) return;
    try {
      const imported = await repositories.importDataForUser(req.user.id, input, clock());
      return res.status(200).json({ imported: true, ...imported });
    } catch (error) {
      return next(error);
    }
  });

  app.post(
    "/api/instacart-shopping-list",
    ...protectedWrite,
    async (req, res, next) => {
      const input = requestInput(instacartShoppingSchema, req, res);
      if (!input) return;
      try {
        const now = clock();
        const requestHash = sha256(JSON.stringify(input));
        let url = await repositories.getInstacartLinkForUser(req.user.id, requestHash, now);
        if (!url) {
          url = await instacartService.createShoppingPage(input);
          await repositories.putInstacartLinkForUser(
            req.user.id,
            requestHash,
            url,
            new Date(now.getTime() + 364 * 86_400_000),
            now,
          );
        }
        await repositories.recordAffiliateClickForUser(req.user.id, {
          vendor: "instacart",
          destinationHost: new URL(url).hostname,
          itemCount: input.ingredients.length,
        }, now);
        return res.status(200).json({ url });
      } catch (error) {
        return next(error);
      }
    },
  );

  app.post("/api/affiliate/click", ...protectedWrite, async (req, res, next) => {
    const input = requestInput(affiliateClickSchema, req, res);
    if (!input) return;
    try {
      await repositories.recordAffiliateClickForUser(req.user.id, input, clock());
      return res.status(204).end();
    } catch (error) {
      return next(error);
    }
  });

  app.post(
    "/api/billing/checkout",
    authentication.requireAuthentication,
    authentication.requireCsrf,
    async (req, res, next) => {
      try {
        return res.status(200).json({ url: await billingService.createCheckout(req.user) });
      } catch (error) {
        return next(error);
      }
    },
  );

  app.post(
    "/api/billing/complete",
    authentication.requireAuthentication,
    authentication.requireCsrf,
    async (req, res, next) => {
      const input = requestInput(checkoutCompleteSchema, req, res);
      if (!input) return;
      try {
        const subscription = await billingService.completeCheckoutForUser(req.user.id, input.sessionId);
        return res.status(200).json({ entitlement: describeEntitlement(subscription, clock()) });
      } catch (error) {
        return next(error);
      }
    },
  );

  app.post(
    "/api/billing/portal",
    authentication.requireAuthentication,
    authentication.requireCsrf,
    async (req, res, next) => {
      try {
        return res.status(200).json({ url: await billingService.createPortalForUser(req.user.id) });
      } catch (error) {
        return next(error);
      }
    },
  );

  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(seoService.robots());
  });
  app.get("/llms.txt", (_req, res) => {
    res.type("text/plain").send(seoService.llms());
  });
  app.get("/sitemap.xml", (_req, res) => {
    res.type("application/xml").send(seoService.sitemap());
  });

  const distDirectory = path.join(rootDirectory, "dist");
  app.use(express.static(distDirectory, {
    fallthrough: true,
    index: false,
    maxAge: config.isProduction ? "1y" : 0,
    immutable: config.isProduction,
    setHeaders(res, filePath) {
      if (filePath.endsWith("sw.js") || filePath.endsWith("manifest.webmanifest")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  }));

  app.use("/api", (_req, res) => res.status(404).json({ error: "API route not found" }));

  app.use(async (req, res, next) => {
    if (req.method !== "GET" || !req.accepts("html")) return next();
    try {
      const template = await readFile(path.join(distDirectory, "index.html"), "utf8");
      res.setHeader("Cache-Control", "no-cache");
      return res.status(seoService.statusCode(req.path)).send(seoService.render(template, req.path, res.locals.cspNonce));
    } catch (error) {
      return next(error);
    }
  });

  app.use((error, req, res, _next) => {
    const status = Number.isInteger(error?.statusCode)
      ? error.statusCode
      : Number.isInteger(error?.status) ? error.status : 500;
    const safeStatus = status >= 400 && status <= 599 ? status : 500;
    const message = safeStatus < 500 ? error.message : "The service could not complete this request";
    const log = {
      level: "error",
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      status: safeStatus,
      error: error?.name ?? "Error",
    };
    process.stderr.write(`${JSON.stringify(log)}\n`);
    if (res.headersSent) return;
    res.status(safeStatus).json({ error: message, requestId: req.requestId });
  });

  return app;
}
