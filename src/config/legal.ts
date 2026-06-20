import type { LegalDoc } from "@/components/ui/legal-document";
import { siteConfig } from "./site";
import { routes } from "./navigation";

/**
 * Legal page content. All company-specific facts use editable placeholders
 * (master prompt: never invent legal/company information). Retention periods,
 * jurisdiction and provider names are intentionally left as placeholders to be
 * completed after legal review.
 */

const controller = siteConfig.legalCompanyName;
const UPDATED = "[TARİH]";

export const privacyDoc: LegalDoc = {
  eyebrow: "Gizlilik ve Veri Güvenliği",
  title: "Gizlilik Politikası",
  intro:
    "Bu Gizlilik Politikası, internet sitemizi kullanırken kişisel verilerinizin nasıl toplandığını, işlendiğini ve korunduğunu açıklar.",
  lastUpdated: UPDATED,
  href: routes.privacy,
  breadcrumbLabel: "Gizlilik Politikası",
  sections: [
    { id: "amac", heading: "Amaç", blocks: [{ type: "p", text: "Bu politika, ziyaretçilerimizin ve başvuru sahiplerinin kişisel verilerinin gizliliğini korumaya yönelik ilkelerimizi açıklamak amacıyla hazırlanmıştır." }] },
    { id: "veri-sorumlusu", heading: "Veri Sorumlusu", blocks: [{ type: "p", text: `Veri sorumlusu ${controller}'dir. İletişim bilgileri için bu politikanın "İletişim" bölümüne bakınız.` }] },
    { id: "toplanan-bilgiler", heading: "Toplanan Bilgiler", blocks: [
      { type: "p", text: "Hizmetlerimizi sunabilmek için aşağıdaki bilgileri toplayabiliriz:" },
      { type: "ul", items: ["Ad, soyad ve iletişim bilgileri", "Araç bilgileri ve fotoğrafları", "Konum (il/ilçe) bilgisi", "Site kullanımına ilişkin teknik veriler"] },
    ] },
    { id: "kullanim-amaclari", heading: "Kullanım Amaçları", blocks: [
      { type: "ul", items: ["Araç değerlendirme talebinin işleme alınması", "Sizinle iletişim kurulması", "Hizmet kalitesinin geliştirilmesi", "Yasal yükümlülüklerin yerine getirilmesi"] },
    ] },
    { id: "toplama-yontemleri", heading: "Toplama Yöntemleri", blocks: [{ type: "p", text: "Veriler; site formları, telefon, WhatsApp ve e-posta gibi kanallar ile otomatik veya otomatik olmayan yöntemlerle toplanır." }] },
    { id: "hukuki-sebepler", heading: "Hukuki Sebepler", blocks: [{ type: "p", text: "Kişisel verileriniz, ilgili mevzuatta öngörülen hukuki sebeplere dayalı olarak işlenir. Ayrıntılar KVKK Aydınlatma Metni'nde yer alır." }] },
    { id: "paylasim", heading: "Bilgi Paylaşımı", blocks: [{ type: "p", text: "Bilgileriniz, yalnızca hizmetin gerektirdiği ölçüde ve yasal yükümlülükler çerçevesinde paylaşılır. [HİZMET SAĞLAYICILARI] gibi taraflarla paylaşım, gizlilik yükümlülükleri altında gerçekleştirilir." }] },
    { id: "cerezler", heading: "Çerezler ve Analitik", blocks: [{ type: "p", text: "Sitemizde çerezler kullanılmaktadır. Ayrıntılar için Çerez Politikası sayfasını inceleyebilirsiniz." }] },
    { id: "guvenlik", heading: "Veri Güvenliği", blocks: [{ type: "p", text: "Verilerinizin güvenliği için uygun teknik ve idari tedbirler alınır. Hiçbir sistem mutlak güvenlik garantisi veremez; ancak riskleri azaltmak için makul önlemler uygulanır." }] },
    { id: "saklama", heading: "Saklama Süresi", blocks: [{ type: "p", text: "Kişisel verileriniz, işleme amacının gerektirdiği ve mevzuatın öngördüğü süre boyunca saklanır. Saklama süreleri [SAKLAMA SÜRESİ] olarak belirlenir." }] },
    { id: "haklar", heading: "Haklarınız", blocks: [{ type: "p", text: "İlgili mevzuat kapsamında verilerinize erişim, düzeltme, silme ve işlemeye itiraz gibi haklara sahipsiniz. Başvuru yöntemleri KVKK Aydınlatma Metni'nde açıklanmıştır." }] },
    { id: "degisiklikler", heading: "Politika Değişiklikleri", blocks: [{ type: "p", text: "Bu politika zaman zaman güncellenebilir. Güncel sürüm bu sayfada yayımlanır." }] },
    { id: "iletisim", heading: "İletişim", blocks: [{ type: "p", text: `Gizlilik ile ilgili sorularınız için ${siteConfig.email} adresinden bize ulaşabilirsiniz.` }] },
  ],
};

export const kvkkDoc: LegalDoc = {
  eyebrow: "Kişisel Verilerin Korunması",
  title: "KVKK Aydınlatma Metni",
  intro:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, kişisel verilerinizin işlenmesine ilişkin aydınlatma metnidir.",
  lastUpdated: UPDATED,
  href: routes.kvkk,
  breadcrumbLabel: "KVKK Aydınlatma Metni",
  sections: [
    { id: "veri-sorumlusu", heading: "Veri Sorumlusunun Kimliği", blocks: [{ type: "p", text: `Bu aydınlatma metni, veri sorumlusu sıfatıyla ${controller} tarafından hazırlanmıştır. Adres: ${siteConfig.companyAddress}. KEP: ${siteConfig.kepAddress}.` }] },
    { id: "kapsam", heading: "Kapsam ve Veri Sahibi Grupları", blocks: [{ type: "p", text: "Bu metin; site ziyaretçileri, başvuru sahipleri ve müşteri adaylarının kişisel verilerini kapsar." }] },
    { id: "kategoriler", heading: "Kişisel Veri Kategorileri", blocks: [{ type: "ul", items: ["Kimlik ve iletişim bilgileri", "Araç ve işlem bilgileri", "Görsel kayıtlar (araç fotoğrafları)", "İşlem güvenliği ve teknik veriler"] }] },
    { id: "amaclar", heading: "İşleme Amaçları", blocks: [{ type: "ul", items: ["Değerlendirme talebinin yürütülmesi", "İletişim faaliyetlerinin sürdürülmesi", "Sözleşmesel ve yasal yükümlülüklerin yerine getirilmesi", "Hizmetlerin iyileştirilmesi"] }] },
    { id: "toplama", heading: "Toplama Yöntemi", blocks: [{ type: "p", text: "Verileriniz; elektronik formlar, telefon, WhatsApp ve e-posta aracılığıyla toplanır." }] },
    { id: "hukuki-sebep", heading: "Hukuki Sebepler", blocks: [{ type: "p", text: "Kişisel verileriniz KVKK md. 5 ve md. 6'da belirtilen hukuki sebeplere dayanılarak işlenir." }] },
    { id: "aktarim", heading: "Veri Aktarımı", blocks: [{ type: "p", text: "Verileriniz, hizmetin gerektirdiği ölçüde ve mevzuata uygun olarak yetkili taraflarla ([HİZMET SAĞLAYICILARI]) paylaşılabilir." }] },
    { id: "saklama", heading: "Saklama, Silme ve Yok Etme", blocks: [{ type: "p", text: "Veriler, ilgili mevzuat ve işleme amaçlarının gerektirdiği süre ([SAKLAMA SÜRESİ]) boyunca saklanır; sürenin sonunda silinir, yok edilir veya anonim hale getirilir." }] },
    { id: "guvenlik", heading: "Güvenlik Tedbirleri", blocks: [{ type: "p", text: "Verilerinizin korunması için uygun teknik ve idari tedbirler alınır." }] },
    { id: "haklar", heading: "İlgili Kişinin Hakları", blocks: [{ type: "p", text: "KVKK md. 11 kapsamında; verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini isteme gibi haklara sahipsiniz." }] },
    { id: "basvuru", heading: "Başvuru Yöntemleri", blocks: [{ type: "p", text: `Taleplerinizi ${siteConfig.email} adresine veya ${siteConfig.companyAddress} adresine yazılı olarak iletebilirsiniz. WhatsApp tek başına resmi KVKK başvuru kanalı değildir.` }] },
    { id: "guncelleme", heading: "Güncellemeler", blocks: [{ type: "p", text: "Bu metin gerektiğinde güncellenebilir; güncel sürüm bu sayfada yayımlanır." }] },
  ],
};

export const cookieDoc: LegalDoc = {
  eyebrow: "Çerezler ve Dijital Tercihler",
  title: "Çerez Politikası",
  intro:
    "Bu Çerez Politikası, internet sitemizde kullanılan çerezleri ve tercihlerinizi nasıl yönetebileceğinizi açıklar.",
  lastUpdated: UPDATED,
  href: routes.cookies,
  breadcrumbLabel: "Çerez Politikası",
  sections: [
    { id: "cerez-nedir", heading: "Çerez Nedir?", blocks: [{ type: "p", text: "Çerezler, ziyaret ettiğiniz siteler tarafından cihazınıza kaydedilen küçük metin dosyalarıdır." }] },
    { id: "kategoriler", heading: "Çerez Kategorileri", blocks: [
      { type: "ul", items: [
        "Zorunlu çerezler — sitenin çalışması için gereklidir, her zaman aktiftir.",
        "İşlevsel çerezler — tercihlerinizi hatırlar (opsiyonel).",
        "Analitik çerezler — kullanım istatistikleri sağlar (opsiyonel).",
        "Pazarlama çerezleri — reklam ölçümü için kullanılır (opsiyonel).",
      ] },
    ] },
    { id: "yonetim", heading: "Tercih Yönetimi", blocks: [{ type: "p", text: "Çerez tercihlerinizi istediğiniz zaman çerez tercih panelinden güncelleyebilir; opsiyonel çerezleri kabul edebilir veya reddedebilirsiniz." }] },
    { id: "envanter", heading: "Çerez Envanteri", blocks: [{ type: "p", text: "Kullanılan çerezlerin adı, sağlayıcısı, amacı ve süresi [ÇEREZ ENVANTERİ] denetimi tamamlandığında bu bölümde listelenecektir." }] },
    { id: "tarayici", heading: "Tarayıcı Ayarları", blocks: [{ type: "p", text: "Tarayıcınızın ayarlarından çerezleri yönetebilir veya silebilirsiniz. Zorunlu çerezlerin engellenmesi sitenin bazı bölümlerini etkileyebilir." }] },
    { id: "degisiklik", heading: "Politika Değişiklikleri", blocks: [{ type: "p", text: "Bu politika güncellenebilir; güncel sürüm bu sayfada yayımlanır." }] },
    { id: "iletisim", heading: "İletişim", blocks: [{ type: "p", text: `Sorularınız için ${siteConfig.email} adresine yazabilirsiniz.` }] },
  ],
};

export const termsDoc: LegalDoc = {
  eyebrow: "İnternet Sitesi ve Hizmet Kullanımı",
  title: "Kullanım Koşulları",
  intro:
    "Bu Kullanım Koşulları, internet sitemizi ve hizmetlerimizi kullanırken geçerli olan kuralları belirler.",
  lastUpdated: UPDATED,
  href: routes.terms,
  breadcrumbLabel: "Kullanım Koşulları",
  sections: [
    { id: "kabul", heading: "Kabul", blocks: [{ type: "p", text: "Siteyi kullanarak bu koşulları kabul etmiş sayılırsınız. Koşulları kabul etmiyorsanız siteyi kullanmamanız gerekir." }] },
    { id: "kapsam", heading: "Hizmet Kapsamı", blocks: [{ type: "p", text: "Site, hasarlı ve problemli araçların değerlendirilmesine yönelik başvuru ve iletişim imkânı sunar. Değerlendirme talebi, kesin teklif veya satın alma taahhüdü anlamına gelmez." }] },
    { id: "kullanici-bilgileri", heading: "Kullanıcı Bilgilerinin Doğruluğu", blocks: [{ type: "p", text: "Paylaştığınız araç ve iletişim bilgilerinin doğru ve güncel olmasından siz sorumlusunuz." }] },
    { id: "fotograf", heading: "Fotoğraf ve Belge Yüklemeleri", blocks: [{ type: "p", text: "Yüklediğiniz görsel ve belgelerin paylaşımına yetkili olduğunuzu beyan edersiniz." }] },
    { id: "teklif", heading: "İlk ve Nihai Teklif", blocks: [{ type: "p", text: "İlk değerlendirme bağlayıcı değildir. Nihai teklif, araç ve belgelerin kontrolünün ardından netleşir." }] },
    { id: "odeme-devir", heading: "Noter, Devir ve Ödeme", blocks: [{ type: "p", text: "Devir ve ödeme adımları, anlaşma sağlandığında resmi süreçle yürütülür. Ödeme yöntemi ve zamanlaması süreçle birlikte belirlenir." }] },
    { id: "yasak", heading: "Yasaklı Kullanım", blocks: [{ type: "p", text: "Siteyi hukuka aykırı, yanıltıcı veya zarar verici amaçlarla kullanmak yasaktır." }] },
    { id: "fikri-mulkiyet", heading: "Fikri Mülkiyet", blocks: [{ type: "p", text: "Sitedeki içerik ve tasarımlar ilgili hak sahiplerine aittir; izinsiz kullanılamaz." }] },
    { id: "sorumluluk", heading: "Sorumluluğun Sınırlandırılması", blocks: [{ type: "p", text: "Site içeriği bilgilendirme amaçlıdır. Mevzuatın izin verdiği ölçüde, dolaylı zararlardan sorumluluk kabul edilmez. Tüketici mevzuatından doğan haklar saklıdır." }] },
    { id: "mucbir", heading: "Mücbir Sebep", blocks: [{ type: "p", text: "Mücbir sebep hâllerinde hizmetlerde aksama yaşanabilir." }] },
    { id: "degisiklik", heading: "Koşullarda Değişiklik", blocks: [{ type: "p", text: "Bu koşullar güncellenebilir; güncel sürüm bu sayfada yayımlanır." }] },
    { id: "iletisim", heading: "İletişim", blocks: [{ type: "p", text: `Sorularınız için ${siteConfig.email} adresine ulaşabilirsiniz.` }] },
  ],
};

export const legalNoticeDoc: LegalDoc = {
  eyebrow: "İnternet Sitesi Bilgilendirmesi",
  title: "Yasal Uyarı",
  intro:
    "Bu Yasal Uyarı, internet sitemizin içeriğine ve kullanımına ilişkin genel bilgilendirmeleri içerir.",
  lastUpdated: UPDATED,
  href: routes.legalNotice,
  breadcrumbLabel: "Yasal Uyarı",
  sections: [
    { id: "genel", heading: "Genel Bilgilendirme", blocks: [{ type: "p", text: `Bu site ${controller} tarafından işletilmektedir. Sitenin kullanımı bu uyarıda belirtilen koşullara tabidir.` }] },
    { id: "icerik", heading: "İçeriğin Niteliği", blocks: [{ type: "p", text: "Sitedeki bilgiler genel bilgilendirme amaçlıdır ve hukuki veya mali tavsiye niteliği taşımaz." }] },
    { id: "deger", heading: "Değerlendirme ve Fiyat Bilgisi", blocks: [{ type: "p", text: "Sitede yer alan değerlendirme ifadeleri tahmini ve bilgilendirme amaçlıdır. Kesin teklif, aracın ve belgelerin kontrolünün ardından oluşur." }] },
    { id: "blog", heading: "Blog ve Rehber İçerikleri", blocks: [{ type: "p", text: "Blog ve rehber içerikleri genel niteliktedir; kişiye özel profesyonel danışmanlık yerine geçmez." }] },
    { id: "gorseller", heading: "Görseller ve Temsili İçerik", blocks: [{ type: "p", text: "Sitede kullanılan bazı görseller temsilidir." }] },
    { id: "dis-baglantilar", heading: "Dış Bağlantılar", blocks: [{ type: "p", text: "Site, üçüncü taraf sitelere bağlantılar içerebilir. Bu sitelerin içeriğinden sorumlu değiliz." }] },
    { id: "dolandiricilik", heading: "Dolandırıcılık ve Güvenli İletişim", blocks: [{ type: "p", text: "Güvenliğiniz için yalnızca sitedeki resmi iletişim kanallarını kullanın. Resmi olmayan kanallar üzerinden yapılan ödeme talepleri konusunda dikkatli olun." }] },
    { id: "sorumluluk", heading: "Sorumluluğun Sınırı", blocks: [{ type: "p", text: "Mevzuatın izin verdiği ölçüde, site kullanımından doğabilecek dolaylı zararlardan sorumluluk kabul edilmez." }] },
    { id: "tuketici", heading: "Tüketici Hakları", blocks: [{ type: "p", text: "Tüketici mevzuatından doğan haklarınız saklıdır." }] },
    { id: "iletisim", heading: "İletişim", blocks: [{ type: "p", text: `Sorularınız için ${siteConfig.email} adresine ulaşabilirsiniz.` }] },
  ],
};
