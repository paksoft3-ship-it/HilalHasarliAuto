import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Only used by push/migrate/studio; `generate` works offline.
    url: process.env.DATABASE_URL ?? "postgresql://user:pass@localhost:5432/hasarliaracalan",
  },
  verbose: true,
  strict: true,
});
