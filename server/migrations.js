import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const migrationDirectory = fileURLToPath(new URL("../migrations/", import.meta.url));

export async function migrateDatabase(db, directory = migrationDirectory) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const files = (await readdir(directory))
    .filter((name) => /^\d+.*\.sql$/.test(name))
    .sort((a, b) => a.localeCompare(b));

  for (const filename of files) {
    const existing = await db.query("SELECT filename FROM schema_migrations WHERE filename = $1", [filename]);
    if (existing.length > 0) continue;
    const sql = await readFile(path.join(directory, filename), "utf8");
    await db.transaction(async (transaction) => {
      await transaction.execute(sql);
      await transaction.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [filename]);
    });
  }
  return files;
}
