import { timestamp, uuid } from "drizzle-orm/pg-core";

/** Immutable primary key. */
export const pk = () => uuid("id").defaultRandom().primaryKey();

/** UTC timestamps (stored timestamptz; displayed in Europe/Istanbul). */
export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};
