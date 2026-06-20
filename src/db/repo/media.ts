import { desc, isNull } from "drizzle-orm";
import { requireDb } from "@/db";
import { mediaAssets } from "@/db/schema";

export async function listMedia() {
  return requireDb()
    .select()
    .from(mediaAssets)
    .where(isNull(mediaAssets.deletedAt))
    .orderBy(desc(mediaAssets.createdAt))
    .limit(200);
}
