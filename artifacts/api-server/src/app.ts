import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger.js";
import { loadAuthConfig, isOidcConfigured } from "./lib/config-auth.js";
import { createOidcService } from "./lib/oidc-service.js";
import { createAuthentication } from "./lib/auth-middleware.js";
import { createBillingService } from "./lib/billing.js";
import { createInstacartService } from "./lib/instacart.js";
import { createAuthRouter } from "./routes/auth.js";
import { createBillingRouter } from "./routes/billing.js";
import { createWorkspaceRouter } from "./routes/workspace.js";
import coreRouter from "./routes/index.js";

const app: Express = express();

// ── DO App Platform path-prefix restore ──────────────────────────────────────
// DO's ingress strips the matched prefix (/api) before forwarding to this
// service. Restore it so all route handlers work identically in dev and prod.
if (process.env["NODE_ENV"] === "production") {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (!req.url.startsWith("/api")) req.url = "/api" + req.url;
    next();
  });
}

// ── Security headers ──────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // Vite frontend handles its own CSP in dev
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);

// ── Logging ───────────────────────────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

// ── Raw body for Stripe webhook (must come before express.json) ───────────────
app.use(
  "/api/billing/webhook",
  express.raw({ type: "application/json", limit: "1mb" }),
);

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Shared services ───────────────────────────────────────────────────────────
const config = loadAuthConfig();

let oidcService: ReturnType<typeof createOidcService> | null = null;
let authMiddleware: ReturnType<typeof createAuthentication> | null = null;

const encKeySet  = Boolean(process.env["TOKEN_ENCRYPTION_KEY"]?.trim());
const csrfKeySet = Boolean(process.env["CSRF_SECRET"]?.trim());

if (!encKeySet || !csrfKeySet) {
  logger.warn("TOKEN_ENCRYPTION_KEY or CSRF_SECRET not set — auth routes disabled.");
} else if (isOidcConfigured()) {
  oidcService    = createOidcService(config);
  authMiddleware = createAuthentication(config, oidcService);
} else {
  logger.warn(
    "OIDC_ISSUER or OIDC_CLIENT_ID not set — auth routes disabled. " +
    "Set these env vars to enable user authentication.",
  );
}

const billingService   = createBillingService(config);
const instacartService = createInstacartService(config);

if (!billingService)   logger.warn("Stripe not configured — billing routes disabled.");
if (!instacartService) logger.info("Composio not configured — Instacart shopping routes disabled.");

// ── Feature routes ─────────────────────────────────────────────────────────────
if (oidcService && authMiddleware) {
  app.use("/api/auth", createAuthRouter(config, oidcService, authMiddleware));
}

if (billingService && authMiddleware) {
  app.use("/api/billing", createBillingRouter(config, billingService, authMiddleware));
}

if (authMiddleware) {
  app.use("/api", createWorkspaceRouter(authMiddleware, instacartService));
}

// ── Core routes (push notifications, health, proxy) ───────────────────────────
app.use("/api", coreRouter);

// ── 404 for unknown /api paths ────────────────────────────────────────────────
app.use("/api", (_req: Request, res: Response) => {
  res.status(404).json({ error: "API route not found" });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const err        = error as Record<string, unknown>;
  const rawStatus  = (err?.["statusCode"] as number) ?? (err?.["status"] as number) ?? 500;
  const safeStatus = rawStatus >= 400 && rawStatus <= 599 ? rawStatus : 500;
  const message    = safeStatus < 500
    ? String(err?.["message"] ?? "Bad request")
    : "The service could not complete this request";
  logger.error({ err: error, status: safeStatus }, "request error");
  if (!res.headersSent) res.status(safeStatus).json({ error: message });
});

export default app;
