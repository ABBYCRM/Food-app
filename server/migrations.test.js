import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { describe, expect, it } from "vitest";
import { createPgliteDatabase } from "./db.js";
import { migrateDatabase } from "./migrations.js";

describe("forward-only database migrations", () => {
  it("adds the tenant-scoped Instacart cache to a database that already applied 001", async () => {
    const pglite = new PGlite();
    const database = createPgliteDatabase(pglite);
    try {
      await database.query(`
        CREATE TABLE schema_migrations (
          filename TEXT PRIMARY KEY,
          applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      const initial = await readFile(new URL("../migrations/001_auth_billing_tenancy.sql", import.meta.url), "utf8");
      await database.execute(initial);
      await database.query(
        "INSERT INTO schema_migrations (filename) VALUES ($1)",
        ["001_auth_billing_tenancy.sql"],
      );

      await migrateDatabase(database);
      const tables = await database.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'instacart_links'
      `);
      const applied = await database.query(
        "SELECT filename FROM schema_migrations ORDER BY filename",
      );

      expect(tables).toHaveLength(1);
      expect(applied.map((row) => row.filename)).toEqual([
        "001_auth_billing_tenancy.sql",
        "002_instacart_links.sql",
      ]);

      await expect(migrateDatabase(database)).resolves.toHaveLength(2);
    } finally {
      await pglite.close();
    }
  }, 20_000);
});
