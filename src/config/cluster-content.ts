/**
 * National, non-geographic damage-type cluster pages (master prompt Phase 3).
 *
 * ONE page per damage type, not one per phrasing — "X araç alan",
 * "X araç alım yapan yerler" and "X araç alan firmalar" return near-identical
 * SERPs (confirmed via live Google SERP research, 2026-09-14: identical
 * autocomplete/organic results for all three phrasings across hasarlı,
 * kazalı, pert and hurda). Separate pages would cannibalise each other, so
 * each phrasing is covered here via its own H2 instead.
 *
 * "/" (the homepage) is the hasarlı cluster page — no separate route for it.
 *
 * FAQ questions are adapted from real "İnsanlar Ayrıca Soruyor" (PAA) and AI
 * Overview questions captured in that same research pass (saved at
 * ~/MyRestProjects/ArabaAnahtarKelimeler/google-serp-*-2026-09-14.md) — the
 * wording here is original, but the questions answer real, observed search
 * intent rather than invented ones. Process facts (MTV/fines before hurda,
 * insurer pert declaration + clear ownership before pert sale) are likewise
 * real, verifiable prerequisites surfaced by that research, not invented.
 */

export interface ClusterVariantSection {
  h2: string;
  body: string;
}

export interface ClusterDefinition {
  term: string;
  body: string;
}

export interface ClusterPageContent {
  slug: string;
  routeKey: "kazaliAracAlan" | "pertAracAlan" | "hurdaAracAlan";
  metaTitle: string;
  metaDescription: string;
  /** Short noun-phrase form used in FAQ headings, related-content cards etc. */
  shortTitle: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  heroAlt: string;
  intro: string[];
  variantSections: ClusterVariantSection[];
  definitions?: ClusterDefinition[];
  processFact?: string;
  faqs: { q: string; a: string }[];
  /** /arac-alimi/ slugs this cluster page links to for deeper condition info. */
  relatedConditionSlugs: string[];
  /** ISO date this page's content was last meaningfully edited — drives sitemap lastmod. */
  lastUpdated: string;
}

export const clusterPages: ClusterPageContent[] = [
  {
    slug: "kazali-arac-alan",
    routeKey: "kazaliAracAlan",
    metaTitle: "Kazalı Araç Alan Firmalar — Alım Yapan Yerler",
    metaDescription:
      "Kazalı aracınızı doğrudan alıyoruz. Kazalı araç alan firmalar ve alım yapan yerler arıyorsanız, ücretsiz değerlendirme ile aynı gün teklif alın.",
    shortTitle: "Kazalı Araç Alımı",
    heroEyebrow: "Türkiye Geneli",
    heroTitle: "Kazalı Araç Alan Firma mı Arıyorsunuz?",
    heroDescription:
      "Trafik kazası kaydı bulunan aracınızı, kaydın büyüklüğüne bakılmaksızın bulunduğunuz yerden değerlendiriyoruz.",
    heroImage: "/images/heroes/3.webp",
    heroAlt: "Ön tarafı trafik kazası sonucu hasar görmüş otomobil",
    intro: [
      "“Kazalı araç alan”, “kazalı araç alım yapan yerler” ve “kazalı araç alan firmalar” ifadeleri aslında aynı ihtiyacı anlatır: kaza kaydı bulunan bir aracı doğrudan, ilan beklemeden satmak. Bu sayfada üçünü de tek bir süreçte karşılıyoruz.",
      "Kaza kaydı hafif bir tampon darbesinden ağır gövde hasarına kadar geniş bir aralığı kapsar; hangi seviyede olursa olsun aracınızı değerlendiriyoruz.",
    ],
    variantSections: [
      {
        h2: "Kazalı Araç Alan Firmalar Nasıl Değerlendirme Yapar?",
        body: "Aracın kaza kaydı, hasarın bulunduğu bölge ve mevcut fiziki durumu bir bütün olarak ele alınır. Değerlendirme kayda değil, aracın fiili durumuna göre yapılır; bu yüzden onarım geçmişi net olmayan araçlar da başvuru kabul edilir.",
      },
      {
        h2: "Kazalı Araç Alım Yapan Yerler Hangi Bilgileri İster?",
        body: "Araç ruhsatı, varsa ekspertiz raporu ve aracın güncel fotoğrafları süreci hızlandırır. Ekspertiz raporu zorunlu değildir; olmadan da değerlendirme talebi oluşturulabilir.",
      },
      {
        h2: "Trafik Kaza Kaydı Aracın Değerini Nasıl Etkiler?",
        body: "Trafik sigortası kapsamında işlenen kaza kayıtları TRAMER sisteminde tutulur ve alıcılar tarafından görülebilir olduğu için ikinci el piyasasında değer kaybına yol açar. Bu, hasarlı araç alım modelinin var olma sebebidir: kayıtlı araçlar için de doğrudan, şeffaf bir değerlendirme sunulur.",
      },
    ],
    faqs: [
      {
        q: "Kazalı aracımı nereye satabilirim?",
        a: "Kaza kaydı bulunan aracınızı doğrudan bize satabilirsiniz; ilan açmanıza veya alıcı bulmanıza gerek kalmaz. Fotoğraf ve bilgi paylaşımının ardından değerlendirme yapılır ve teklif iletilir.",
      },
      {
        q: "Ekspertiz raporu olmadan kazalı aracımı satabilir miyim?",
        a: "Evet. Ekspertiz raporu zorunlu değildir; varsa süreci hızlandırır ama olmadan da değerlendirme talebi oluşturabilirsiniz.",
      },
      {
        q: "Kazalı araç alan firmalar hangi belgeleri ister?",
        a: "Genellikle araç ruhsatı yeterlidir; devir aşamasında kimlik bilgisi gerekir. Varsa çekme belgesi ve servis kayıtları faydalı olur ama şart değildir.",
      },
      {
        q: "Tramerli araç da kazalı sayılır mı?",
        a: "Evet. TRAMER kaydı, aracın geçmişte bir sigorta hasar dosyası açtığını gösterir; bu da aracı kazalı araç kategorisine sokar. Kayıt küçük veya büyük olsun, değerlendirmeye alınır.",
      },
    ],
    relatedConditionSlugs: ["kazali-arac-alimi", "agir-hasarli-arac-alimi"],
    lastUpdated: "2026-09-14",
  },
  {
    slug: "pert-arac-alan",
    routeKey: "pertAracAlan",
    metaTitle: "Pert Araç Alan Firmalar — Alım Yapan Yerler",
    metaDescription:
      "Pert kayıtlı aracınızı doğrudan alıyoruz. Pert araç alan firmalar ve alım yapan yerler arıyorsanız, sigorta süreciyle uyumlu değerlendirme alın.",
    shortTitle: "Pert Araç Alımı",
    heroEyebrow: "Türkiye Geneli",
    heroTitle: "Pert Araç Alan Firma mı Arıyorsunuz?",
    heroDescription:
      "Sigorta tarafından pert kaydı düşülmüş veya pert muhtemel aracınız için doğrudan değerlendirme alın.",
    heroImage: "/images/heroes/4.webp",
    heroAlt: "Ön tarafı ağır hasarlı, pert durumundaki otomobil",
    intro: [
      "“Pert araç alan”, “pert araç alım yapan yerler” ve “pert araç alan firmalar” ifadeleri de aynı ihtiyacı tarif eder: sigortadan pert çıkmış veya pert muhtemel bir aracı doğrudan satmak. Bu sayfa üçünü de tek süreçte karşılar.",
      "Pert süreci sigorta tarafıyla iç içe ilerlediği için, aşağıda önce iki temel tanım netleştiriliyor; ardından değerlendirme süreci anlatılıyor.",
    ],
    definitions: [
      {
        term: "Ağır Hasarlı (Pert)",
        body: "Onarımı teknik olarak mümkün olan, ancak onarım maliyeti aracın değerine yaklaşan; ya da tavan, şasi veya hava yastığı gibi kritik noktalarında hasar bulunan araçlardır.",
      },
      {
        term: "Hurda Belgeli",
        body: "Onarımı teknik olarak mümkün olmayan, yalnızca parça veya hurda değeri taşıyan araçlardır. Pert ile karıştırılır ama farklı bir kategoridir — bakınız: hurda araç alan.",
      },
    ],
    variantSections: [
      {
        h2: "Pert Araç Alan Firmalar Nasıl Teklif Verir?",
        body: "Teklif, aracın pert kaydındaki hasar bilgisi ve fiili durumu birlikte değerlendirilerek oluşturulur. Sovtaj bedeli düşülerek sigortadan ödeme almış araçlar da değerlendirmeye alınır.",
      },
      {
        h2: "Pert Araç Alım Yapan Yerler Sigorta Süreciyle Nasıl Çalışır?",
        body: "Sigorta şirketinin pert kararı ve araç mülkiyeti netleşmeden nihai teklif verilemez; bu, sürecin doğal ve gerekli bir adımıdır. Süreç bu adımla uyumlu şekilde planlanır.",
      },
    ],
    processFact:
      "Pert aracınızı satabilmeniz için sigorta şirketinin resmi olarak pert kaydını düşmüş olması ve araç mülkiyetinin netleşmiş olması gerekir. Bu iki koşul netleşmeden nihai teklif verilemez.",
    faqs: [
      {
        q: "Pert araba nasıl satılır?",
        a: "Sigorta tarafından pert kaydı düşülmüş veya mülkiyeti netleşmiş bir aracı doğrudan bize satabilirsiniz. Araç bilgisi ve fotoğraf paylaşımının ardından değerlendirme yapılır.",
      },
      {
        q: "Pert aracımı satmak için ne gerekir?",
        a: "Sigorta şirketinin resmi pert kararı ve araç mülkiyetinin netleşmiş olması gerekir. Bu iki koşul sağlandığında nihai teklif verilebilir.",
      },
      {
        q: "Pert araçların satışı yasak mı?",
        a: "Hayır, yasak değildir. Sigorta kaydı ve mülkiyet netleştikten sonra pert bir aracı satmak mümkündür; süreç bu netleşmenin ardından ilerler.",
      },
      {
        q: "Sovtaj nedir?",
        a: "Sovtaj, sigortanın pert olarak değerlendirdiği bir aracın hurda/hasarlı değerini tazminattan düşmesidir. Sovtaj bedeli düşülerek ödeme yapılan araçlar da tarafımızca değerlendirilir.",
      },
    ],
    relatedConditionSlugs: ["pert-arac-alimi", "agir-hasarli-arac-alimi"],
    lastUpdated: "2026-09-14",
  },
  {
    slug: "hurda-arac-alan",
    routeKey: "hurdaAracAlan",
    metaTitle: "Hurda Araç Alan Firmalar — Alım Yapan Yerler",
    metaDescription:
      "Hurda aracınızı doğrudan alıyoruz. Hurda araç alan firmalar, alım yapan yerler veya hurdacı arıyorsanız, resmi belgeli işlemle değerlendirme alın.",
    shortTitle: "Hurda Araç Alımı",
    heroEyebrow: "Türkiye Geneli",
    heroTitle: "Hurda Araç Alan Firma mı, Hurdacı mı Arıyorsunuz?",
    heroDescription:
      "Ekonomik ömrünü tamamlamış veya hurda durumundaki aracınızı resmi belgeli işlemle değerlendiriyoruz.",
    heroImage: "/images/heroes/6.webp",
    heroAlt: "Hurda durumundaki eski, paslı araç",
    intro: [
      "“Hurda araç alan”, “hurda araç alım yapan yerler”, “hurda araç alan firmalar” ve günlük dilde sık kullanılan “hurdacı” ifadesi aynı ihtiyacı tarif eder: hurda durumundaki bir aracı resmi yoldan elden çıkarmak. Bu sayfa hepsini tek süreçte karşılar.",
      "Hurdaya ayırmadan önce netleştirilmesi gereken gerçek bir ön koşul var — aşağıda açıkça belirtiyoruz.",
    ],
    variantSections: [
      {
        h2: "Hurda Araç Alan Firmalar ile Hurdacı Arasındaki Fark Nedir?",
        body: "“Hurdacı” günlük dilde kullanılan bir terimdir ve hurda araç alan firmalarla aynı ihtiyacı karşılar. Bizde fark, sürecin resmi belgeli ve şeffaf ilerlemesidir.",
      },
      {
        h2: "Hurda Araç Alım Yapan Yerler Süreci Nasıl İşler?",
        body: "Araç bilgisi ve fotoğraf paylaşımının ardından değerlendirme yapılır, teklif iletilir; anlaşma sağlanırsa hurda belgeli devir süreci planlanır.",
      },
    ],
    processFact:
      "Hurdaya ayırmadan önce aracın MTV (Motorlu Taşıtlar Vergisi) borcunun ve varsa trafik cezalarının kapatılmış olması gerekir. Bu, hurda devri için gerekli resmi bir ön koşuldur.",
    faqs: [
      {
        q: "Hurda arabamı nereye satabilirim?",
        a: "Hurda durumundaki aracınızı doğrudan bize satabilirsiniz; resmi hurda belgeli işlem süreç boyunca sizinle birlikte planlanır.",
      },
      {
        q: "Hurdaya araba vermeden önce ne yapmalıyım?",
        a: "Aracın MTV borcunun ve varsa trafik cezalarının kapatılmış olması gerekir. Bu adım tamamlanmadan hurda devri resmi olarak sonuçlandırılamaz.",
      },
      {
        q: "Hurdacı arabayı kaça alır?",
        a: "Sabit bir rakam yoktur; fiyat aracın markası, model yılı ve fiziki durumuna göre değişir. Güncel fotoğraf ve bilgi paylaşarak aracınıza özel bir değerlendirme alabilirsiniz.",
      },
      {
        q: "Hurda aracımı nereye verebilirim?",
        a: "Aracınızı bulunduğunuz yerden değerlendiriyoruz; anlaşma sonrası teslim alma ve hurda belgeli devir süreci birlikte planlanır.",
      },
    ],
    relatedConditionSlugs: ["hurda-arac-alimi", "cekme-belgeli-arac-alimi"],
    lastUpdated: "2026-09-14",
  },
];

export function getClusterPage(slug: string): ClusterPageContent | undefined {
  return clusterPages.find((c) => c.slug === slug);
}
