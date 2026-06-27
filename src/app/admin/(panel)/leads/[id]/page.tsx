import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Phone } from "lucide-react";
import { isDbConfigured } from "@/db";
import { requirePermission, can } from "@/lib/auth/guard";
import {
  getAdminLocale, translator, stageLabels, priorityLabels, dealTypeLabels,
  sourceLabels, lossReasons,
} from "@/lib/i18n/admin";
import { getLeadDetail, getAssignableUsers } from "@/db/repo/crm-queries";
import { getLeadCommercial, listBuyers } from "@/db/repo/commerce";
import {
  addLeadNote, assignLead, updateLeadDetails, markContacted, addTask, completeTask,
} from "@/lib/admin/lead-actions";
import { StageChangeForm } from "@/components/admin/stage-change-form";
import { LeadCommercial } from "@/components/admin/lead-commercial";
import { StageBadge, NotConfigured, PageTitle } from "@/components/admin/bits";
import { formatTrDate } from "@/lib/utils";

function maskPhone(p: string): string {
  const d = p.replace(/\D/g, "");
  return d.length < 6 ? "***" : `${d.slice(0, 3)}***${d.slice(-2)}`;
}
function dateInput(d: Date | null): string {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-line bg-white">
      <div className="border-b border-line px-5 py-3.5">
        <h2 className="text-sm font-bold text-ink">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2 text-sm last:border-0">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{value || "—"}</dd>
    </div>
  );
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePermission("leads.read");
  const { id } = await params;
  const locale = await getAdminLocale();
  const t = translator(locale);

  if (!isDbConfigured) {
    return (
      <>
        <PageTitle title={t("leads.detail")} />
        <NotConfigured message={t("common.notConfigured")} />
      </>
    );
  }

  const data = await getLeadDetail(id);
  if (!data) notFound();
  const { lead, assignedUser, vehicle, submissions, history, notes, tasks } = data;

  const showPii = can(user, "leads.pii.view");
  const canWrite = can(user, "leads.write");
  const canAssign = can(user, "leads.assign");
  const stageOpts = Object.entries(stageLabels[locale]);
  const assignees = canAssign ? await getAssignableUsers() : [];

  const showCommercial =
    can(user, "referrals.read") || can(user, "offers.read") || can(user, "deals.read");
  const commercial = showCommercial ? await getLeadCommercial(id) : null;
  const activeBuyers = showCommercial ? await listBuyers(true) : [];

  return (
    <>
      <Link href="/admin/leads" className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft size={16} /> {t("leads.title")}
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">{lead.fullName}</h1>
          <p className="text-sm text-ink-muted">
            {lead.leadNumber} · {assignedUser?.name ?? t("leads.unassigned")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-cream-100 px-2.5 py-1 text-xs font-semibold text-ink">
            {priorityLabels[locale][lead.priority]}
          </span>
          <StageBadge stage={lead.stage} locale={locale} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title={t("leads.contact")}>
            <dl>
              <Row label="Ad Soyad" value={lead.fullName} />
              <Row label="Telefon" value={showPii ? lead.phone : maskPhone(lead.phone)} />
              <Row label="E-posta" value={showPii ? lead.email : lead.email ? "•••" : "—"} />
              <Row label={t("common.city")} value={[lead.city, lead.district].filter(Boolean).join(" / ")} />
              <Row label={t("common.source")} value={sourceLabels[locale][lead.source]} />
              <Row label={t("leads.dealType")} value={dealTypeLabels[locale][lead.dealType]} />
              <Row label={t("leads.score")} value={lead.score} />
              {lead.lossReason && <Row label={t("leads.lostReason")} value={lead.lossReason} />}
            </dl>
            {canWrite && (
              <form action={markContacted} className="mt-4">
                <input type="hidden" name="leadId" value={lead.id} />
                <button type="submit" className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-cream-100">
                  <Phone size={15} /> {t("leads.markContacted")}
                </button>
              </form>
            )}
          </Card>

          {vehicle && (
            <Card title={t("leads.vehicle")}>
              <dl>
                <Row label="Marka / Model" value={[vehicle.brand, vehicle.model].filter(Boolean).join(" ")} />
                <Row label="Yıl" value={vehicle.year} />
                <Row label="Kilometre" value={vehicle.mileage} />
                <Row label="Yakıt / Vites" value={[vehicle.fuel, vehicle.transmission].filter(Boolean).join(" / ")} />
                <Row label="Kategori" value={vehicle.category} />
                <Row label="Çalışıyor mu?" value={vehicle.running} />
                <Row label="Açıklama" value={vehicle.damageDescription} />
                <Row label="Fotoğraf" value={vehicle.photoCount} />
              </dl>
              {vehicle.photos?.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {vehicle.photos.map((p) => (
                    <a
                      key={p.pathname}
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block aspect-square overflow-hidden rounded-md border border-line"
                      title={p.name ?? p.pathname}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={p.name ?? "Araç fotoğrafı"} className="h-full w-full object-cover transition hover:scale-105" />
                    </a>
                  ))}
                </div>
              )}
            </Card>
          )}

          <Card title={t("leads.notes")}>
            {canWrite && (
              <form action={addLeadNote} className="mb-4">
                <input type="hidden" name="leadId" value={lead.id} />
                <textarea name="body" rows={2} required placeholder="Not ekleyin…"
                  className="w-full rounded-md border border-line p-2.5 text-sm focus:border-burgundy-700 focus:outline-none" />
                <button type="submit" className="mt-2 rounded-md bg-burgundy-700 px-4 py-2 text-sm font-semibold text-white hover:bg-burgundy-800">
                  {t("leads.addNote")}
                </button>
              </form>
            )}
            {notes.length === 0 ? (
              <p className="text-sm text-ink-muted">{t("common.noResults")}</p>
            ) : (
              <ul className="space-y-3">
                {notes.map((n) => (
                  <li key={n.id} className="rounded-md bg-cream-50 p-3 text-sm">
                    <p className="whitespace-pre-wrap text-ink-secondary">{n.body}</p>
                    <p className="mt-1.5 text-xs text-ink-muted">{n.authorName ?? "—"} · {formatTrDate(n.createdAt.toISOString())}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          {canWrite && (
            <Card title={t("leads.changeStage")}>
              <StageChangeForm
                leadId={lead.id}
                currentStage={lead.stage}
                stageOpts={stageOpts}
                lossReasons={lossReasons}
                labels={{ save: t("common.save"), lossReason: t("leads.lostReason") }}
              />
            </Card>
          )}

          {canAssign && (
            <Card title={t("leads.assignTo")}>
              <form action={assignLead} className="flex gap-2">
                <input type="hidden" name="leadId" value={lead.id} />
                <select name="userId" defaultValue={lead.assignedUserId ?? ""} className="h-10 flex-1 rounded-md border border-line px-3 text-sm">
                  <option value="">{t("common.unassigned")}</option>
                  {assignees.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <button type="submit" className="rounded-md bg-burgundy-700 px-4 text-sm font-semibold text-white hover:bg-burgundy-800">
                  {t("leads.assign")}
                </button>
              </form>
            </Card>
          )}

          {canWrite && (
            <Card title={t("leads.details")}>
              <form action={updateLeadDetails} className="space-y-3">
                <input type="hidden" name="leadId" value={lead.id} />
                <label className="block text-xs font-semibold text-ink-muted">{t("leads.priority")}</label>
                <select name="priority" defaultValue={lead.priority} className="h-10 w-full rounded-md border border-line px-3 text-sm">
                  {Object.entries(priorityLabels[locale]).map(([c, l]) => <option key={c} value={c}>{l}</option>)}
                </select>
                <label className="block text-xs font-semibold text-ink-muted">{t("leads.dealType")}</label>
                <select name="dealType" defaultValue={lead.dealType} className="h-10 w-full rounded-md border border-line px-3 text-sm">
                  {Object.entries(dealTypeLabels[locale]).map(([c, l]) => <option key={c} value={c}>{l}</option>)}
                </select>
                <label className="block text-xs font-semibold text-ink-muted">{t("leads.nextAction")}</label>
                <input type="date" name="nextActionAt" defaultValue={dateInput(lead.nextActionAt)} className="h-10 w-full rounded-md border border-line px-3 text-sm" />
                <button type="submit" className="w-full rounded-md bg-charcoal-950 px-4 py-2 text-sm font-semibold text-white hover:bg-charcoal-800">
                  {t("common.update")}
                </button>
              </form>
            </Card>
          )}

          <Card title={t("leads.tasks")}>
            {canWrite && (
              <form action={addTask} className="mb-4 space-y-2">
                <input type="hidden" name="leadId" value={lead.id} />
                <input name="title" required placeholder={t("tasks.title")} className="h-10 w-full rounded-md border border-line px-3 text-sm" />
                <div className="flex gap-2">
                  <input type="date" name="dueAt" className="h-10 flex-1 rounded-md border border-line px-3 text-sm" />
                  <button type="submit" className="rounded-md bg-burgundy-700 px-4 text-sm font-semibold text-white hover:bg-burgundy-800">
                    {t("common.add")}
                  </button>
                </div>
              </form>
            )}
            {tasks.length === 0 ? (
              <p className="text-sm text-ink-muted">{t("common.noResults")}</p>
            ) : (
              <ul className="space-y-2">
                {tasks.map((tk) => (
                  <li key={tk.id} className="flex items-center justify-between gap-2 rounded-md bg-cream-50 px-3 py-2 text-sm">
                    <span className={tk.status === "done" ? "text-ink-muted line-through" : "text-ink"}>
                      {tk.title}
                      {tk.dueAt && <span className="ml-2 text-xs text-ink-muted">{formatTrDate(tk.dueAt.toISOString())}</span>}
                    </span>
                    {tk.status !== "done" && canWrite && (
                      <form action={completeTask}>
                        <input type="hidden" name="taskId" value={tk.id} />
                        <input type="hidden" name="leadId" value={lead.id} />
                        <button type="submit" title={t("tasks.complete")} className="text-success hover:opacity-80">
                          <CheckCircle2 size={18} />
                        </button>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title={t("leads.history")}>
            {history.length === 0 ? (
              <p className="text-sm text-ink-muted">{t("common.noResults")}</p>
            ) : (
              <ul className="space-y-2.5">
                {history.map((h) => (
                  <li key={h.id} className="text-sm">
                    <span className="font-medium text-ink">{stageLabels[locale][h.toStage] ?? h.toStage}</span>
                    {h.reason && <span className="block text-xs text-ink-secondary">{h.reason}</span>}
                    <span className="block text-xs text-ink-muted">{formatTrDate(h.createdAt.toISOString())}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title={t("leads.submissions")}>
            {submissions.length === 0 ? (
              <p className="text-sm text-ink-muted">{t("common.noResults")}</p>
            ) : (
              <ul className="space-y-2">
                {submissions.map((s) => (
                  <li key={s.id} className="flex justify-between text-sm">
                    <span className="text-ink-secondary">{s.type}</span>
                    <span className="text-xs text-ink-muted">{formatTrDate(s.createdAt.toISOString())}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      {commercial && (
        <LeadCommercial
          leadId={lead.id}
          bundle={commercial}
          buyers={activeBuyers.map((b) => ({ id: b.id, name: b.name }))}
          locale={locale}
          perms={{
            referWrite: can(user, "referrals.write"),
            offerWrite: can(user, "offers.write"),
            dealWrite: can(user, "deals.write"),
          }}
          labels={{
            title: t("commercial.title"),
            refer: t("commercial.refer"),
            buyerOffers: t("commercial.buyerOffers"),
            customerOffer: t("commercial.customerOffer"),
            select: t("commercial.select"),
            create: t("deals.create"),
            open: t("deals.open"),
            add: t("common.add"),
          }}
        />
      )}
    </>
  );
}
