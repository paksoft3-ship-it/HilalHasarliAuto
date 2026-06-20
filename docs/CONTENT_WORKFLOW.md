# Content Workflow (CMS)

Structured CMS (master prompt §8). Content lives in `content_items` with typed
**Block[]** body (rendered by `ArticleBody`), SEO fields, versions and an
editorial approval trail.

## Types & statuses
- Types: `blog_post`, `guide`, `page`, `service`, `faq`.
- Statuses: `draft → in_review → (changes_requested | approved) → published`,
  plus `archived` (and `scheduled`, reserved).

## Editing
- `/admin/content` — list + type filter; **New** creates a draft.
- Body uses **Markdown-lite** (`## h2`, `### h3`, `- list`, `1. ordered`,
  `> note`, blank line = paragraph) → parsed to `Block[]` on save
  (`lib/cms/blocks.ts`). Every save snapshots a `content_versions` row.

## Workflow (RBAC)
- `content.write`: create/edit, **submit for review**, archive, comment.
- `content.publish`: **approve**, **request changes**, **publish**, **unpublish**.
- AI-generated content must start as **draft** and never auto-publish.
- Each transition records a `content_approvals` row + an audit log entry.

## Publishing → public site
- `publish` sets `published_at` and `revalidatePath`s the public route.
- The public blog reads published `content_items` merged with config seeds
  (DB wins) via `lib/cms/public-content.ts`; pages are ISR (`revalidate = 300`)
  and revalidated immediately on publish/unpublish. Guides/pages/services reuse
  the same engine (wire-up pending).

## Media
- `/admin/media` — register assets by URL now (`media_assets`). Direct uploads
  use **Vercel Blob** once `BLOB_READ_WRITE_TOKEN` is set (route
  `/api/admin/media/upload` to be added) with MIME/size/dimension validation,
  filename sanitization and private vs public separation.
