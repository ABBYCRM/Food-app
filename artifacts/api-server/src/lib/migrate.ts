/**
 * Runs numbered SQL migration files from the migrations/ directory.
 * Tracks applied files in a schema_migrations table (idempotent).
 * Ported from server/migrations.js.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { pool } from "@workspace/db";

// esbuild bundles all TS into dist/index.mjs, so import.meta.url is not
// useful for locating sibling source files at runtime.  The server always
// runs with cwd = the api-server package root, so use that.
const migrationDir = path.resolve(process.cwd(), "migrations");

export async function runMigrations(dir = migrationDir): Promise<string[]> {
  // Tracking table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename   TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const files = (await readdir(dir))
    .filter((f) => /^\d+.*\.sql$/.test(f))
    .sort((a, b) => a.localeCompare(b));

  const client = await pool.connect();
  try {
    for (const filename of files) {
      const existing = await client.query(
        "SELECT filename FROM schema_migrations WHERE filename = $1",
        [filename],
      );
      if ((existing.rowCount ?? 0) > 0) continue;

      const sql = await readFile(path.join(dir, filename), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          "INSERT INTO schema_migrations (filename) VALUES ($1)",
          [filename],
        );
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
    }
  } finally {
    client.release();
  }

  return files;
}
