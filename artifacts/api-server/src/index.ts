import app from "./app.js";
import { logger } from "./lib/logger.js";
import { startPushScheduler } from "./lib/push-scheduler.js";
import { runMigrations } from "./lib/migrate.js";
import { pool } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// ── Database migrations ───────────────────────────────────────────────────────
// Runs all numbered SQL files in migrations/ then applies the push_subscriptions
// table before the server accepts traffic.
try {
  const applied = await runMigrations();
  logger.info({ count: applied.length }, "startup migrations: all applied");
} catch (err) {
  logger.error({ err }, "startup migrations: failed — continuing with existing schema");
}

// push_subscriptions table (push notifications, standalone — not in numbered migrations)
try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id         SERIAL PRIMARY KEY,
      endpoint   TEXT UNIQUE NOT NULL,
      p256dh     TEXT NOT NULL,
      auth       TEXT NOT NULL,
      meal_plan  JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
} catch (err) {
  logger.error({ err }, "startup migration: push_subscriptions failed");
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  startPushScheduler(logger);
});
