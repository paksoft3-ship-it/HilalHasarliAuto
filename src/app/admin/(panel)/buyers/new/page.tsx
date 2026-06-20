import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { PageTitle } from "@/components/admin/bits";
import { BuyerForm } from "@/components/admin/buyer-form";

export default async function NewBuyerPage() {
  await requirePermission("buyers.write");
  const locale = await getAdminLocale();
  const t = translator(locale);
  return (
    <>
      <PageTitle title={t("buyers.new")} />
      <BuyerForm
        labels={{
          cities: t("buyers.cities"),
          categories: t("buyers.categories"),
          reliability: t("buyers.reliability"),
          commission: t("buyers.commission"),
          save: t("common.save"),
        }}
      />
    </>
  );
}
