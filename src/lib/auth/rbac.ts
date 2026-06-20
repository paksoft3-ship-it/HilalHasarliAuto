/**
 * Role & permission definitions (master prompt §21). Stable codes; UI labels
 * are bilingual. Server-side checks use these — never rely on hidden UI alone.
 */

export const PERMISSIONS = {
  "dashboard.view": "Panoyu görüntüleme",
  "leads.read": "Müşteri adaylarını görüntüleme",
  "leads.write": "Müşteri adaylarını düzenleme",
  "leads.assign": "Müşteri adayı atama",
  "leads.delete": "Müşteri adayı silme",
  "leads.pii.view": "Hassas iletişim bilgilerini görme",
  "calls.read": "Çağrıları görüntüleme",
  "calls.recording.access": "Çağrı kayıtlarına erişim",
  "whatsapp.read": "WhatsApp görüşmelerini görüntüleme",
  "buyers.read": "Alıcıları görüntüleme",
  "buyers.write": "Alıcıları düzenleme",
  "referrals.read": "Yönlendirmeleri görüntüleme",
  "referrals.write": "Yönlendirmeleri düzenleme",
  "offers.read": "Teklifleri görüntüleme",
  "offers.write": "Teklifleri düzenleme",
  "deals.read": "Anlaşmaları görüntüleme",
  "deals.write": "Anlaşmaları düzenleme",
  "finance.read": "Finansal verileri görüntüleme",
  "finance.write": "Finansal verileri düzenleme",
  "adspend.read": "Reklam harcamalarını görüntüleme",
  "adspend.write": "Reklam harcamalarını düzenleme",
  "analytics.view": "Analitikleri görüntüleme",
  "seo.read": "SEO verilerini görüntüleme",
  "seo.write": "SEO verilerini düzenleme",
  "keywords.read": "Anahtar kelimeleri görüntüleme",
  "keywords.write": "Anahtar kelimeleri düzenleme",
  "searchconsole.read": "Search Console verilerini görüntüleme",
  "content.read": "İçerikleri görüntüleme",
  "content.write": "İçerik düzenleme",
  "content.publish": "İçerik yayınlama",
  "media.read": "Medyayı görüntüleme",
  "media.write": "Medya yükleme/düzenleme",
  "redirects.write": "Yönlendirme yönetimi",
  "notifications.manage": "Bildirim yönetimi",
  "integrations.manage": "Entegrasyon yönetimi",
  "users.manage": "Kullanıcı yönetimi",
  "roles.manage": "Rol ve izin yönetimi",
  "audit.read": "Denetim kayıtlarını görüntüleme",
  "jobs.manage": "Arka plan işleri yönetimi",
  "settings.manage": "Ayar yönetimi",
  "export.data": "Veri dışa aktarma",
} as const;

export type PermissionCode = keyof typeof PERMISSIONS;

export interface RoleDef {
  code: string;
  name: string; // Turkish display
  description: string;
  permissions: PermissionCode[] | "*";
}

const all = Object.keys(PERMISSIONS) as PermissionCode[];

export const ROLES: RoleDef[] = [
  {
    code: "super_admin",
    name: "Süper Yönetici",
    description: "Tüm yetkilere sahiptir.",
    permissions: "*",
  },
  {
    code: "manager",
    name: "Yönetici",
    description: "Müşteri adayları, atamalar, alıcılar, teklifler, anlaşmalar ve raporlar.",
    permissions: [
      "dashboard.view", "leads.read", "leads.write", "leads.assign", "leads.pii.view",
      "calls.read", "whatsapp.read", "buyers.read", "buyers.write", "referrals.read",
      "referrals.write", "offers.read", "offers.write", "deals.read", "deals.write",
      "analytics.view", "content.read", "export.data",
    ],
  },
  {
    code: "sales",
    name: "Satış Temsilcisi",
    description: "Atanan müşteri adayları, çağrı/mesaj, not ve sınırlı teklif yetkisi.",
    permissions: [
      "dashboard.view", "leads.read", "leads.write", "leads.pii.view",
      "calls.read", "whatsapp.read", "offers.read", "offers.write",
    ],
  },
  {
    code: "content_editor",
    name: "İçerik Editörü",
    description: "İçerik, medya ve SEO taslakları; yayınlama yetkisi yoktur.",
    permissions: [
      "dashboard.view", "content.read", "content.write", "media.read", "media.write",
      "seo.read", "seo.write", "keywords.read", "redirects.write",
    ],
  },
  {
    code: "marketing_analyst",
    name: "Pazarlama Analisti",
    description: "Reklam, atıf, SEO ve analitik; PII maskelenir, anlaşma düzenlenemez.",
    permissions: [
      "dashboard.view", "analytics.view", "adspend.read", "seo.read", "seo.write",
      "keywords.read", "keywords.write", "searchconsole.read", "leads.read",
    ],
  },
  {
    code: "finance",
    name: "Finans",
    description: "Harcama, gelir, komisyon, gider ve finansal raporlar.",
    permissions: [
      "dashboard.view", "finance.read", "finance.write", "adspend.read", "adspend.write",
      "deals.read", "export.data",
    ],
  },
  {
    code: "auditor",
    name: "Salt Okunur Denetçi",
    description: "Yalnızca okuma; hassas alanlar politikaya göre maskelenir.",
    permissions: [
      "dashboard.view", "leads.read", "analytics.view", "content.read",
      "finance.read", "deals.read", "audit.read",
    ],
  },
];

export function permissionsForRole(role: RoleDef): PermissionCode[] {
  return role.permissions === "*" ? all : role.permissions;
}
