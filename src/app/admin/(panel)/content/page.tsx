import Link from "next/link";
import { Plus } from "lucide-react";
import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator, contentStatusLabels, contentTypeLabels } from "@/lib/i18n/admin";
import { listContent } from "@/db/repo/content";
import { deleteContent } from "@/lib/admin/content-actions";
import { NotConfigured, PageTitle, Flash } from "@/components/admin/bits";
import { DeleteButton } from "@/components/admin/delete-button";
import { can } from "@/lib/auth/guard";
import { formatTrDate, cn } from "@/lib/utils";

const STATUS_TONE: Record<string, string> = {
  published: "bg-success-surface text-success",
  draft: "bg-cream-200 text-ink-muted",
  in_review: "bg-info-surface text-info",
  changes_requested: "bg-warning-surface text-warning",
  approved: "bg-gold-100 text-gold-700",
  archived: "bg-cream-200 text-ink-muted",
  scheduled: "bg-info-surface text-info",
};

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; ok?: string; error?: string }>;
}) {
  const user = await requirePermission("content.read");
  const sp = await searchParams;
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (<><PageTitle title={t("content.title")} /><NotConfigured message={t("common.notConfigured")} /></>);
  }

  const rows = await listContent({ type: sp.type, status: sp.status });
  const canWrite = can(user, "content.write");

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <PageTitle title={t("content.title")} subtitle={`${rows.length}`} />
        <Link href="/admin/content/new" className="inline-flex items-center gap-1.5 rounded-md bg-burgundy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-burgundy-800">
          <Plus size={16} /> {t("content.new")}
        </Link>
      </div>

      <Flash ok={sp.ok} error={sp.error} />

      <div className="mb-4 flex flex-wrap gap-2">
        {["", "blog_post", "guide", "page", "service", "faq"].map((type) => (
          <Link
            key={type || "all"}
            href={type ? `/admin/content?type=${type}` : "/admin/content"}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium",
              (sp.type ?? "") === type ? "border-burgundy-700 bg-burgundy-700 text-white" : "border-line bg-white text-ink hover:border-burgundy-700",
            )}
          >
            {type ? contentTypeLabels[locale][type] : t("common.all")}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3 font-semibold">Başlık</th>
              <th className="px-4 py-3 font-semibold">{t("content.type")}</th>
              <th className="px-4 py-3 font-semibold">{t("common.status")}</th>
              <th className="px-4 py-3 font-semibold">{t("common.created")}</th>
              {canWrite && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.length === 0 ? (
              <tr><td colSpan={canWrite ? 5 : 4} className="px-4 py-10 text-center text-ink-muted">{t("common.noResults")}</td></tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id} className="hover:bg-cream-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/content/${c.id}`} className="font-semibold text-burgundy-700 hover:underline">{c.title}</Link>
                    <div className="text-xs text-ink-muted">/{c.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">{contentTypeLabels[locale][c.type]}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_TONE[c.status] ?? "bg-cream-200 text-ink-muted")}>
                      {contentStatusLabels[locale][c.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{formatTrDate(c.updatedAt.toISOString())}</td>
                  {canWrite && (
                    <td className="px-4 py-3 text-right">
                      <DeleteButton action={deleteContent} id={c.id} confirmText={`"${c.title}" içeriğini silmek istediğinize emin misiniz?`} />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
