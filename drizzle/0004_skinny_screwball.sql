CREATE TYPE "public"."content_status" AS ENUM('draft', 'in_review', 'changes_requested', 'approved', 'scheduled', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('blog_post', 'guide', 'page', 'service', 'faq');--> statement-breakpoint
CREATE TYPE "public"."media_visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "content_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_item_id" uuid NOT NULL,
	"action" text NOT NULL,
	"comment" text,
	"by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "content_type" NOT NULL,
	"slug" text NOT NULL,
	"locale" text DEFAULT 'tr' NOT NULL,
	"internal_title" text,
	"title" text NOT NULL,
	"excerpt" text,
	"category" text,
	"body" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"image_url" text,
	"image_alt" text,
	"seo_title" text,
	"seo_description" text,
	"canonical" text,
	"robots" text,
	"og_image" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"author_id" uuid,
	"reviewer_id" uuid,
	"version" integer DEFAULT 1 NOT NULL,
	"published_at" timestamp with time zone,
	"scheduled_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_item_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"note" text,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"filename" text,
	"mime" text,
	"size" integer,
	"width" integer,
	"height" integer,
	"alt" text,
	"caption" text,
	"credit" text,
	"folder" text,
	"visibility" "media_visibility" DEFAULT 'public' NOT NULL,
	"created_by_user_id" uuid,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_usages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_approvals" ADD CONSTRAINT "content_approvals_content_item_id_content_items_id_fk" FOREIGN KEY ("content_item_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_approvals" ADD CONSTRAINT "content_approvals_by_user_id_users_id_fk" FOREIGN KEY ("by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_content_item_id_content_items_id_fk" FOREIGN KEY ("content_item_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_usages" ADD CONSTRAINT "media_usages_media_id_media_assets_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "content_approvals_item_idx" ON "content_approvals" USING btree ("content_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "content_type_slug_locale_idx" ON "content_items" USING btree ("type","slug","locale");--> statement-breakpoint
CREATE INDEX "content_status_idx" ON "content_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "content_type_idx" ON "content_items" USING btree ("type");--> statement-breakpoint
CREATE INDEX "content_versions_item_idx" ON "content_versions" USING btree ("content_item_id");--> statement-breakpoint
CREATE INDEX "media_folder_idx" ON "media_assets" USING btree ("folder");--> statement-breakpoint
CREATE INDEX "media_usages_media_idx" ON "media_usages" USING btree ("media_id");