import { siteConfig } from "@/config/site";
import { routes } from "@/config/navigation";
import { services } from "@/config/services";
import { publishedCities } from "@/config/cities";
import { guides } from "@/config/guides";
import { getPublicBlogPosts } from "@/lib/cms/public-content";
import { getPublicSettings } from "@/lib/settings/server";

// Cache; CMS publish revalidates this route explicitly.
export const revalidate = 3600;

/**
 * /llms.txt — concise, structured index of published public content for LLMs
 * (ChatGPT, Claude, Gemini, Perplexity, DeepSeek etc.).
 * Never includes lead/admin/private data, drafts, or secrets (master prompt §10).
 */
export async function GET() {
  const base = siteConfig.domain;
  const line = (label: string, path: string, desc?: string) =>
    `- [${label}](${base}${path})${desc ? `: ${desc}` : ""}`;

  const [settings, blogPosts] = await Promise.all([
    getPublicSettings(),
    getPublicBlogPosts(),
  ]);

  const body = `# ${settings.brandName}

> ${settings.brandName}, Türkiye genelinde hasarlı, kazalı, pert, arızalı, çalışmayan, yanmış, sel hasarlı, hurda ve çekme belgeli araçlar için değerlendirme ve satın alma süreci sunan bir araç alım hizmetidir. Araç sahibi fotoğraf ve araç bilgisiyle başvurur, değerlendirme sonrası teklif iletilir; anlaşma halinde noter devri ve ödeme süreci yürütülür.

## Hızlı Bilgiler
- Hizmet türü: Hasarlı / kazalı / pert / arızalı araç alımı (Türkiye)
- Teklif almak için: ${base}${routes.getOffer}
- Telefon: ${settings.phoneDisplay} (${settings.phoneE164})
- WhatsApp: ${settings.whatsappE164}
- E-posta: ${settings.email}
- Çalışma saatleri: ${settings.workingHours}

## Ana Sayfalar
${line("Ana Sayfa", routes.home)}
${line("Teklif Al", routes.getOffer, "Araç bilgisi ve fotoğrafla ücretsiz değerlendirme talebi")}
${line("Hangi Araçları Alıyoruz?", routes.vehiclesWeBuy)}
${line("Nasıl Çalışır?", routes.howItWorks, "Başvuru, değerlendirme, teklif ve devir adımları")}
${line("Hakkımızda", routes.about)}
${line("Sık Sorulan Sorular", routes.faq)}
${line("İletişim", routes.contact)}
${line("Hizmet Bölgeleri", routes.serviceAreas)}

## Hizmetler
${services.map((s) => line(s.title, routes.service(s.slug), s.short)).join("\n")}

## Hizmet Bölgeleri
${publishedCities.map((c) => line(`${c.name} Hasarlı Araç Alımı`, routes.city(c.slug))).join("\n")}

## Rehberler
${guides.map((g) => line(g.title, routes.guide(g.slug), g.description)).join("\n")}

## Blog
${blogPosts.map((p) => line(p.title, routes.blogPost(p.slug), p.excerpt)).join("\n")}

## Yasal
${line("Gizlilik Politikası", routes.privacy)}
${line("KVKK Aydınlatma Metni", routes.kvkk)}
${line("Çerez Politikası", routes.cookies)}
${line("Kullanım Koşulları", routes.terms)}
${line("Yasal Uyarı", routes.legalNotice)}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
