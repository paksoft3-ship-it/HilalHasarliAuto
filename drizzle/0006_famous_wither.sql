DROP INDEX "ad_visits_session_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "ad_visits_session_uniq" ON "ad_visits" USING btree ("session_id");