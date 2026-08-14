import { createApp } from "./app.js";
import { createBillingService } from "./billing.js";
import { loadConfig } from "./config.js";
import { createPostgresDatabase } from "./db.js";
import { createInstacartService } from "./instacart.js";
import { migrateDatabase } from "./migrations.js";
import { createOidcService } from "./oidc.js";
import { createRepositories } from "./repositories.js";
import { createSeoService } from "./seo.js";

const config = loadConfig();
const database = createPostgresDatabase(config);

try {
  await migrateDatabase(database);
  const repositories = createRepositories(database);
  const oidcService = createOidcService(config);
  const billingService = createBillingService({ config, repositories });
  const instacartService = createInstacartService(config);
  const seoService = await createSeoService(config);
  const app = createApp({
    config,
    database,
    repositories,
    oidcService,
    billingService,
    instacartService,
    seoService,
  });
  const server = app.listen(config.port, "0.0.0.0", () => {
    process.stdout.write(`Mestizo Umami listening on port ${config.port}.\n`);
  });

  let shuttingDown = false;
  async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    process.stdout.write(`Received ${signal}; closing the service.\n`);
    server.close(async () => {
      await database.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  }
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
} catch (error) {
  await database.close().catch(() => {});
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
}

