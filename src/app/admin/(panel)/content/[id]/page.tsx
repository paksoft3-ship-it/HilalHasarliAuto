import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { isDbConfigured } from "@/db";
import { requirePermission, can } from "@/lib/auth/guard";
import { getAdminLocale, translator, contentStatusLabels } from "@/lib/i18n/admin";
import { getContent } from "@/db/repo/content";
import { transitionContent, addContentComment } from "@/lib/admin/content-actions";
import { ContentForm } from "@/components/admin/content-form";
import { PageTitle } from "@/components/admin/bits";
import { formatTrDate } from "@/lib/utils";

function publicUrl(type: string, slug: string): string | null {
  if (type === "blog_post") return `/blog/${slug}`;
  if (type === "guide") return `/rehberler/${slug}`;
  return null;
}

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePermission("content.write");
  const { id } = await params;
  const locale = await getAdminLocale();
  const t = translator(locale);
  if (!isDbConfigured) notFound();

  const data = await getContent(id);
  if (!data) notFound();
  const { item, approvals } = data;
  const canPublish = can(user, "content.publish");

  // Available transitions by status.
  const actions: { action: string; label: string; needPublish: boolean }[] = [];
  const s = item.status;
  if (s === "draft" || s === "changes_requested") actions.push({ action: "submit", label: t("content.submit"), needPublish: false });
  if (s === "in_review") {
    actions.push({ action: "approve", label: t("content.approve"), needPublish: true });
    actions.push({ action: "request_changes", label: t("content.requestChanges"), needPublish: true });
  }
  if (s === "approved" || s === "draft") actions.push({ action: "publish", label: t("content.publish"), needPublish: true });
  if (s === "published") actions.push({ action: "unpublish", label: t("content.unpublish"), needPublish: true });
  if (s !== "archived") actions.push({ action: "archive", label: t("content.archive"), needPublish: false });

  const url = publicUrl(item.type, item.slug);

  return (
    <>
      <Link href="/admin/content" className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft size={16} /> {t("content.title")}
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <PageTitle title={item.title} />
        <div className="flex items-center gap-2">
          {url && item.status === "published" && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-burgundy-700 hover:underline">
              {t("content.preview")} <ExternalLink size={13} />
            </a>
          )}
          <span className="rounded-full bg-cream-100 px-3 py-1 text-xs font-semibold text-ink">
            {contentStatusLabels[locale][item.status]}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContentForm
            item={item}
            labels={{
              type: t("content.type"),
              excerpt: t("content.excerpt"),
              body: t("content.body"),
              seo: t("content.seo"),
              save: t("common.save"),
            }}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-[14px] border border-line bg-white p-5">
            <h2 className="mb-3 text-sm font-bold text-ink">{t("content.workflow")}</h2>
            <div className="flex flex-col gap-2">
              {actions.map((a) => {
                const disabled = a.needPublish && !canPublish;
                return (
                  <form key={a.action} action={transitionContent}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="action" value={a.action} />
                    <button
                      type="submit"
                      disabled={disabled}
                      className="w-full rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-cream-100 disabled:opacity-40"
                    >
                      {a.label}
                    </button>
                  </form>
                );
              })}
            </div>
          </div>

          <div className="rounded-[14px] border border-line bg-white p-5">
            <h2 className="mb-3 text-sm font-bold text-ink">{t("content.approvals")}</h2>
            <form action={addContentComment} className="mb-3">
              <input type="hidden" name="id" value={item.id} />
              <textarea name="comment" rows={2} required placeholder={t("content.comment")} className="w-full rounded-md border border-line p-2 text-sm focus:border-burgundy-700 focus:outline-none" />
              <button type="submit" className="mt-2 rounded-md bg-charcoal-950 px-3 py-1.5 text-xs font-semibold text-white">{t("common.add")}</button>
            </form>
            {approvals.length === 0 ? (
              <p className="text-sm text-ink-muted">{t("common.noResults")}</p>
            ) : (
              <ul className="space-y-2.5">
                {approvals.map((a) => (
                  <li key={a.id} className="text-sm">
                    <span className="font-medium text-ink">{a.action}</span>
                    {a.comment && <span className="block text-ink-secondary">{a.comment}</span>}
                    <span className="block text-xs text-ink-muted">{a.byName ?? "—"} · {formatTrDate(a.createdAt.toISOString())}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
