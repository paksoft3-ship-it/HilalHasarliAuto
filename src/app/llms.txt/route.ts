import { siteConfig } from "@/config/site";
import { routes } from "@/config/navigation";
import { services } from "@/config/services";
import { publishedCities } from "@/config/cities";
import { guides } from "@/config/guides";
import { blogPosts } from "@/config/blog";

/**
 * /llms.txt — concise, structured index of published public content for LLMs.
 * Never includes lead/admin/private data, drafts, or secrets (master prompt §10).
 */
export function GET() {
  const base = siteConfig.domain;
  const line = (label: string, path: string) => `- [${label}](${base}${path})`;

  const body = `# ${siteConfig.brandName}

> ${siteConfig.brandName}, Türkiye genelinde hasarlı, kazalı, pert, arızalı, çalışmayan, yanmış, sel hasarlı, hurda ve çekme belgeli araçlar için değerlendirme ve satın alma süreci sunan bir araç alım hizmetidir.

## Ana Sayfalar
${line("Ana Sayfa", routes.home)}
${line("Teklif Al", routes.getOffer)}
${line("Hangi Araçları Alıyoruz?", routes.vehiclesWeBuy)}
${line("Nasıl Çalışır?", routes.howItWorks)}
${line("Hakkımızda", routes.about)}
${line("Sık Sorulan Sorular", routes.faq)}
${line("İletişim", routes.contact)}
${line("Hizmet Bölgeleri", routes.serviceAreas)}

## Hizmetler
${services.map((s) => line(s.title, routes.service(s.slug))).join("\n")}

## Hizmet Bölgeleri
${publishedCities.map((c) => line(`${c.name} Hasarlı Araç Alımı`, routes.city(c.slug))).join("\n")}

## Rehberler
${guides.map((g) => line(g.title, routes.guide(g.slug))).join("\n")}

## Blog
${blogPosts.map((p) => line(p.title, routes.blogPost(p.slug))).join("\n")}

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
