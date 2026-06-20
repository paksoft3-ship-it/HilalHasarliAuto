import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { PageTitle } from "@/components/admin/bits";
import { ContentForm } from "@/components/admin/content-form";

export default async function NewContentPage() {
  await requirePermission("content.write");
  const locale = await getAdminLocale();
  const t = translator(locale);
  return (
    <>
      <PageTitle title={t("content.new")} />
      <ContentForm
        labels={{
          type: t("content.type"),
          excerpt: t("content.excerpt"),
          body: t("content.body"),
          seo: t("content.seo"),
          save: t("common.save"),
        }}
      />
    </>
  );
}
