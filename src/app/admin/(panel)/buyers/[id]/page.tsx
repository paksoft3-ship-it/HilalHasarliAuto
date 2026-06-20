import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { getBuyer } from "@/db/repo/commerce";
import { isDbConfigured } from "@/db";
import { PageTitle } from "@/components/admin/bits";
import { BuyerForm } from "@/components/admin/buyer-form";

export default async function EditBuyerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("buyers.write");
  const { id } = await params;
  const locale = await getAdminLocale();
  const t = translator(locale);
  if (!isDbConfigured) notFound();

  const buyer = await getBuyer(id);
  if (!buyer) notFound();

  return (
    <>
      <PageTitle title={buyer.name} />
      <BuyerForm
        buyer={buyer}
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
