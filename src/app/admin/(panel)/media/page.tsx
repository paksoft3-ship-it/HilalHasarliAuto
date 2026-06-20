import Image from "next/image";
import { isDbConfigured } from "@/db";
import { requirePermission, can } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { listMedia } from "@/db/repo/media";
import { registerMedia } from "@/lib/admin/media-actions";
import { NotConfigured, PageTitle } from "@/components/admin/bits";

const field = "h-10 rounded-md border border-line px-3 text-sm focus:border-burgundy-700 focus:outline-none";

export default async function MediaPage() {
  const user = await requirePermission("media.read");
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (<><PageTitle title={t("media.title")} /><NotConfigured message={t("common.notConfigured")} /></>);
  }

  const rows = await listMedia();
  const canWrite = can(user, "media.write");

  return (
    <>
      <PageTitle title={t("media.title")} subtitle={`${rows.length}`} />

      {canWrite && (
        <form action={registerMedia} className="mb-5 flex flex-wrap items-end gap-2 rounded-[14px] border border-line bg-white p-4">
          <input name="url" required placeholder={t("media.url")} className={`${field} min-w-[260px] flex-1`} />
          <input name="alt" placeholder={t("media.alt")} className={`${field} w-44`} />
          <input name="folder" placeholder="Klasör" className={`${field} w-32`} />
          <button type="submit" className="h-10 rounded-md bg-burgundy-700 px-5 text-sm font-semibold text-white hover:bg-burgundy-800">
            {t("media.register")}
          </button>
        </form>
      )}
      <p className="mb-5 text-xs text-ink-muted">
        Doğrudan yükleme için Vercel Blob (BLOB_READ_WRITE_TOKEN) gereklidir; şu an URL ile ekleme aktiftir.
      </p>

      {rows.length === 0 ? (
        <NotConfigured message={t("common.noResults")} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {rows.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-[12px] border border-line bg-white">
              <div className="relative aspect-square bg-cream-100">
                <Image src={m.url} alt={m.alt ?? ""} fill sizes="200px" className="object-cover" unoptimized />
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-ink">{m.filename ?? m.url}</p>
                {m.folder && <p className="text-[11px] text-ink-muted">{m.folder}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
