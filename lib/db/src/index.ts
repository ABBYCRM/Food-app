import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// DO managed databases present a self-signed cert in the chain.
// Accept it whenever we are connecting to a remote DATABASE_URL
// (NODE_ENV is not reliably set to "production" on DO App Platform).
const sslConfig = process.env.DATABASE_URL?.startsWith("postgres")
  ? { rejectUnauthorized: false }
  : undefined;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: sslConfig });
export const db = drizzle(pool, { schema });

export * from "./schema";
