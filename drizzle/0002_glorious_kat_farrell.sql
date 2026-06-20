CREATE TABLE "conversion_exports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" text NOT NULL,
	"conversion_action" text NOT NULL,
	"lead_id" uuid,
	"deal_id" uuid,
	"click_ids" jsonb,
	"hashed_user_data" jsonb,
	"conversion_time" timestamp with time zone NOT NULL,
	"currency" text DEFAULT 'TRY' NOT NULL,
	"value" integer,
	"consent_state" jsonb,
	"dedupe_key" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"response" text,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "critical_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"lead_id" uuid,
	"entity_type" text,
	"entity_id" text,
	"session_id" text,
	"page_url" text,
	"referrer" text,
	"source" jsonb,
	"consent_snapshot" jsonb,
	"dedupe_id" text,
	"payload" jsonb,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversion_exports" ADD CONSTRAINT "conversion_exports_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversion_exports" ADD CONSTRAINT "conversion_exports_deal_id_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."deals"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "critical_events" ADD CONSTRAINT "critical_events_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "conversion_exports_dedupe_idx" ON "conversion_exports" USING btree ("dedupe_key");--> statement-breakpoint
CREATE INDEX "conversion_exports_status_idx" ON "conversion_exports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "critical_events_name_idx" ON "critical_events" USING btree ("name");--> statement-breakpoint
CREATE INDEX "critical_events_lead_idx" ON "critical_events" USING btree ("lead_id");--> statement-breakpoint
CREATE UNIQUE INDEX "critical_events_dedupe_idx" ON "critical_events" USING btree ("dedupe_id");