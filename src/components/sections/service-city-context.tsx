import Link from "next/link";
import { routes } from "@/config/navigation";
import { Section } from "@/components/ui/section";

/**
 * One short, genuinely-relevant paragraph per /arac-alimi/ page, linking to
 * 2-4 city/district pages in real sentences (not a link list). Distribution
 * follows the Search Console indexing tiers (2026-09-14 diagnosis):
 *
 *   Tier 1 (never crawled, footer-only referrers) gets the most links, from
 *   these strongest content pages: ankara, bursa, adana, ankara/kecioren,
 *   bursa/osmangazi, istanbul/basaksehir, istanbul/umraniye, izmir/buca,
 *   izmir/karsiyaka, izmir/konak.
 *   Tier 2 (indexed but under 50 impressions) gets fewer: konya, gaziantep,
 *   istanbul, kocaeli, mersin, kayseri.
 *   Tier 3 (izmir, samsun, antalya provinces — already performing) gets
 *   none here; they're linked from the homepage instead.
 *
 * Where a city has a real, checkable reason to fit the condition (Bursa's
 * car plants for motor/mechanical faults, Akdeniz/Marmara coastal cities
 * for flood damage), the link uses that reason. Elsewhere it's a plain,
 * honest coverage mention — never a fabricated local-presence claim.
 */

const R = routes;

const PARAGRAPHS: Record<string, React.ReactNode> = {
  "hasarli-arac-alimi": (
    <>
      Bu değerlendirmeyi Türkiye genelinde yürütüyoruz;{" "}
      <Link href={R.city("ankara")} className="text-burgundy-700 underline hover:no-underline">
        Ankara
      </Link>
      ,{" "}
      <Link href={R.district("istanbul", "umraniye")} className="text-burgundy-700 underline hover:no-underline">
        İstanbul&apos;un Ümraniye
      </Link>{" "}
      ve{" "}
      <Link href={R.district("izmir", "konak")} className="text-burgundy-700 underline hover:no-underline">
        İzmir&apos;in Konak
      </Link>{" "}
      ilçesinden gelen talepler de aynı süreçle değerlendirilir.
    </>
  ),
  "kazali-arac-alimi": (
    <>
      Trafik yoğunluğu yüksek bölgelerde kaza sonrası değerlendirme talebi de artıyor; bu nedenle{" "}
      <Link href={R.district("istanbul", "basaksehir")} className="text-burgundy-700 underline hover:no-underline">
        İstanbul&apos;un Başakşehir
      </Link>
      ,{" "}
      <Link href={R.district("izmir", "buca")} className="text-burgundy-700 underline hover:no-underline">
        İzmir&apos;in Buca
      </Link>{" "}
      ve{" "}
      <Link href={R.district("ankara", "kecioren")} className="text-burgundy-700 underline hover:no-underline">
        Ankara&apos;nın Keçiören
      </Link>{" "}
      ilçesinden gelen kazalı araç başvurularını da yerinde değerlendiriyoruz.
    </>
  ),
  "pert-arac-alimi": (
    <>
      Sigorta şirketi tarafından pert kaydı düşülen araçlar için{" "}
      <Link href={R.city("adana")} className="text-burgundy-700 underline hover:no-underline">
        Adana
      </Link>
      ,{" "}
      <Link href={R.district("bursa", "osmangazi")} className="text-burgundy-700 underline hover:no-underline">
        Bursa&apos;nın Osmangazi
      </Link>{" "}
      ve{" "}
      <Link href={R.city("gaziantep")} className="text-burgundy-700 underline hover:no-underline">
        Gaziantep
      </Link>{" "}
      bölgesinden de düzenli talep alıyoruz.
    </>
  ),
  "agir-hasarli-arac-alimi": (
    <>
      Onarım maliyeti aracın değerine yaklaşan ağır hasarlı araçlar için{" "}
      <Link href={R.district("izmir", "karsiyaka")} className="text-burgundy-700 underline hover:no-underline">
        İzmir&apos;in Karşıyaka
      </Link>
      ,{" "}
      <Link href={R.district("izmir", "konak")} className="text-burgundy-700 underline hover:no-underline">
        Konak
      </Link>{" "}
      ilçeleri ile{" "}
      <Link href={R.city("kayseri")} className="text-burgundy-700 underline hover:no-underline">
        Kayseri
      </Link>{" "}
      genelinden gelen başvurular da bu kapsamda değerlendirilir.
    </>
  ),
  "motor-arizali-arac-alimi": (
    <>
      Motor arızası, otomotiv üretiminin yoğun olduğu bölgelerde daha sık karşımıza çıkıyor;{" "}
      <Link href={R.city("bursa")} className="text-burgundy-700 underline hover:no-underline">
        Bursa
      </Link>{" "}
      ve{" "}
      <Link href={R.city("kocaeli")} className="text-burgundy-700 underline hover:no-underline">
        Kocaeli
      </Link>{" "}
      gibi sanayi bölgelerinden gelen motor arızalı araç taleplerini de değerlendiriyoruz.
    </>
  ),
  "mekanik-arizali-arac-alimi": (
    <>
      Ekonomik onarımı zor mekanik arızalarda{" "}
      <Link href={R.city("konya")} className="text-burgundy-700 underline hover:no-underline">
        Konya
      </Link>{" "}
      ve{" "}
      <Link href={R.city("mersin")} className="text-burgundy-700 underline hover:no-underline">
        Mersin
      </Link>{" "}
      bölgesindeki araç sahiplerinden de sıkça değerlendirme talebi alıyoruz.
    </>
  ),
  "calismayan-arac-alimi": (
    <>
      Çalışmayan veya marş almayan araçlar için{" "}
      <Link href={R.city("istanbul")} className="text-burgundy-700 underline hover:no-underline">
        İstanbul
      </Link>{" "}
      ve{" "}
      <Link href={R.city("ankara")} className="text-burgundy-700 underline hover:no-underline">
        Ankara
      </Link>{" "}
      gibi büyük şehirlerde de aracınızı bulunduğu yerden ücretsiz çekici ile teslim alıyoruz.
    </>
  ),
  "yanmis-arac-alimi": (
    <>
      Yangın hasarı görmüş araçlar için{" "}
      <Link href={R.city("adana")} className="text-burgundy-700 underline hover:no-underline">
        Adana
      </Link>{" "}
      ve{" "}
      <Link href={R.city("kayseri")} className="text-burgundy-700 underline hover:no-underline">
        Kayseri
      </Link>{" "}
      gibi sıcak ve kurak iklime sahip bölgelerden de değerlendirme talebi alıyoruz.
    </>
  ),
  "sel-hasarli-arac-alimi": (
    <>
      Ani sağanak ve taşkınların daha sık görüldüğü{" "}
      <Link href={R.city("kocaeli")} className="text-burgundy-700 underline hover:no-underline">
        Kocaeli
      </Link>{" "}
      ve{" "}
      <Link href={R.city("mersin")} className="text-burgundy-700 underline hover:no-underline">
        Mersin
      </Link>{" "}
      gibi bölgelerde sel ve su hasarı görmüş araç sahiplerine süreç boyunca destek oluyoruz.
    </>
  ),
  "hurda-arac-alimi": (
    <>
      Ekonomik ömrünü tamamlamış araçlar için{" "}
      <Link href={R.district("bursa", "osmangazi")} className="text-burgundy-700 underline hover:no-underline">
        Bursa&apos;nın Osmangazi
      </Link>{" "}
      ilçesi ile{" "}
      <Link href={R.city("gaziantep")} className="text-burgundy-700 underline hover:no-underline">
        Gaziantep
      </Link>{" "}
      bölgesinden gelen hurda araç başvurularını da resmi belgeli olarak değerlendiriyoruz.
    </>
  ),
  "cekme-belgeli-arac-alimi": (
    <>
      Trafikten çekilmiş, çekme belgeli araçlar için{" "}
      <Link href={R.city("ankara")} className="text-burgundy-700 underline hover:no-underline">
        Ankara
      </Link>
      ,{" "}
      <Link href={R.district("izmir", "konak")} className="text-burgundy-700 underline hover:no-underline">
        İzmir&apos;in Konak
      </Link>{" "}
      ve{" "}
      <Link href={R.district("istanbul", "umraniye")} className="text-burgundy-700 underline hover:no-underline">
        İstanbul&apos;un Ümraniye
      </Link>{" "}
      ilçesinden de teklif talebi alıyoruz.
    </>
  ),
};

export function ServiceCityContext({ slug }: { slug: string }) {
  const paragraph = PARAGRAPHS[slug];
  if (!paragraph) return null;
  return (
    <Section tone="white" className="py-8 md:py-10">
      <div className="max-w-[760px]">
        <p className="text-[15px] leading-relaxed text-ink-secondary">{paragraph}</p>
      </div>
    </Section>
  );
}
