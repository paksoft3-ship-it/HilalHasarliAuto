import { pgEnum } from "drizzle-orm/pg-core";

/** CRM funnel stages — stable internal codes (labels are configurable in UI). */
export const leadStage = pgEnum("lead_stage", [
  "new_lead",
  "waiting_contact",
  "contacted",
  "missing_info",
  "evaluation",
  "referred_buyers",
  "buyer_offers",
  "offer_sent",
  "negotiation",
  "accepted",
  "notary_pending",
  "vehicle_purchased",
  "preparing_sale",
  "vehicle_sold",
  "broker_closed",
  "lost",
]);

export const dealType = pgEnum("deal_type", [
  "undecided",
  "broker_commission",
  "direct_purchase_resale",
]);

export const leadPriority = pgEnum("lead_priority", [
  "low",
  "normal",
  "high",
  "urgent",
]);

export const leadSource = pgEnum("lead_source", [
  "website_form",
  "whatsapp",
  "phone_call",
  "manual",
  "google_ads",
  "organic",
  "social",
  "referral",
  "meta_ads",
  "tiktok_ads",
  "unknown",
]);

export const contactMethod = pgEnum("contact_method", ["phone", "whatsapp", "email"]);

export const triState = pgEnum("tri_state", ["yes", "no", "unknown"]);

export const taskStatus = pgEnum("task_status", [
  "open",
  "in_progress",
  "done",
  "cancelled",
]);

export const leadStatus = pgEnum("lead_status", ["active", "archived"]);

export const formType = pgEnum("form_type", [
  "quick_offer",
  "full_quote",
  "contact",
  "city",
  "district",
]);

export const touchType = pgEnum("touch_type", ["first", "last"]);

export const jobStatus = pgEnum("job_status", [
  "pending",
  "running",
  "succeeded",
  "failed",
  "retrying",
  "dead_letter",
]);

export const userLocale = pgEnum("user_locale", ["tr", "en"]);

export const referralStatus = pgEnum("referral_status", [
  "shared",
  "viewed",
  "responded",
  "declined",
  "offer_made",
  "selected",
  "closed",
]);

export const offerStatus = pgEnum("offer_status", [
  "pending",
  "accepted",
  "rejected",
  "expired",
]);

export const dealStatus = pgEnum("deal_status", ["open", "won", "lost"]);

export const paymentStatus = pgEnum("payment_status", ["pending", "partial", "paid"]);

export const adPlatform = pgEnum("ad_platform", [
  "google_ads",
  "meta_ads",
  "tiktok_ads",
  "other",
]);

export const callStatus = pgEnum("call_status", [
  "initiated",
  "ringing",
  "answered",
  "missed",
  "completed",
  "failed",
]);

export const messageDirection = pgEnum("message_direction", ["inbound", "outbound"]);

export const threadStatus = pgEnum("thread_status", ["open", "closed"]);

export const notificationChannel = pgEnum("notification_channel", [
  "whatsapp",
  "email",
  "browser",
  "sms",
]);

export const notificationStatus = pgEnum("notification_status", [
  "pending",
  "sent",
  "failed",
  "skipped",
]);

export const contentType = pgEnum("content_type", [
  "blog_post",
  "guide",
  "page",
  "service",
  "faq",
]);

export const contentStatus = pgEnum("content_status", [
  "draft",
  "in_review",
  "changes_requested",
  "approved",
  "scheduled",
  "published",
  "archived",
]);

export const mediaVisibility = pgEnum("media_visibility", ["public", "private"]);
