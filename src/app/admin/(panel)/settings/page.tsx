import { isDbConfigured } from "@/db";
import { requirePermission } from "@/lib/auth/guard";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { getSiteSettings, getIntegrations } from "@/db/repo/admin-extra";
import { saveSiteSettings } from "@/lib/admin/settings-actions";
import { SETTING_KEYS } from "@/lib/admin/settings-keys";
import { NotConfigured, PageTitle } from "@/components/admin/bits";

const LABELS: Record<string, string> = {
  "brand.name": "Marka adı",
  "brand.tagline": "Slogan",
  "contact.phoneDisplay": "Telefon (görünen)",
  "contact.email": "E-posta",
  "contact.workingHours": "Çalışma saatleri",
  "contact.address": "Adres",
};

const field = "h-10 w-full rounded-md border border-line px-3 text-sm focus:border-burgundy-700 focus:outline-none";

export default async function SettingsPage() {
  await requirePermission("settings.manage");
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (<><PageTitle title={t("nav.settings")} /><NotConfigured message={t("common.notConfigured")} /></>);
  }

  const [settings, integrations] = await Promise.all([getSiteSettings(), getIntegrations()]);
  const map = new Map(settings.map((s) => [s.key, typeof s.value === "string" ? s.value : ""]));

  return (
    <>
      <PageTitle title={t("nav.settings")} />
      <p className="mb-5 text-xs text-ink-muted">{t("settings.note")}</p>

      <div className="grid gap-6 lg:grid-cols-2">
        <form action={saveSiteSettings} className="rounded-[14px] border border-line bg-white p-6">
          <h2 className="mb-4 text-sm font-bold text-ink">{t("settings.brand")} & {t("settings.contact")}</h2>
          <div className="space-y-4">
            {SETTING_KEYS.map((key) => (
              <label key={key} className="block">
                <span className="mb-1 block text-xs font-semibold text-ink-muted">{LABELS[key] ?? key}</span>
                <input name={key} defaultValue={map.get(key) ?? ""} className={field} />
              </label>
            ))}
          </div>
          <button type="submit" className="mt-5 rounded-md bg-burgundy-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-burgundy-800">
            {t("common.save")}
          </button>
        </form>

        <div className="rounded-[14px] border border-line bg-white p-6">
          <h2 className="mb-4 text-sm font-bold text-ink">{t("settings.integrations")}</h2>
          {integrations.length === 0 ? (
            <p className="text-sm text-ink-muted">
              Entegrasyonlar ortam değişkenleri (env) ile yapılandırılır: DATABASE_URL, GTM/GA4,
              WhatsApp, çağrı takibi, Turnstile, Vercel Blob. Durumları ilgili modüllerde görünür.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {integrations.map((i) => (
                <li key={i.id} className="flex items-center justify-between">
                  <span className="text-ink-secondary">{i.provider}</span>
                  <span className={i.enabled ? "text-success" : "text-ink-muted"}>
                    {i.enabled ? "Etkin" : "Pasif"}{i.testMode ? " · test" : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
