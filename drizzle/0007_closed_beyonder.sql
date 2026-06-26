ALTER TABLE "content_items" ADD COLUMN "seo_keywords" text;--> statement-breakpoint
ALTER TABLE "content_items" ADD COLUMN "faqs" jsonb DEFAULT '[]'::jsonb NOT NULL;