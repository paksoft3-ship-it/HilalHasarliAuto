import { redirect } from "next/navigation";
import { Database } from "lucide-react";
import { isDbConfigured } from "@/db";
import { getSessionUser } from "@/lib/auth/session";
import { getAdminLocale, translator } from "@/lib/i18n/admin";
import { LoginForm } from "@/components/admin/login-form";
import { DevCredit } from "@/components/layout/dev-credit";

export default async function AdminLoginPage() {
  if (isDbConfigured) {
    const user = await getSessionUser();
    if (user) redirect("/admin");
  }
  const locale = await getAdminLocale();
  const t = translator(locale);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-charcoal-950 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-[12px] bg-burgundy-700 text-lg font-bold text-white">
            HA
          </span>
          <h1 className="mt-4 text-xl font-bold text-white">{t("login.title")}</h1>
          <p className="mt-1 text-sm text-white/55">{t("login.subtitle")}</p>
        </div>

        <div className="rounded-[18px] border border-white/10 bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.35)]">
          {isDbConfigured ? (
            <LoginForm
              labels={{
                email: t("login.email"),
                password: t("login.password"),
                submit: t("login.submit"),
              }}
            />
          ) : (
            <div className="text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-warning-surface text-warning">
                <Database size={24} />
              </div>
              <h2 className="mt-4 text-base font-bold text-ink">Veritabanı Yapılandırılmamış</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                Giriş yapabilmek için <code className="rounded bg-cream-100 px-1">DATABASE_URL</code>{" "}
                ayarlanmalı, ardından{" "}
                <code className="rounded bg-cream-100 px-1">pnpm db:migrate</code> ve{" "}
                <code className="rounded bg-cream-100 px-1">pnpm db:seed</code> çalıştırılmalıdır.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <DevCredit />
        </div>
      </div>
    </div>
  );
}
