import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Private / non-indexable routes (master prompt §10).
const PRIVATE = ["/admin", "/api", "/tesekkurler", "/arama"];

/**
 * AI search / assistant crawlers, explicitly allowed so the site can be
 * cited by ChatGPT, Claude, Gemini, Perplexity, DeepSeek etc. (GEO).
 * DeepSeek and several others source from Common Crawl (CCBot).
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
  "Amazonbot",
  "Bytespider",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE,
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: PRIVATE,
      },
    ],
    sitemap: `${siteConfig.domain}/sitemap.xml`,
    host: siteConfig.domain,
  };
}
