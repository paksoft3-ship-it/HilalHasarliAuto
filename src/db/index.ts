import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Database client. Credential-ready: until DATABASE_URL is set, `db` is null
 * and `isDbConfigured` is false, so callers degrade gracefully (no fake success).
 * Set DATABASE_URL (Neon) then run `pnpm db:migrate` and `pnpm db:seed`.
 */
const url = process.env.DATABASE_URL;

export const isDbConfigured = Boolean(url);

export const db = url ? drizzle(neon(url), { schema }) : null;

export type Database = NonNullable<typeof db>;

/** Returns the db or throws — use only after checking isDbConfigured. */
export function requireDb(): Database {
  if (!db) {
    throw new Error("DATABASE_URL is not configured.");
  }
  return db;
}

export * as tables from "./schema";
