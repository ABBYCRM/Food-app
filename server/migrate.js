import { loadDatabaseConfig } from "./config.js";
import { createPostgresDatabase } from "./db.js";
import { migrateDatabase } from "./migrations.js";

const config = loadDatabaseConfig();
const database = createPostgresDatabase(config);

try {
  const files = await migrateDatabase(database);
  process.stdout.write(`Database migrations verified (${files.length} migration file${files.length === 1 ? "" : "s"}).\n`);
} finally {
  await database.close();
}
