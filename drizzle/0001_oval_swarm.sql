CREATE TYPE "public"."ad_platform" AS ENUM('google_ads', 'meta_ads', 'tiktok_ads', 'other');--> statement-breakpoint
CREATE TYPE "public"."deal_status" AS ENUM('open', 'won', 'lost');--> statement-breakpoint
CREATE TYPE "public"."offer_status" AS ENUM('pending', 'accepted', 'rejected', 'expired');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'partial', 'paid');--> statement-breakpoint
CREATE TYPE "public"."referral_status" AS ENUM('shared', 'viewed', 'responded', 'declined', 'offer_made', 'selected', 'closed');--> statement-breakpoint
CREATE TABLE "ad_spend_daily" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" "ad_platform" NOT NULL,
	"account" text,
	"campaign" text,
	"ad_group" text,
	"spend_date" date NOT NULL,
	"currency" text DEFAULT 'TRY' NOT NULL,
	"spend" integer DEFAULT 0 NOT NULL,
	"impressions" integer DEFAULT 0 NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	"sync_batch" text,
	"notes" text,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "buyer_offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"buyer_id" uuid NOT NULL,
	"referral_id" uuid,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'TRY' NOT NULL,
	"note" text,
	"status" "offer_status" DEFAULT 'pending' NOT NULL,
	"selected" boolean DEFAULT false NOT NULL,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "buyers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"company_name" text,
	"phone" text,
	"whatsapp" text,
	"email" text,
	"cities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"categories" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"min_year" integer,
	"max_year" integer,
	"running_pref" "tri_state",
	"reliability" integer,
	"commission_terms" text,
	"notes" text,
	"active" boolean DEFAULT true NOT NULL,
	"last_activity_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'TRY' NOT NULL,
	"status" "offer_status" DEFAULT 'pending' NOT NULL,
	"note" text,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deal_expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deal_id" uuid NOT NULL,
	"type" text NOT NULL,
	"amount" integer NOT NULL,
	"expense_date" date,
	"note" text,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"type" "deal_type" DEFAULT 'undecided' NOT NULL,
	"status" "deal_status" DEFAULT 'open' NOT NULL,
	"customer_asking_price" integer,
	"offer_presented" integer,
	"best_buyer_offer" integer,
	"agreed_amount" integer,
	"direct_purchase_price" integer,
	"direct_resale_price" integer,
	"expected_commission" integer,
	"actual_commission" integer,
	"ad_cost_allocated" integer DEFAULT 0 NOT NULL,
	"net_profit_adjustment" integer,
	"adjustment_reason" text,
	"currency" text DEFAULT 'TRY' NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"closing_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "deals_lead_id_unique" UNIQUE("lead_id")
);
--> statement-breakpoint
CREATE TABLE "lead_referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"buyer_id" uuid NOT NULL,
	"status" "referral_status" DEFAULT 'shared' NOT NULL,
	"shared_summary" text,
	"response_note" text,
	"created_by_user_id" uuid,
	"responded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ad_spend_daily" ADD CONSTRAINT "ad_spend_daily_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "buyer_offers" ADD CONSTRAINT "buyer_offers_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "buyer_offers" ADD CONSTRAINT "buyer_offers_buyer_id_buyers_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."buyers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "buyer_offers" ADD CONSTRAINT "buyer_offers_referral_id_lead_referrals_id_fk" FOREIGN KEY ("referral_id") REFERENCES "public"."lead_referrals"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "buyer_offers" ADD CONSTRAINT "buyer_offers_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_offers" ADD CONSTRAINT "customer_offers_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_offers" ADD CONSTRAINT "customer_offers_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deal_expenses" ADD CONSTRAINT "deal_expenses_deal_id_deals_id_fk" FOREIGN KEY ("deal_id") REFERENCES "public"."deals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deal_expenses" ADD CONSTRAINT "deal_expenses_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_referrals" ADD CONSTRAINT "lead_referrals_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_referrals" ADD CONSTRAINT "lead_referrals_buyer_id_buyers_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."buyers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_referrals" ADD CONSTRAINT "lead_referrals_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "adspend_date_idx" ON "ad_spend_daily" USING btree ("spend_date");--> statement-breakpoint
CREATE UNIQUE INDEX "adspend_unique" ON "ad_spend_daily" USING btree ("platform","campaign","spend_date","source");--> statement-breakpoint
CREATE INDEX "buyer_offers_lead_idx" ON "buyer_offers" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "buyers_active_idx" ON "buyers" USING btree ("active");--> statement-breakpoint
CREATE INDEX "customer_offers_lead_idx" ON "customer_offers" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "deal_expenses_deal_idx" ON "deal_expenses" USING btree ("deal_id");--> statement-breakpoint
CREATE INDEX "deals_status_idx" ON "deals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "deals_type_idx" ON "deals" USING btree ("type");--> statement-breakpoint
CREATE INDEX "referrals_lead_idx" ON "lead_referrals" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "referrals_buyer_idx" ON "lead_referrals" USING btree ("buyer_id");