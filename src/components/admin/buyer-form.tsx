import { saveBuyer } from "@/lib/admin/commerce-actions";

interface BuyerData {
  id: string;
  name: string;
  companyName: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  cities: string[];
  categories: string[];
  minYear: number | null;
  maxYear: number | null;
  reliability: number | null;
  commissionTerms: string | null;
  notes: string | null;
}

const field =
  "h-10 w-full rounded-md border border-line px-3 text-sm focus:border-burgundy-700 focus:outline-none";

function Field({ label, name, defaultValue, type = "text" }: { label: string; name: string; defaultValue?: string | number | null; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink-muted">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue ?? ""} className={field} />
    </label>
  );
}

export function BuyerForm({
  buyer,
  labels,
}: {
  buyer?: BuyerData;
  labels: { cities: string; categories: string; reliability: string; commission: string; save: string };
}) {
  return (
    <form action={saveBuyer} className="max-w-2xl space-y-4 rounded-[14px] border border-line bg-white p-6">
      {buyer && <input type="hidden" name="id" value={buyer.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ad / Yetkili" name="name" defaultValue={buyer?.name} />
        <Field label="Firma" name="companyName" defaultValue={buyer?.companyName} />
        <Field label="Telefon" name="phone" defaultValue={buyer?.phone} />
        <Field label="WhatsApp" name="whatsapp" defaultValue={buyer?.whatsapp} />
        <Field label="E-posta" name="email" type="email" defaultValue={buyer?.email} />
        <Field label={labels.reliability} name="reliability" type="number" defaultValue={buyer?.reliability} />
        <Field label="Min. Yıl" name="minYear" type="number" defaultValue={buyer?.minYear} />
        <Field label="Maks. Yıl" name="maxYear" type="number" defaultValue={buyer?.maxYear} />
      </div>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-ink-muted">{labels.cities}</span>
        <input name="cities" defaultValue={buyer?.cities.join(", ") ?? ""} className={field} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-ink-muted">{labels.categories}</span>
        <input name="categories" defaultValue={buyer?.categories.join(", ") ?? ""} className={field} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-ink-muted">{labels.commission}</span>
        <input name="commissionTerms" defaultValue={buyer?.commissionTerms ?? ""} className={field} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-ink-muted">Notlar</span>
        <textarea name="notes" rows={3} defaultValue={buyer?.notes ?? ""} className="w-full rounded-md border border-line p-2.5 text-sm focus:border-burgundy-700 focus:outline-none" />
      </label>
      <button type="submit" className="rounded-md bg-burgundy-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-burgundy-800">
        {labels.save}
      </button>
    </form>
  );
}
