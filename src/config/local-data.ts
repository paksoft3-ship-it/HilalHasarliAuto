/**
 * Hand-written unique local content per city and district (master prompt:
 * a location page is published only with unique approved content). Replaces
 * the single-template metadata in lib/seo/local-copy so no two location
 * pages — here or on any sister site — share a meta description or paragraph.
 *
 * Voice: nationwide buyer ("Türkiye geneli alım ağı") — the regional sister
 * sites carry the region-insider voice, this site carries the network voice.
 */

export interface CityContent {
  citySlug: string;
  /** SEO <title> without brand (layout template appends " | <brand>"). */
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  /** Hero lead paragraph. */
  intro: string;
  /** Two unique on-page paragraphs about buying cars in this city. */
  about: string[];
  /** Local logistics bullets specific to this city. */
  localPoints: string[];
  faqs: { q: string; a: string }[];
  /** Hero image index so city pages don't all share one image. */
  heroImage: number;
  heroAlt: string;
}

export interface DistrictContent {
  districtSlug: string;
  citySlug: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  lead: string;
  /** Two unique paragraphs about this district. */
  body: string[];
  points: string[];
  faqs: { q: string; a: string }[];
}

export const cityContent: CityContent[] = [
  {
    citySlug: "istanbul",
    metaTitle: "İstanbul Hasarlı Araç Alan Yerler — 39 İlçede Kazalı Alımı",
    metaDescription:
      "İstanbul'un iki yakasında, 39 ilçenin tamamında hasarlı, kazalı, pert ve hurda araç alımı. Ücretsiz çekici, 30 dakikada değerlendirme, aynı gün nakit ödeme.",
    heroTitle: "İstanbul'da Hasarlı Aracınız İki Yakada da Nakit Alınır",
    intro:
      "Türkiye'nin en büyük araç parkına sahip İstanbul'da günde binlerce kaza yaşanıyor. Avrupa veya Anadolu yakası fark etmeksizin, aracınız 39 ilçenin hangisinde olursa olsun yerinden alıyoruz.",
    about: [
      "İstanbul'da hasarlı araç satmanın en büyük zorluğu lojistiktir: köprü geçişleri, trafik ve otopark maliyetleri, hasarlı bir aracı alıcıya götürmeyi çoğu zaman imkânsız kılar. Bu yüzden süreci tersine kurduk — alıcı aracın ayağına gelir. E-5 ve TEM aksındaki kazalardan site otoparklarında bekleyen araçlara kadar her başvuruda çekici ücretsiz gönderilir.",
      "Şehrin yoğunluğu değer kaybı ve tramer kayıtlı araç sayısını da artırır; İstanbul başvurularının önemli bölümü kaza kaydı yüksek ama mekaniği sağlam araçlardır. Bu araçlarda kayda değil, aracın fiili durumuna göre teklif verir; noter randevusunu size en yakın ilçede planlarız.",
    ],
    localPoints: [
      "Avrupa ve Anadolu yakasında ayrı çekici ağı",
      "39 ilçenin tamamında yerinden alım",
      "Site ve kapalı otoparklardan çıkarma dahil",
      "Size en yakın noterde aynı gün devir",
    ],
    faqs: [
      {
        q: "İstanbul'da hasarlı aracımı satmak için karşı yakaya geçmem gerekir mi?",
        a: "Hayır. Ekspertiz, çekici ve noter işlemlerinin tamamı aracın bulunduğu yakada planlanır. Kadıköy'deki bir araç için Avrupa yakasına geçmeniz gerekmez; randevu size en yakın noterden alınır.",
      },
      {
        q: "E-5'te kaza yaptım, aracım yediemin otoparkında; alıyor musunuz?",
        a: "Alıyoruz. Yediemin ve özel otoparklarda bekleyen araçlar İstanbul başvurularının önemli bölümüdür; otopark çıkış işlemleri ve borç hesaplaşması devirde şeffaf biçimde yapılır.",
      },
      {
        q: "İstanbul trafiğinde çekici ne kadar sürede gelir?",
        a: "Teklif kabulünden sonra çekici genellikle aynı gün içinde planlanır; yoğun saatlerde randevu saatini birlikte belirleriz. Ücret her durumda tarafımıza aittir.",
      },
    ],
    heroImage: 1,
    heroAlt: "İstanbul E-5 karayolunda önden hasarlı bir otomobil",
  },
  {
    citySlug: "ankara",
    metaTitle: "Ankara Hasarlı ve Kazalı Araç Alan Yerler — Hurda Alımı",
    metaDescription:
      "Ankara'nın tüm ilçelerinde hasarlı, kazalı, pert ve hurda araç alımı. Kış buzlanması kazaları dahil ücretsiz çekici, hızlı değerlendirme, nakit ödeme.",
    heroTitle: "Ankara'da Hasarlı Araç Alımının Adresi",
    intro:
      "Başkentin geniş bulvarlarından çevre yoluna, Çankaya'dan Sincan'a kadar Ankara'nın her noktasında hasarlı aracınızı nakit değerlendiriyoruz.",
    about: [
      "Ankara'nın araç profili kendine özgüdür: bakımlı kullanılan ama yaşı ilerlemiş memur araçları, geniş bulvarların yüksek hızlı kavşak kazaları ve uzun kış sezonunun buzlanma hasarları başvuruların ana kaynaklarıdır. Aralık–Mart döneminde buzlanma kazası başvuruları belirgin şekilde artar; bu dönem için çekici kapasitemizi ayrıca planlarız.",
      "Ostim ve İvedik'teki on binlerce işletme Ankara'yı Türkiye'nin en büyük hafif ticari araç pazarlarından biri yapar. Ekonomik ömrünü dolduran esnaf kamyoneti ve panelvanlar için işletme kapısından alım yapıyor, şirket araçlarında fatura ve devir sürecini tek randevuda topluyoruz.",
    ],
    localPoints: [
      "Buzlanma ve kış kazalarında hızlı çekici",
      "Ostim–İvedik esnaf araçlarına yerinde teklif",
      "Çevre yolu kazalarında otoparktan alım",
      "Tüm ilçelerde aynı gün noter randevusu",
    ],
    faqs: [
      {
        q: "Ankara'da buzlanmada kaza yaptım, kasko pert dedi; bana ne kalır?",
        a: "Sigortanın pert işlemi sonrası araç (sovtaj) sizde kaldıysa onu bizden ayrıca nakde çevirebilirsiniz. Pert kayıtlı araçlar en sık aldığımız gruptadır; teklif aracın kalan değerine göre verilir.",
      },
      {
        q: "Şirket üzerine kayıtlı kamyonetimizi Ankara'da nasıl satarız?",
        a: "Yetkili imza ve şirket evraklarıyla devir tek noter randevusunda tamamlanır; satış faturası süreci başvuruda adım adım anlatılır ve ödeme devir anında şirket hesabına yapılır.",
      },
      {
        q: "Polatlı veya Beypazarı gibi uzak ilçelerden alım yapıyor musunuz?",
        a: "Yapıyoruz. Ankara'nın 25 ilçesinin tamamından başvuru alıyoruz; merkez dışı ilçelerde çekici ve randevu takvimi tek seferde planlanır.",
      },
    ],
    heroImage: 2,
    heroAlt: "Ankara'da karlı bir bulvarda hasar almış otomobil",
  },
  {
    citySlug: "izmir",
    metaTitle: "İzmir Hasarlı ve Kazalı Araç Alan Yerler — Hurda Alımı",
    metaDescription:
      "İzmir'in 30 ilçesinde hasarlı, kazalı, pert ve hurda araç alımı. Türkiye geneli alım ağımızla en güçlü teklif, ücretsiz çekici ve nakit ödeme.",
    heroTitle: "İzmir'de Hasarlı Aracınıza Türkiye Ölçeğinde Teklif",
    intro:
      "Türkiye'nin en hareketli ikinci el pazarlarından İzmir'de yerel alıcılarla sınırlı kalmayın: ülke geneline çalışan alım ağımız, aracınıza gerçek piyasa değerinden teklif verir.",
    about: [
      "İzmir'de hasarlı araç fiyatları alıcının ölçeğine göre ciddi değişir; yalnızca kendi çevresine satan yerel alıcılar dar bir pazara göre fiyat verir. Türkiye genelinde çalıştığımız için İzmir'den aldığımız bir aracı ülkenin en doğru pazarında değerlendirebiliyor, bu farkı teklife yansıtabiliyoruz.",
      "Liman ticareti, yoğun şehir trafiği ve körfez ikliminin korozyon etkisi İzmir'in tipik başvuru profilini oluşturur. Konak'tan Bergama'ya, Çeşme'den Ödemiş'e kadar 30 ilçenin tamamında yerinde görüş yapıyor; çekiciyi ücretsiz gönderip ödemeyi noterde nakit teslim ediyoruz.",
    ],
    localPoints: [
      "Ülke geneli ağla güçlü fiyat rekabeti",
      "30 ilçenin tamamına ücretsiz çekici",
      "Körfez korozyonunda şeffaf raporlama",
      "Aynı gün ekspertiz randevusu imkânı",
    ],
    faqs: [
      {
        q: "İzmir'deki yerel alıcılardan daha iyi teklif verebilir misiniz?",
        a: "Çoğu durumda evet. Aracı yalnızca İzmir pazarında değil Türkiye genelinde değerlendirdiğimiz için, özellikle pert ve ağır hasarlı araçlarda teklifimiz yerel alıcıların üzerine çıkabilir. Karşılaştırmanızı öneririz — teklif almak ücretsizdir.",
      },
      {
        q: "İzmir'in uzak ilçelerinden (Bergama, Ödemiş, Çeşme) araç alıyor musunuz?",
        a: "Alıyoruz. Merkeze uzak ilçelerde randevu ve çekici tek planlamada birleştirilir; aracınızı hiçbir yere getirmeniz gerekmez.",
      },
      {
        q: "Deniz kenarında duran aracımda paslanma var; yine de değer bulur mu?",
        a: "Bulur. Korozyon teklifi etkiler ama belirleyici olan yaygınlığı ve şasinin durumudur; inceleme sonrası indirimin gerekçesi açıkça gösterilir.",
      },
    ],
    heroImage: 3,
    heroAlt: "İzmir körfez yolunda çekici bekleyen kazalı araç",
  },
  {
    citySlug: "bursa",
    metaTitle: "Bursa Hasarlı Araç Alımı — Kazalı, Pert ve Hurda Alan",
    metaDescription:
      "Otomotivin başkenti Bursa'da hasarlı, kazalı ve pert araç alımı. Sanayi bölgesi ticari araçları dahil ücretsiz çekici ve aynı gün nakit ödeme.",
    heroTitle: "Otomotivin Başkenti Bursa'da Hasarlı Araç Alımı",
    intro:
      "Türkiye'nin otomobil üretim merkezi Bursa'da araç kültürü güçlü, piyasa hareketlidir; hasarlı aracınız için bu pazarı iyi bilen bir alıcıyla çalışın.",
    about: [
      "Bursa, otomotiv fabrikaları ve yan sanayisiyle yaşayan bir şehir olduğundan parça ve onarım ekosistemi Türkiye'nin en gelişmişidir. Bu durum hasarlı araç değerlemesini de etkiler: Bursa'da alınan bir aracın parça değeri yüksektir ve tekliflerimizde bu avantajı satıcıya yansıtırız.",
      "İstanbul–İzmir aksındaki konumu Bursa çevresinde geçiş trafiği kazalarını, Uludağ yolu ise kış sezonunda buzlanma hasarlarını artırır. Nilüfer ve Osmangazi başta olmak üzere 17 ilçenin tamamından başvuru alıyor; organize sanayi bölgelerindeki işletmelerin filo araçlarına toplu teklif veriyoruz.",
    ],
    localPoints: [
      "Güçlü parça piyasasının fiyat avantajı",
      "OSB işletmelerine toplu filo teklifi",
      "Uludağ yolu kış kazalarına çekici desteği",
      "17 ilçede yerinden alım ve nakit ödeme",
    ],
    faqs: [
      {
        q: "Bursa'da hasarlı aracın parça değeri teklife gerçekten yansıyor mu?",
        a: "Yansıyor. Bursa'nın güçlü parça piyasası, özellikle pert ve ağır hasarlı araçlarda kalan değerin yüksek hesaplanmasını sağlar; teklifimizde bu hesabı açıkça görürsünüz.",
      },
      {
        q: "İnegöl veya Gemlik'ten başvuru yapabilir miyim?",
        a: "Yapabilirsiniz. Bursa'nın tüm ilçelerinden alım yapıyoruz; çekici ve noter randevusu ilçenize göre tek seferde planlanır.",
      },
      {
        q: "Uludağ yolunda kaza yaptım, araç dağda; alabilir misiniz?",
        a: "Alabiliriz. Dağ ve yayla yollarına uygun çekici planlaması yapıyoruz; konumu paylaşmanız yeterli, gerisi bizde.",
      },
    ],
    heroImage: 4,
    heroAlt: "Bursa sanayi bölgesinde hasarlı bir otomobil",
  },
  {
    citySlug: "antalya",
    metaTitle: "Antalya Kazalı ve Hasarlı Araç Alan Yerler — Hurda Alımı",
    metaDescription:
      "Antalya'da hasarlı, kazalı, pert ve hurda araç alımı. Türkiye geneli alım ağıyla güçlü teklif; ücretsiz çekici, hızlı değerlendirme, nakit ödeme.",
    heroTitle: "Antalya'da Hasarlı Araçlar Ülke Fiyatından Alınır",
    intro:
      "Turizm sezonunun şişirdiği yerel piyasaya mahkûm değilsiniz: Antalya'daki hasarlı aracınıza Türkiye genelindeki gerçek pazar değerinden teklif veriyoruz.",
    about: [
      "Antalya'nın araç piyasası mevsimseldir — sezonda talep ve fiyatlar yükselir, kışın alıcı bulmak zorlaşır. Ülke genelinde çalışan bir alıcı olarak bizde bu dalgalanma yoktur; aracınız hangi ay olursa olsun aynı ciddiyetle değerlendirilir ve nakde çevrilir.",
      "Şehre her yıl yerleşen on binlerce yeni sakin ve büyüyen araç parkı, kaza ve hasar başvurularını sürekli artırıyor. D400 aksındaki kazalardan kiralama filosu çıkışlarına kadar her başvuruda süreç aynıdır: fotoğrafla hızlı ön değerlendirme, ücretsiz çekici ve noterde nakit ödeme.",
    ],
    localPoints: [
      "Mevsimden bağımsız istikrarlı teklif",
      "Kiralama filosu çıkışlarına toplu alım",
      "D400 kazalarında otoparktan teslim",
      "19 ilçenin tamamında yerinden alım",
    ],
    faqs: [
      {
        q: "Kış aylarında Antalya'da hasarlı araca alıcı bulamıyorum; siz alır mısınız?",
        a: "Alırız. Türkiye geneline çalıştığımız için Antalya'nın sezon dışı durgunluğu teklifimizi etkilemez; başvurunuz hangi ay gelirse gelsin aynı hızda sonuçlanır.",
      },
      {
        q: "Antalya'da aracım kiralama şirketinden alınmıştı, tramer kaydı yoğun; sorun olur mu?",
        a: "Olmaz. Kayıt geçmişi yoğun araçlar işimizin standart parçasıdır; teklif, kayıtların içeriğine ve aracın bugünkü durumuna göre hesaplanır.",
      },
      {
        q: "Alanya'dan veya Kaş'tan başvursam süreç uzar mı?",
        a: "Uzamaz. Uzak ilçelerde çekici ve devir tek takvimde planlanır; çoğu başvuru birkaç iş günü içinde tamamlanır.",
      },
    ],
    heroImage: 5,
    heroAlt: "Antalya sahil yolunda önü hasarlı bir otomobil",
  },
  {
    citySlug: "adana",
    metaTitle: "Adana Hasarlı Araç Alım Satım — Kazalı, Sel ve Hurda",
    metaDescription:
      "Adana'nın tüm ilçelerinde hasarlı, kazalı, pert ve sel hasarlı araç alımı. E-90 ve TAG otoyolu kazaları dahil ücretsiz çekici, nakit ödeme.",
    heroTitle: "Adana'da Her Durumdaki Hasarlı Araç Değerlendirilir",
    intro:
      "Güneyin ticaret merkezi Adana'da otoyol kazalarından ekstrem sıcakların yıprattığı araçlara kadar geniş bir yelpazede alım yapıyoruz.",
    about: [
      "Adana, E-90 ile TAG otoyolunun kesişiminde Türkiye'nin en yoğun transit koridorlarından birini barındırır; şehirler arası yolculukta kaza yapıp aracı Adana'da kalan sürücüler için uzaktan satış süreci kurduk. Fotoğrafla teklif, otoparktan teslim alma ve vekâletli devir — şehre dönmeniz çoğu zaman gerekmez.",
      "Yazları 40 dereceyi aşan sıcaklar motor, şanzıman ve klima arızalarını bölgede olağanlaştırır; ani sağanaklarda su basan araçlar da düzenli başvuru grubudur. Her iki durumda da aracın kalan değerini gerçekçi hesaplar, çekiciyi ücretsiz gönderir ve ödemeyi devirde eksiksiz yaparız.",
    ],
    localPoints: [
      "Transit koridor kazalarında uzaktan satış",
      "Sıcaklık kaynaklı arızalara gerçekçi teklif",
      "Sel ve su hasarlı araç değerlendirmesi",
      "15 ilçenin tamamına ücretsiz çekici",
    ],
    faqs: [
      {
        q: "Adana'dan geçerken kaza yaptım, başka şehirde yaşıyorum; nasıl satarım?",
        a: "Fotoğraf ve evrak bilgileriyle uzaktan başvurursunuz; aracı otoparktan biz teslim alırız. Devri memleketinizdeki noterden vekâletle veya tek günlük bir Adana ziyaretiyle tamamlarsınız.",
      },
      {
        q: "Su basmış aracın elektroniği bozuk; yine de alır mısınız?",
        a: "Alırız. Sel hasarlı araçlarda değer, elektronik ve motorun durumuna göre hesaplanır; araç hiç çalışmasa bile parça değeri üzerinden nakit teklif verilir.",
      },
      {
        q: "Kozan veya Ceyhan'dan başvuru yapabilir miyim?",
        a: "Evet. Adana'nın tüm ilçelerinden başvuru alıyoruz; çekici köy ve belde adreslerine de ücretsiz gönderilir.",
      },
    ],
    heroImage: 6,
    heroAlt: "Adana otoyolunda hasar almış bir araç",
  },
  {
    citySlug: "konya",
    metaTitle: "Konya Hasarlı ve Kazalı Araç Alan — Arızalı, Hurda Alımı",
    metaDescription:
      "Konya ve tüm ilçelerinde hasarlı, kazalı, pert ve arızalı araç alımı. Uzun yol kazaları ve tarım araçları dahil ücretsiz çekici, nakit ödeme.",
    heroTitle: "Konya'da Hasarlı Araç Alımı",
    intro:
      "Türkiye'nin en geniş yüzölçümlü ilinde mesafe bizim işimiz: Konya'nın 31 ilçesinin en ücrasından bile aracınızı ücretsiz çekiciyle alıyoruz.",
    about: [
      "Konya'nın uçsuz bucaksız düz yolları yüksek seyir hızını, o da ağır sonuçlu kazaları beraberinde getirir; Konya–Ankara ve Konya–Adana aksları Türkiye'nin en riskli koridorları arasındadır. Bu yollarda kaza yapan şehir dışı sürücüler için otoparktan alım ve uzaktan devir bizim rutin işleyişimizdir.",
      "Türkiye'nin tahıl ambarı olarak Konya'da tarımda çalışan pikap ve kamyonet parkı çok geniştir; yoğun sezonlarda yıpranan, motoru veya şanzımanı arızalanan tarım araçlarına parça ve ekonomik değeri üzerinden teklif veriyoruz. Ereğli, Akşehir ve Seydişehir dahil tüm ilçelere çekici planlıyoruz.",
    ],
    localPoints: [
      "Uzun yol kazalarında uzaktan satış süreci",
      "Tarım araçlarının köyden ücretsiz alımı",
      "31 ilçenin tamamına çekici ağı",
      "Devirle eş zamanlı nakit ödeme",
    ],
    faqs: [
      {
        q: "Konya'nın uzak bir ilçesindeyim; çekici gerçekten ücretsiz mi gelir?",
        a: "Gelir. Teklifi kabul ettiğiniz her araçta çekici masrafı bize aittir; Ereğli, Akşehir, Beyşehir fark etmez, yalnızca randevu saati mesafeye göre planlanır.",
      },
      {
        q: "Hasat sezonunda bozulan kamyoneti hemen satmam gerekiyor; ne kadar sürer?",
        a: "Fotoğraflarla ön teklif genellikle aynı gün verilir; kabul ederseniz çekici ve noter işlemi birkaç iş günü içinde tamamlanır, ödeme devirde nakittir.",
      },
      {
        q: "Konya–Ankara yolunda kaza yaptım, aracım hurdaya döndü; değeri kaldı mı?",
        a: "Ağır hasarlı ve hurda seviyesindeki araçların da parça ve metal değeri vardır; çekme veya hurda belgesi süreçleri dahil işlemleri birlikte yürütürüz.",
      },
    ],
    heroImage: 7,
    heroAlt: "Konya düz yolunda kaza yapmış bir otomobil",
  },
  {
    citySlug: "gaziantep",
    metaTitle: "Gaziantep Hasarlı Araç Alımı — Ticari, Kazalı ve Hurda",
    metaDescription:
      "Gaziantep'te hasarlı, kazalı, pert ve ticari araç alımı. Türkiye geneli ağımızla sanayi filolarına güçlü teklif; ücretsiz çekici, nakit ödeme.",
    heroTitle: "Gaziantep'te Hasarlı ve Ticari Araç Alımı",
    intro:
      "İhracat şampiyonu Gaziantep'in yoğun ticari araç trafiğinde yıpranan, kaza yapan veya yenilenecek her aracı nakit değerlendiriyoruz.",
    about: [
      "Gaziantep'in üretim ve ihracat temposu, Türkiye'nin en yoğun kullanılan ticari araç parklarından birini yaratır; yüksek kilometreli panelvan ve kamyonetler şehirdeki başvuruların ilk sırasındadır. OSB'lerdeki işletmelere yerinde filo değerlendirmesi yapıyor, devirleri mesai düzenini bozmadan tek randevuda topluyoruz.",
      "TAG otoyolu üzerindeki konum, şehirler arası kaza başvurularını da artırır. Bireysel araçlarda pert ve yüksek tramer kayıtlı otomobiller öne çıkar; teklif her durumda aracın bugünkü fiili durumuna göre verilir ve ödeme noter devrinde nakit teslim edilir.",
    ],
    localPoints: [
      "OSB filolarına mesaiye uygun yerinde teklif",
      "Yüksek kilometreli ticari araç alımı",
      "Otoyol kazalarında otoparktan teslim",
      "Nizip ve İslahiye dahil tüm ilçeler",
    ],
    faqs: [
      {
        q: "Gaziantep'te fabrikamızın beş servis aracını birden değerlendirebilir misiniz?",
        a: "Evet. Filo başvurularında her araca ayrı teklif verilir; kabul edilenlerin devri tek noter randevusunda toplanır ve ödemeler devir günü şirket hesabına geçer.",
      },
      {
        q: "Aracımın tramer kaydı aracın değerini aşıyor; satabilir miyim?",
        a: "Satabilirsiniz. Kayıt tutarı ne olursa olsun araç fiziken değerlendirilir; bu profil en sık çalıştığımız araç grubudur.",
      },
      {
        q: "Nizip'ten başvursam ne zaman gelirsiniz?",
        a: "Yerinde görüş genellikle bir iş günü içinde planlanır; çekici, teklif kabulünden sonra aynı gün veya ertesi gün ücretsiz gönderilir.",
      },
    ],
    heroImage: 1,
    heroAlt: "Gaziantep sanayi bölgesinde hasarlı bir panelvan",
  },
  {
    citySlug: "kocaeli",
    metaTitle: "Kocaeli Hasarlı Araç Alan — Gebze, İzmit, Hurda Dahil",
    metaDescription:
      "Kocaeli, İzmit ve Gebze'de hasarlı, kazalı ve pert araç alımı. TEM ve D-100 kazaları dahil ücretsiz çekici, hızlı değerlendirme, nakit ödeme.",
    heroTitle: "Kocaeli'nde Hasarlı Araç Alımı: Sanayinin Kalbinde",
    intro:
      "Türkiye sanayisinin yoğunlaştığı Kocaeli'nde TEM kazalarından fabrika filolarına kadar her durumdaki aracı yerinden alıyoruz.",
    about: [
      "Kocaeli, kilometrekareye düşen araç ve ağır vasıta yoğunluğunda Türkiye'nin zirvesindedir; TEM ile D-100'ün il boyunca paralel uzandığı bu koridorda kaza sıklığı yüksektir. İstanbul'a işe gidip gelenlerin yolda hasar alan araçları ve otoparklarda bekleyen kazalı otomobiller başvuruların büyük bölümünü oluşturur.",
      "Gebze'den İzmit'e uzanan sanayi kuşağındaki binlerce işletme, düzenli filo yenilemesi yapar; ekonomik ömrünü dolduran servis ve yük araçlarına işletme kapısında teklif veriyoruz. İstanbul'a komşuluğumuz sayesinde Kocaeli randevuları çok hızlı planlanır — çoğu başvuruda aynı gün.",
    ],
    localPoints: [
      "TEM ve D-100 kazalarına hızlı müdahale",
      "Gebze–İzmit sanayi kuşağında filo alımı",
      "Çoğu başvuruda aynı gün randevu",
      "12 ilçenin tamamında yerinden alım",
    ],
    faqs: [
      {
        q: "TEM'de kaza yaptım, aracım Kocaeli'nde kaldı ama İstanbul'da oturuyorum; süreç nasıl işler?",
        a: "Sık karşılaştığımız durumdur: teklif fotoğraflarla uzaktan netleşir, aracı otoparktan biz alırız; devri İstanbul'daki bir noterden vekâletle ya da kısa bir İzmit ziyaretiyle tamamlarsınız.",
      },
      {
        q: "Gebze'deki fabrikamızın araçları için mesai saatinde mi gelirsiniz?",
        a: "Size uyan saatte geliriz; vardiya düzenine göre akşam veya hafta sonu randevusu da planlanabilir. Filo devirlerinde evrak önceden hazırlanır, işlem kısa sürer.",
      },
      {
        q: "Körfez veya Karamürsel gibi ilçelerden de alım var mı?",
        a: "Var. Kocaeli'nin 12 ilçesinin tamamından başvuru alıyoruz; çekici her ilçeye ücretsiz gönderilir.",
      },
    ],
    heroImage: 2,
    heroAlt: "Kocaeli TEM otoyolunda hasarlı bir otomobil",
  },
  {
    citySlug: "mersin",
    metaTitle: "Mersin Hasarlı ve Kazalı Araç Alan — Ticari, Hurda Alımı",
    metaDescription:
      "Mersin ve Tarsus'ta hasarlı, kazalı ve pert araç alımı. Türkiye geneli ağımızla liman kentinin araçlarına güçlü teklif, ücretsiz çekici, nakit ödeme.",
    heroTitle: "Mersin'de Hasarlı Aracınız Değerinde Nakde Dönsün",
    intro:
      "Liman kenti Mersin'in hareketli araç piyasasında yerel tekliflerle yetinmeyin; ülke geneline çalışan ağımız aracınıza gerçek değerinden teklif verir.",
    about: [
      "Mersin'de lojistik sektörünün büyüklüğü ticari araç başvurularını öne çıkarır: liman ve depo operasyonlarında yıpranan kamyonetler ile panelvanlar için işletme adresinden alım yapıyoruz. Ticari araçların parça piyasasındaki değerini ülke ölçeğinde hesapladığımızdan teklifimiz çoğu yerel alıcının üzerindedir.",
      "Bireysel tarafta Mersin–Adana otoyolunun yüksek hız kazaları ve sahil ikliminin korozyon etkisi başvuruların tipik nedenleridir. Tarsus'tan Anamur'a kadar 13 ilçenin tamamında yerinde görüş yapıyor, çekiciyi ücretsiz gönderiyor ve ödemeyi devirde nakit teslim ediyoruz.",
    ],
    localPoints: [
      "Liman lojistiği araçlarına ülke ölçeğinde teklif",
      "Otoyol kazalarında otoparktan alım",
      "Anamur dahil batı sahiline çekici ağı",
      "Devir günü eksiksiz nakit ödeme",
    ],
    faqs: [
      {
        q: "Mersin'de nakliye filomuzun eski araçlarını nasıl değerlendirirsiniz?",
        a: "Araç listesi ve fotoğraflarla başvurursunuz; her araca ayrı nakit teklif verilir, devirler tek randevuda toplanır ve ödemeler devir anında şirket hesabına yapılır.",
      },
      {
        q: "Silifke'de sahilde duran aracımda tuz paslanması var; fiyat çok mu düşer?",
        a: "Paslanmanın yüzeysel mi yapısal mı olduğu belirleyicidir; araç yerinde incelenir ve varsa indirim, gerekçesiyle açıkça gösterilir. Yüzeysel korozyonun etkisi sınırlıdır.",
      },
      {
        q: "Otoyolda kaza yaptım, araç Mersin'de otoparkta; masraf kimde?",
        a: "Çekici ve taşıma bize aittir; otopark ücreti devir hesaplaşmasında şeffaf biçimde netleştirilir, sürpriz kesinti yapılmaz.",
      },
    ],
    heroImage: 3,
    heroAlt: "Mersin limanı çevresinde hasarlı bir kamyonet",
  },
  {
    citySlug: "kayseri",
    metaTitle: "Kayseri Hasarlı Araç Alan — Kazalı, Çekme Belgeli, Hurda",
    metaDescription:
      "Kayseri'nin tüm ilçelerinde hasarlı, kazalı, pert ve arızalı araç alımı. Kış kazaları ve sanayi araçları dahil ücretsiz çekici, nakit ödeme.",
    heroTitle: "Kayseri'de Hasarlı Araç Alımı",
    intro:
      "Ticaretin ve sanayinin Anadolu'daki merkezi Kayseri'de mobilya sektörünün kamyonetlerinden Erciyes yolunun kış kazalarına kadar her durumu değerlendiriyoruz.",
    about: [
      "Kayseri'nin mobilya ve imalat sanayisi, şehri Anadolu'nun en büyük ticari araç pazarlarından biri yapar; yük altında yıpranan kamyonet ve panelvanlar başvuruların önemli bölümünü oluşturur. İşletmelere yerinde teklif verip devirleri tek randevuda topluyor, ödemeyi devir günü şirket hesabına geçiriyoruz.",
      "Erciyes'in kayak sezonu ve şehrin sert karasal iklimi, kış aylarında buzlanma kazalarını belirgin artırır; soğukta yatan araçların motor sorunları da tipik başvurulardandır. Develi, Yahyalı ve Bünyan dahil 16 ilçenin tamamına ücretsiz çekici planlıyoruz.",
    ],
    localPoints: [
      "Mobilya sektörü ticari araçlarına yerinde teklif",
      "Erciyes yolu kış kazalarına çekici desteği",
      "16 ilçenin tamamında yerinden alım",
      "Devirle eş zamanlı nakit ödeme",
    ],
    faqs: [
      {
        q: "Kayseri'de mobilya atölyemizin eski kamyonetini işyerinden alır mısınız?",
        a: "Alırız. Yerinde görüş işletme adresinizde yapılır; teklif kabul edilirse çekici ücretsiz gelir ve devir işlemi mesainizi bölmeyecek şekilde planlanır.",
      },
      {
        q: "Erciyes yolunda kaza yapan aracımı satmak istiyorum; kar engel olur mu?",
        a: "Olmaz. Kış koşullarına uygun çekici planlaması yapıyoruz; aracın bulunduğu noktayı paylaşmanız yeterli, alım takvimi hava durumuna göre birlikte netleştirilir.",
      },
      {
        q: "Kayseri'de teklif ne kadar sürede gelir?",
        a: "Fotoğraf ve bilgiler eksiksizse ön değerlendirme genellikle 30 dakika ile birkaç saat arasında iletilir; yerinde görüş çoğunlukla ertesi iş gününe planlanır.",
      },
    ],
    heroImage: 4,
    heroAlt: "Kayseri'de karlı yolda hasar almış bir araç",
  },
  {
    citySlug: "samsun",
    metaTitle: "Samsun Hasarlı Araç Alan — Karadeniz'de Kazalı ve Hurda",
    metaDescription:
      "Samsun ve tüm ilçelerinde hasarlı, kazalı, pert ve arızalı araç alımı. Sahil yolu kazaları ve yağışlı iklim hasarları dahil ücretsiz çekici, nakit ödeme.",
    heroTitle: "Samsun'da Hasarlı Araç Alımı: Karadeniz'in Merkezinde",
    intro:
      "Karadeniz'in en büyük kenti Samsun'da sahil yolunun yoğun trafiğinden iç ilçelerin tarım araçlarına kadar her durumu nakit değerlendiriyoruz.",
    about: [
      "Karadeniz Sahil Yolu'nun Samsun geçişi, bölgenin en yoğun trafiğini taşır; yağışlı iklimde kayganlaşan yollar kaza sıklığını artırır. Sahil aksında kaza yapan araçlar ve yağış nemiyle korozyona uğrayan otomobiller şehirdeki başvuruların ana grubudur — her ikisinde de gerçekçi ve gerekçeli teklif veririz.",
      "Samsun aynı zamanda Karadeniz'in iç bölgeleri için ticaret kapısıdır: Bafra ve Çarşamba ovalarının tarım araçları ile şehir içindeki esnaf kamyonetleri düzenli başvuru gruplarıdır. 17 ilçenin tamamına çekici planlıyor, devri size en yakın noterde tamamlıyoruz.",
    ],
    localPoints: [
      "Sahil yolu kazalarına hızlı çekici",
      "Nem ve korozyonda şeffaf değerleme",
      "Bafra ve Çarşamba ovalarından tarım aracı alımı",
      "17 ilçede yerinden alım ve nakit ödeme",
    ],
    faqs: [
      {
        q: "Samsun'da sürekli yağış yüzünden aracım paslandı; değeri kalmış mıdır?",
        a: "Kalmıştır. Karadeniz araçlarında korozyon olağandır ve değerlemede zaten hesaba katılır; belirleyici olan şasi ile taşıyıcı bölümlerin sağlamlığıdır. Ücretsiz değerlendirmeyle netleştirebilirsiniz.",
      },
      {
        q: "Sahil yolunda kaza yaptım, aracım Samsun'da; Ordu'da yaşıyorum, ne yapmalıyım?",
        a: "Uzaktan başvuru oluşturursunuz; teklif netleşince aracı otoparktan biz teslim alırız. Devir, vekâletle veya tek günlük bir ziyaretle tamamlanır.",
      },
      {
        q: "Bafra'daki tarlada duran arızalı pikabı alır mısınız?",
        a: "Alırız. Köy ve tarla adreslerine uygun çekici gönderilir; erişim koşulları başvuru sırasında netleştirilir ve alım ücretsiz yapılır.",
      },
    ],
    heroImage: 5,
    heroAlt: "Samsun sahil yolunda hasarlı bir otomobil",
  },
];

export const districtContent: DistrictContent[] = [
  // İstanbul
  {
    districtSlug: "kadikoy",
    citySlug: "istanbul",
    metaTitle: "Kadıköy Hasarlı Araç Alan — Anadolu Yakası Araç Alımı",
    metaDescription:
      "Kadıköy'de hasarlı, kazalı ve park hasarlı araç alımı. Dar sokaklardan kapalı otoparklara ücretsiz çekici ile yerinden alım, aynı gün nakit ödeme.",
    heroTitle: "Kadıköy'de Hasarlı Araç Alımı",
    lead: "Anadolu yakasının kalbi Kadıköy'de dar sokak park hasarlarından D-100 kazalarına kadar her durumu yerinden değerlendiriyoruz.",
    body: [
      "Kadıköy'ün yoğun ve eski dokusu araç sahipleri için iki tipik sorun üretir: dar sokaklarda alınan park hasarları ve otopark kıtlığı yüzünden uzun süre aynı yerde bekleyen, akü ve mekanik sorunları biriken araçlar. Her iki grubu da aracın bulunduğu sokaktan veya kapalı otoparktan ücretsiz çekiciyle alıyoruz.",
      "İlçenin görece değerli araç parkı, hasar sonrası değer kaybı endişesini de büyütür; tramer kaydı işlenmiş araçlarda satıcının en çok yanıldığı nokta, kaydın aracı değersizleştirdiği düşüncesidir. Teklifimiz kayda değil aracın fiili durumuna dayanır ve D-100 ile Bağdat Caddesi aksındaki randevular çoğunlukla aynı gün planlanır.",
    ],
    points: [
      "Dar sokak ve kapalı otoparktan çıkarma",
      "Değerli araçlarda hassas değerleme",
      "D-100 aksında aynı gün randevu",
      "Kadıköy noterlerinde hızlı devir",
    ],
    faqs: [
      {
        q: "Kadıköy'de aracım mahalle arasında park hâlinde; çekici sokağa girebilir mi?",
        a: "Girebilir. Dar sokaklar için uygun boyutta kayar kasa çekici planlıyoruz; araç sokaktan güvenle alınır ve süreç boyunca yanında bulunmanız gerekmez.",
      },
      {
        q: "Bağdat Caddesi'nde kaza yaptım, aracın değer kaybı çok mu olur?",
        a: "Satışta belirleyici olan aracın onarılabilirliği ve kalan değeridir; kayıt tek başına fiyatı belirlemez. Fotoğraflarla ücretsiz teklif alıp mevcut tekliflerle karşılaştırmanızı öneririz.",
      },
    ],
  },
  {
    districtSlug: "umraniye",
    citySlug: "istanbul",
    metaTitle: "Ümraniye Hasarlı Araç Alımı — TEM Hattında Araç Alan",
    metaDescription:
      "Ümraniye'de hasarlı, kazalı ve ticari araç alımı. TEM bağlantı kazaları ve Dudullu sanayi araçları dahil ücretsiz çekici, nakit ödeme.",
    heroTitle: "Ümraniye'de Hasarlı ve Ticari Araç Alımı",
    lead: "TEM bağlantılarının kesiştiği Ümraniye'de bireysel araçlardan Dudullu sanayisinin ticari filolarına kadar geniş bir alım hizmeti veriyoruz.",
    body: [
      "Ümraniye, Anadolu yakasının TEM'e açılan ana kavşaklarını barındırır; bağlantı yollarındaki yoğun trafik, ilçeyi kaza başvurularında yakanın ilk sıralarına taşır. Kaza sonrası çekilen araçlar için otoparktan alım ve hızlı devir bizim bölgedeki standart işleyişimizdir.",
      "Dudullu Organize Sanayi ve çevresindeki binlerce atölye, ilçede büyük bir hafif ticari araç parkı yaratır. Ekonomik ömrünü dolduran servis araçları ve yük panelvanları için işletme kapısından teklif veriyor, birden fazla araçta devirleri tek noter randevusunda topluyoruz.",
    ],
    points: [
      "TEM bağlantısı kazalarına hızlı çözüm",
      "Dudullu OSB araçlarına yerinde teklif",
      "İşletmelere toplu devir kolaylığı",
      "Aynı gün çekici planlaması",
    ],
    faqs: [
      {
        q: "Dudullu'daki atölyemizin iki panelvanını birden satabilir miyiz?",
        a: "Satabilirsiniz. Her araca ayrı teklif verilir; kabul ettikleriniz için devir tek randevuda toplanır ve ödemeler devir anında yapılır.",
      },
      {
        q: "TEM'de kaza yaptım, aracım Ümraniye'de otoparkta; ne kadar sürede biter?",
        a: "Fotoğraflarla teklif genellikle aynı gün netleşir; otoparktan teslim ve noter devri çoğunlukla birkaç iş günü içinde tamamlanır.",
      },
    ],
  },
  {
    districtSlug: "basaksehir",
    citySlug: "istanbul",
    metaTitle: "Başakşehir Hasarlı Araç Alan — Kazalı Araç Alımı",
    metaDescription:
      "Başakşehir ve Kayaşehir'de hasarlı, kazalı ve arızalı araç alımı. Site otoparklarından ücretsiz çekici ile alım, hızlı değerlendirme, nakit ödeme.",
    heroTitle: "Başakşehir'de Hasarlı Araç Alımı",
    lead: "Toplu konutların ve geniş bulvarların ilçesi Başakşehir'de site otoparklarında bekleyen araçlardan kavşak kazalarına kadar her durumu alıyoruz.",
    body: [
      "Başakşehir'in site ağırlıklı dokusu, başvuru profilini de belirler: kapalı otoparklarda uzun süre bekleyen ikinci araçlar, aile büyüklerinden kalan az kullanılmış otomobiller ve site içi manevra hasarları en sık gelen taleplerdir. Site yönetimiyle koordinasyon dahil, aracın otoparktan çıkarılmasını uçtan uca üstleniyoruz.",
      "İlçenin geniş bulvarları ve Kuzey Marmara Otoyolu bağlantıları yüksek hızlı kavşak kazalarını artırır; İkitelli sanayi bölgesine yakınlık ise ekspertiz ve yerinde görüş randevularını hızlandırır. Kayaşehir dahil tüm mahallelerden başvuru alıyor, ödemeyi devirde nakit yapıyoruz.",
    ],
    points: [
      "Site otoparklarından uçtan uca alım",
      "Veraset araçlarında evrak yönlendirmesi",
      "Kuzey Marmara bağlantısı kazalarına çözüm",
      "İkitelli yakınlığıyla hızlı ekspertiz",
    ],
    faqs: [
      {
        q: "Başakşehir'de sitedeki aracın çıkışı için yönetimle kim ilgilenir?",
        a: "Biz ilgileniriz. Çekici randevusu öncesinde site yönetimiyle gerekli koordinasyon yapılır; sizden yalnızca araç anahtarı ve evrakların hazır olması istenir.",
      },
      {
        q: "Babamdan kalan az kullanılmış aracı satmak istiyoruz; veraset işlemi bitti, süreç nasıl?",
        a: "Veraset intikali tamamlandıysa normal devir gibi ilerler: fotoğrafla teklif, yerinde görüş ve noterde devir. Evraklarda eksik varsa başvuruda birlikte netleştiririz.",
      },
    ],
  },
  {
    districtSlug: "pendik",
    citySlug: "istanbul",
    metaTitle: "Pendik Hasarlı Araç Alımı — E-5 ve Sahil Hattında Araç Alan",
    metaDescription:
      "Pendik'te hasarlı, kazalı ve arızalı araç alımı. E-5 kazaları ve Sabiha Gökçen çevresi dahil ücretsiz çekici ile yerinden alım, nakit ödeme.",
    heroTitle: "Pendik'te Hasarlı Araç Alımı",
    lead: "E-5'in en işlek geçişlerinden birine ve Sabiha Gökçen'e ev sahipliği yapan Pendik'te her durumdaki aracı yerinden alıyoruz.",
    body: [
      "Pendik, Anadolu yakasının doğu kapısıdır: E-5 ve sahil yolu ilçe boyunca paralel akar, Sabiha Gökçen trafiği de eklenince kaza yoğunluğu yüksektir. Havalimanına gidip gelirken kaza yapan şehir dışı sürücüler için otoparktan alım ve uzaktan devir süreci bu bölgede sık kullandığımız yöntemdir.",
      "İlçenin sanayi siteleri ve tersane bölgesi ticari araç başvurularını, hızla büyüyen konut bölgeleri ise bireysel başvuruları besler. Kurtköy'den sahile kadar tüm mahallelerde yerinde görüş yapıyor; çekiciyi ücretsiz gönderip devri Pendik noterlerinde tamamlıyoruz.",
    ],
    points: [
      "E-5 ve sahil yolu kazalarına hızlı çekici",
      "Havalimanı çevresinde uzaktan satış süreci",
      "Sanayi sitesi ticari araçlarına teklif",
      "Pendik noterlerinde aynı gün devir",
    ],
    faqs: [
      {
        q: "Sabiha Gökçen'e giderken kaza yaptım, uçağıma yetiştim ama araç Pendik'te kaldı; satabilir miyim?",
        a: "Satabilirsiniz. Fotoğraflarla uzaktan teklif verilir, aracı otoparktan biz teslim alırız; devri döndüğünüzde tek ziyaretle veya bulunduğunuz şehirden vekâletle tamamlarsınız.",
      },
      {
        q: "Kurtköy'deki aracıma ne zaman bakabilirsiniz?",
        a: "Pendik ve Kurtköy randevuları genellikle bir iş günü içinde planlanır; fotoğraflarla ön teklif ise çoğunlukla aynı gün iletilir.",
      },
    ],
  },
  {
    districtSlug: "bagcilar",
    citySlug: "istanbul",
    metaTitle: "Bağcılar Hasarlı Araç Alan — Ticari Araç ve Kazalı Alımı",
    metaDescription:
      "Bağcılar'da hasarlı, kazalı ve ticari araç alımı. Tekstil atölyelerinin kamyonetleri dahil ücretsiz çekici ile yerinden alım ve nakit ödeme.",
    heroTitle: "Bağcılar'da Hasarlı ve Ticari Araç Alımı",
    lead: "Avrupa yakasının en yoğun ilçelerinden Bağcılar'da esnaf kamyonetlerinden kaza hasarlı otomobillere kadar her aracı değerlendiriyoruz.",
    body: [
      "Bağcılar'ın tekstil ve konfeksiyon atölyeleri, ilçeyi İstanbul'un en yoğun hafif ticari araç bölgelerinden biri yapar; yük taşıyan, çok vardiyalı çalışan kamyonet ve panelvanlar hızla yıpranır. Bu araçlara işletme kapısında teklif veriyor, mesaiyi bölmeyen devir planlaması yapıyoruz.",
      "İlçenin dar ve yoğun sokak dokusu park hasarlarını, TEM ile Basın Ekspres bağlantıları ise kaza başvurularını artırır. Değeri düşük araçlarda dahi süreç aynı ciddiyetle işler: ücretsiz teklif, ücretsiz çekici ve noterde eksiksiz nakit ödeme.",
    ],
    points: [
      "Atölye ve esnaf araçlarına yerinde teklif",
      "Basın Ekspres aksı kazalarına çözüm",
      "Bütçe segmenti araçlara da tam süreç",
      "Mesaiye uygun devir planlaması",
    ],
    faqs: [
      {
        q: "Bağcılar'da atölyemin eski kamyonetini iş saatleri dışında satabilir miyim?",
        a: "Evet. Yerinde görüş ve devir randevusu akşam saatlerine veya hafta sonuna planlanabilir; evraklar önceden hazırlanır, işlem kısa sürer.",
      },
      {
        q: "Aracımın değeri düşük; yine de çekici ücretsiz mi?",
        a: "Ücretsiz. Aracın değeri çekici hizmetini değiştirmez; teklifi kabul ettiğiniz her araç bulunduğu yerden masrafsız alınır.",
      },
    ],
  },
  {
    districtSlug: "esenyurt",
    citySlug: "istanbul",
    metaTitle: "Esenyurt Hasarlı Araç Alımı — Kazalı Araç Alan",
    metaDescription:
      "Türkiye'nin en kalabalık ilçesi Esenyurt'ta hasarlı, kazalı ve arızalı araç alımı. Site otoparkları dahil ücretsiz çekici, hızlı nakit ödeme.",
    heroTitle: "Esenyurt'ta Hasarlı Araç Alımı",
    lead: "Türkiye'nin en kalabalık ilçesi Esenyurt'ta el değiştirme hızı yüksek araç piyasasının hasarlı tarafını biz üstleniyoruz.",
    body: [
      "Nüfusu birçok ili geride bırakan Esenyurt'ta araç yoğunluğu ve buna bağlı kaza ile hasar başvuruları İstanbul'un zirvesindedir. Yüksek katlı sitelerin otoparklarında bekleyen araçlar, E-5 ve TEM arasındaki bağlantı yollarının kazaları ve ekonomik nedenlerle hızla satılmak istenen otomobiller tipik başvuru profilimizdir.",
      "İlçede ikinci el piyasası hızlı ama hasarlı araçta güven sorunu büyüktür; kapora isteyen, son anda fiyat kıran alıcılarla uğraşmak yerine süreci noter güvencesine bağlıyoruz. Teklif net, çekici ücretsiz, ödeme devir anında nakittir — pazarlık oyunları yoktur.",
    ],
    points: [
      "Yüksek katlı site otoparklarından alım",
      "E-5–TEM bağlantı kazalarına çözüm",
      "Son dakika fiyat kırma yok, teklif nettir",
      "Aynı gün teklif ve hızlı devir",
    ],
    faqs: [
      {
        q: "Esenyurt'ta alıcılar hep son anda fiyat düşürüyor; sizde de öyle mi olur?",
        a: "Olmaz. Yerinde incelemede aracın beyanınıza uygun çıkması hâlinde teklif değişmez; değişiklik gerektiren bir durum varsa gerekçesi açıkça gösterilir, kabul etmezseniz süreç biter.",
      },
      {
        q: "Acil nakde ihtiyacım var; Esenyurt'ta süreç en hızlı ne kadar sürer?",
        a: "Evraklar hazırsa aynı gün teklif, ertesi gün devir mümkündür; ödemeyi noter işlemiyle eş zamanlı nakit alırsınız.",
      },
    ],
  },
  // Ankara
  {
    districtSlug: "cankaya",
    citySlug: "ankara",
    metaTitle: "Çankaya Hasarlı Araç Alan — Ankara Merkez Araç Alımı",
    metaDescription:
      "Çankaya'da hasarlı, kazalı ve az kullanılmış araç alımı. Bakımlı memur araçları ve site otoparkları dahil ücretsiz çekici, nakit ödeme.",
    heroTitle: "Çankaya'da Hasarlı Araç Alımı",
    lead: "Başkentin merkezi Çankaya'da bakımlı ama yaşı ilerlemiş araçlardan kavşak kazalarına kadar her durumu değerlendiriyoruz.",
    body: [
      "Çankaya'nın araç parkı Türkiye ortalamasından farklıdır: düzenli bakımlı, garaj görmüş ama yaşı ilerlemiş otomobiller ilçede yoğundur. Bu araçların sahipleri çoğu zaman değerinin altında tekliflerle karşılaşır; biz bakım geçmişini ve kondisyonu fiyata gerçekten yansıtan bir değerleme yaparız.",
      "Eskişehir Yolu ve Konya Yolu akslarının yoğun trafiği, ilçede kaza başvurularının ana kaynağıdır; büyükelçilikler bölgesindeki dar sokaklarda park hasarları da sık görülür. Randevular Çankaya genelinde hızlı planlanır ve devir size en yakın noterde tamamlanır.",
    ],
    points: [
      "Bakım geçmişi fiyata gerçekten yansır",
      "Eskişehir Yolu kazalarına hızlı çözüm",
      "Site ve kapalı garajlardan alım",
      "Çankaya noterlerinde aynı gün devir",
    ],
    faqs: [
      {
        q: "Çankaya'da 15 yaşında ama bakımlı aracım var; hasarlı diye çok mu düşük teklif gelir?",
        a: "Gelmez. Yaş tek başına belirleyici değildir; bakım kayıtları, kondisyon ve kilometre teklifte gerçek karşılığını bulur. Fotoğraf ve servis geçmişiyle başvurmanız yeterli.",
      },
      {
        q: "Emekli babamın garajda duran aracını onun adına satabilir miyim?",
        a: "Noterden vereceği vekâletle satabilirsiniz; vekâlet yoksa devir randevusunda kendisinin bulunması gerekir. Evrak yolunu başvuruda birlikte planlarız.",
      },
    ],
  },
  {
    districtSlug: "kecioren",
    citySlug: "ankara",
    metaTitle: "Keçiören Hasarlı Araç Alımı — Kazalı Araç Alan",
    metaDescription:
      "Keçiören'de hasarlı, kazalı ve park hasarlı araç alımı. Yokuşlu dar sokaklardan ücretsiz çekici ile alım, hızlı değerlendirme, nakit ödeme.",
    heroTitle: "Keçiören'de Hasarlı Araç Alımı",
    lead: "Ankara'nın en kalabalık ilçelerinden Keçiören'in yokuşlu sokaklarında park hasarlı ve arızalı araçları yerinden alıyoruz.",
    body: [
      "Keçiören'in eğimli topografyası ve yoğun konut dokusu, ilçeye özgü hasar profilleri üretir: yokuşta el freni kaynaklı kaymalar, dar sokak park hasarları ve kışın buzlu rampalarda yaşanan çarpışmalar başvuruların başında gelir. Eğimli sokaklardan güvenli araç çekme konusunda deneyimli ekiple çalışıyoruz.",
      "İlçede aile araçları uzun yıllar kullanılır; bu da yaşı ilerlemiş, küçük hasarları birikmiş araçları yaygınlaştırır. Değeri ne olursa olsun süreç aynıdır — fotoğrafla ücretsiz teklif, yerinden ücretsiz alım ve noterde nakit ödeme.",
    ],
    points: [
      "Yokuşlu sokaklardan güvenli çekici alımı",
      "Kış buzlanması hasarlarına çözüm",
      "Uzun yıllar kullanılmış araçlara adil teklif",
      "Tüm mahallelerde yerinde görüş",
    ],
    faqs: [
      {
        q: "Keçiören'de dik bir yokuşta duran çalışmayan aracı alabilir misiniz?",
        a: "Alabiliriz. Eğimli noktalar için uygun donanımlı çekici planlanır; araç güvenli şekilde yüklenir ve süreç sizin katılımınızı gerektirmez.",
      },
      {
        q: "Aracın birden fazla küçük hasarı var, tek tek mi hesaplanır?",
        a: "Değerleme aracın bütünü üzerinden yapılır; küçük hasarlar toplam kondisyon içinde değerlendirilir ve teklifin gerekçesi kalem kalem açıklanır.",
      },
    ],
  },
  {
    districtSlug: "yenimahalle",
    citySlug: "ankara",
    metaTitle: "Yenimahalle Hasarlı Araç Alan — Ostim Çevresi Araç Alımı",
    metaDescription:
      "Yenimahalle'de hasarlı, kazalı ve ticari araç alımı. Ostim–İvedik sanayi araçları dahil ücretsiz çekici ile yerinden alım, nakit ödeme.",
    heroTitle: "Yenimahalle'de Hasarlı ve Ticari Araç Alımı",
    lead: "Ostim ve İvedik'e komşu Yenimahalle'de esnaf araçlarından Batıkent'in bireysel otomobillerine kadar her durumu alıyoruz.",
    body: [
      "Yenimahalle, Türkiye'nin en büyük küçük-sanayi kümelerinden Ostim ve İvedik'in kapısıdır; binlerce atölyenin kamyonet ve panelvanları ilçedeki başvuruların ana grubunu oluşturur. Sanayideki ustalarla çalışmaya alışkın bir ekip olarak, tamiri masraflı çıkan araçların servis kapısından alınması bizde rutin işlemdir.",
      "Batıkent ve Demetevler'in yoğun konut bölgeleri ise bireysel başvuruları besler: park hasarları, kavşak kazaları ve uzun süre bekleyen ikinci araçlar. İlçenin tamamında yerinde görüş yapıyor, çekiciyi ücretsiz gönderiyor ve ödemeyi devirde nakit teslim ediyoruz.",
    ],
    points: [
      "Ostim–İvedik atölye araçlarına yerinde teklif",
      "Tamircide kalan araçların servisten alımı",
      "Batıkent site otoparklarından çekici",
      "Devir günü eksiksiz nakit ödeme",
    ],
    faqs: [
      {
        q: "Ostim'de tamirci aracın masrafının değerini aştığını söyledi; oradan direkt alır mısınız?",
        a: "Alırız. Usta ile hesaplaşmanız tamamlandıktan sonra araç servisten teslim alınır; çekici ücretsizdir ve devir aynı günlerde planlanır.",
      },
      {
        q: "Batıkent'teki aracım için hafta sonu randevu olur mu?",
        a: "Olur. Yerinde görüş ve devir randevuları hafta sonu dahil sizin uygunluğunuza göre planlanır.",
      },
    ],
  },
  {
    districtSlug: "etimesgut",
    citySlug: "ankara",
    metaTitle: "Etimesgut Hasarlı Araç Alımı — Eryaman Çevresi Araç Alan",
    metaDescription:
      "Etimesgut ve Eryaman'da hasarlı, kazalı ve arızalı araç alımı. Site otoparklarından ücretsiz çekici ile alım, hızlı değerlendirme, nakit ödeme.",
    heroTitle: "Etimesgut'ta Hasarlı Araç Alımı",
    lead: "Ankara'nın hızla büyüyen batı ilçesi Etimesgut'ta Eryaman'ın sitelerinden çevre yolu kazalarına kadar her durumu değerlendiriyoruz.",
    body: [
      "Etimesgut, genç ailelerin yoğun yaşadığı, araç sahipliği yüksek bir ilçedir; Eryaman ve Elvankent'in büyük sitelerindeki otoparklarda bekleyen ikinci araçlar ile şehir içi kavşak kazaları başvuruların çoğunu oluşturur. Site otoparklarından araç çıkarma ve çekici organizasyonu uçtan uca bize aittir.",
      "İlçenin Ankara çevre yoluna ve İstanbul yoluna bağlanan aksları, yüksek hızlı kaza başvurularını da getirir. Askeri lojmanlar ve yoğun memur nüfusu nedeniyle tayin dönemlerinde hızlı satış talebi artar; bu dönemlerde aynı hafta içinde teklif–devir–ödeme tamamlayacak şekilde çalışıyoruz.",
    ],
    points: [
      "Tayin dönemlerinde hızlandırılmış süreç",
      "Eryaman sitelerinden çekici ile alım",
      "Çevre yolu kazalarına hızlı çözüm",
      "Aynı hafta devir ve nakit ödeme",
    ],
    faqs: [
      {
        q: "Tayinim çıktı, Etimesgut'tan taşınmadan aracı satmam lazım; yetişir mi?",
        a: "Yetişir. Bu talep bölgede sıktır; evraklar hazırsa teklif, devir ve nakit ödeme aynı hafta içinde tamamlanır. Başvuruda taşınma tarihinizi belirtmeniz yeterli.",
      },
      {
        q: "Elvankent'teki sitede duran aracın anahtarı bende, ruhsat eşimde; satış olur mu?",
        a: "Ruhsat sahibi devirde bulunmalı ya da noterden vekâlet vermelidir; ikisi de mümkünse randevu buna göre planlanır.",
      },
    ],
  },
  // İzmir
  {
    districtSlug: "bornova",
    citySlug: "izmir",
    metaTitle: "Bornova Hasarlı Araç Alımı — İzmir'in Doğu Kapısında",
    metaDescription:
      "Bornova'da hasarlı, kazalı ve arızalı araç alımı. Türkiye geneli ağımızla güçlü teklif; otoyol kavşağı kazaları dahil ücretsiz çekici, nakit ödeme.",
    heroTitle: "Bornova'da Hasarlı Araç Alımı",
    lead: "İzmir'in otoyollara açılan doğu kapısı Bornova'da kavşak kazalarından öğrenci araçlarına kadar her durumu nakit değerlendiriyoruz.",
    body: [
      "Bornova, İzmir–İstanbul ve İzmir–Ankara otoyollarının şehre bağlandığı kavşaktır; bu geçiş yükü ilçeyi kaza başvurularında İzmir'in ilk sırasına koyar. Otoyol girişlerinde kaza yapan şehir dışı sürücüler için otoparktan teslim alma ve uzaktan devir sürecini standart olarak işletiyoruz.",
      "Ege Üniversitesi'nin öğrenci nüfusu ilçede bütçe segmenti araç hareketliliğini artırır; ilk arabasını satan gençlerin evrak ve süreç sorularına sabırla eşlik ediyoruz. Teklif her araçta nettir, çekici ücretsizdir ve ödeme noterde nakit yapılır.",
    ],
    points: [
      "Otoyol kavşağı kazalarında uzaktan satış",
      "Öğrenci araçlarına sabırlı evrak desteği",
      "Ülke ölçeğinde fiyat rekabeti",
      "Aynı gün teklif ve hızlı devir",
    ],
    faqs: [
      {
        q: "Otoyoldan İzmir'e girerken Bornova'da kaza yaptım, memleketime döndüm; satış uzaktan olur mu?",
        a: "Olur. Fotoğraflarla teklif verilir, araç otoparktan teslim alınır; devri şehrinizdeki noterden vekâletle veya tek ziyaretle tamamlarsınız.",
      },
      {
        q: "Öğrenciyim, ilk kez araç satıyorum; hangi evraklar lazım?",
        a: "Ruhsat ve kimliğiniz temelde yeterlidir; araç başkasının üzerine kayıtlıysa vekâlet gerekir. Başvuruda durumunuza özel listeyi paylaşır, adım adım yönlendiririz.",
      },
    ],
  },
  {
    districtSlug: "karsiyaka",
    citySlug: "izmir",
    metaTitle: "Karşıyaka Hasarlı Araç Alan — Körfezin Kuzeyinde Alım",
    metaDescription:
      "Karşıyaka'da hasarlı, kazalı ve az kullanılmış araç alımı. Türkiye geneli alıcı ağıyla güçlü teklif; ücretsiz çekici ve nakit ödeme.",
    heroTitle: "Karşıyaka'da Hasarlı Araç Alımı",
    lead: "Körfezin kuzey yakası Karşıyaka'da az kullanılmış aile araçlarından çarşı trafiğinin hasarlarına kadar her durumu alıyoruz.",
    body: [
      "Karşıyaka'nın yerleşik ve görece yaşlı nüfusu, ilçede az kilometreli ama yaşı ilerlemiş, tek elden kullanılmış araçları yaygınlaştırır. Bu profildeki araçlar yerel alıcılarda çoğu zaman hak ettiği değeri bulamaz; Türkiye genelindeki taleple eşleştirdiğimiz için teklifimiz aracın gerçek kondisyonunu yansıtır.",
      "Çarşı ve Bostanlı hattının yoğun trafiği park ve manevra hasarlarını, sahil nemine açık otoparklar ise korozyonu artırır. Mavişehir'den Örnekköy'e tüm mahallelerde yerinde görüş yapıyor; devri Karşıyaka noterlerinde tamamlayıp ödemeyi anında teslim ediyoruz.",
    ],
    points: [
      "Tek elden çıkan araçlara hak ettiği değer",
      "Çarşı bölgesi park hasarlarına teklif",
      "Mavişehir sitelerinden çekici alımı",
      "Karşıyaka noterlerinde hızlı devir",
    ],
    faqs: [
      {
        q: "Annemin 20 yıllık ama 60 bin kilometrede aracı var; hasarlı sayılır mı, değeri olur mu?",
        a: "Düşük kilometreli yaşlı araçlar en çok değer bulan gruplardandır; küçük hasarlar veya uzun bekleme sorun değildir. Fotoğraflarla başvurun, gerçekçi teklifi görün.",
      },
      {
        q: "Bostanlı'da açık otoparkta duran araçta nem hasarı olabilir mi, fiyatı etkiler mi?",
        a: "Deniz kenarında nem korozyonu olağandır; etkisi yaygınlığına göre değişir. Yerinde incelemede durum netleşir ve varsa etkisi gerekçesiyle gösterilir.",
      },
    ],
  },
  {
    districtSlug: "buca",
    citySlug: "izmir",
    metaTitle: "Buca Hasarlı Araç Alımı — İzmir'in En Kalabalık İlçesi",
    metaDescription:
      "Buca'da hasarlı, kazalı ve çalışmayan araç alımı. Türkiye geneli ağla güçlü teklif; yokuşlu sokaklardan ücretsiz çekici, nakit ödeme.",
    heroTitle: "Buca'da Hasarlı Araç Alımı",
    lead: "İzmir'in en kalabalık ilçesi Buca'da araç yoğunluğunun getirdiği her tür hasar ve arıza için pratik bir satış süreci sunuyoruz.",
    body: [
      "Yarım milyonu aşan nüfusuyla Buca'da araç trafiği İzmir ortalamasının üzerindedir; hastane ve üniversite çevrelerindeki yoğunluk, otopark kıtlığı ve toplu taşımanın sınırlı kaldığı mahallelerde araca bağımlılık, ilçedeki kaza ve hasar başvurularını sürekli besler.",
      "Buca'nın engebeli kesimlerinde el freni ve rampa kazaları bölgeye özgü başvuru nedenlerindendir; çalışmayan araçların eğimli sokaklardan alınması için uygun donanımlı çekici kullanıyoruz. Şirinyer'den Kaynaklar'a kadar tüm mahallelerde süreç aynıdır: net teklif, ücretsiz çekici, noterde nakit ödeme.",
    ],
    points: [
      "Eğimli sokaklardan donanımlı çekici alımı",
      "Hastane–üniversite bölgesinde hızlı randevu",
      "Çalışmayan araçlara tam süreç",
      "Ülke ölçeğinde fiyat rekabeti",
    ],
    faqs: [
      {
        q: "Buca'da yokuşta park hâlindeyken araca çarpmışlar, sürücü kayıp; yine de satabilir miyim?",
        a: "Satabilirsiniz. Karşı taraf bulunamasa da aracın satışına engel yoktur; hasar tespit tutanağı varsa değerlendirmeye eklenir, yoksa mevcut durum üzerinden teklif verilir.",
      },
      {
        q: "Aracım aylardır Buca'da kapalı garajda; çalıştıramıyorum, nasıl bakarsınız?",
        a: "Önce fotoğraflarla ön teklif verilir; gerekirse ekip garaja gelir. Aracın çıkarılması ve taşınması ücretsiz olarak bize aittir.",
      },
    ],
  },
  {
    districtSlug: "konak",
    citySlug: "izmir",
    metaTitle: "Konak Hasarlı Araç Alan — İzmir Merkezde Araç Alımı",
    metaDescription:
      "Konak'ta hasarlı, kazalı ve esnaf aracı alımı. Kemeraltı ticaretinin ticari araçları dahil ücretsiz çekici ile yerinden alım, nakit ödeme.",
    heroTitle: "Konak'ta Hasarlı ve Esnaf Aracı Alımı",
    lead: "İzmir ticaretinin kalbi Konak'ta esnafın yük araçlarından merkezin yoğun trafiğindeki kazalı otomobillere kadar her aracı alıyoruz.",
    body: [
      "Konak, Kemeraltı'ndan tarihi liman arkasına uzanan esnaf ekonomisinin merkezidir; yükleme-boşaltma temposuyla yıpranan esnaf kamyonetleri ve minivanlar ilçedeki başvuruların önemli bölümünü oluşturur. Dükkân önünden alım ve mesai sonrası devir randevusu bizde standart uygulamadır.",
      "Merkezin yoğun trafiği ve sınırlı otoparkları bireysel araçlarda park ve manevra hasarlarını artırır; Alsancak çevresinin değerli araç parkında ise kayıt sonrası değer endişesi öne çıkar. Her iki durumda da teklif aracın fiili durumuna dayanır ve işlem noterde güvenceye alınır.",
    ],
    points: [
      "Esnaf araçlarına dükkân önünden alım",
      "Mesai sonrası devir randevusu imkânı",
      "Merkez trafiği hasarlarına hızlı teklif",
      "Alsancak'ta değerli araç değerlemesi",
    ],
    faqs: [
      {
        q: "Kemeraltı'nda dükkânımın önünde duran eski kamyoneti gün içinde satabilir miyim?",
        a: "Satabilirsiniz. Görüş dükkân önünde yapılır; devir randevusu öğle arası veya akşam saatine planlanabilir, çekici işlemin ardından ücretsiz gelir.",
      },
      {
        q: "Alsancak'ta aracıma çarptılar, tramere işlendi; satarken çok mu kaybederim?",
        a: "Kayıt tek başına büyük kayıp anlamına gelmez; onarım kalitesi ve aracın kondisyonu belirleyicidir. Ücretsiz teklifle gerçek durumu netleştirmenizi öneririz.",
      },
    ],
  },
  // Bursa
  {
    districtSlug: "nilufer",
    citySlug: "bursa",
    metaTitle: "Nilüfer Hasarlı Araç Alımı — Bursa'nın Modern Yüzünde",
    metaDescription:
      "Nilüfer'de hasarlı, kazalı ve arızalı araç alımı. OSB filoları ve site otoparkları dahil ücretsiz çekici ile yerinden alım, nakit ödeme.",
    heroTitle: "Nilüfer'de Hasarlı Araç Alımı",
    lead: "Bursa'nın modern ilçesi Nilüfer'de OSB filolarından üniversite çevresinin araçlarına kadar geniş bir alım hizmeti veriyoruz.",
    body: [
      "Nilüfer, Bursa OSB'nin ve otomotiv yan sanayisinin merkezinde yer alır; fabrika servisleri, tedarikçi firmaların yük araçları ve mühendis kadrolarının bakımlı bireysel otomobilleri ilçenin başvuru profilini oluşturur. İşletmelere vardiya düzenine uygun yerinde görüş, bireysel satıcılara site otoparkından alım planlıyoruz.",
      "İzmir Yolu aksının yoğun trafiği ilçedeki kaza başvurularının ana kaynağıdır; Uludağ Üniversitesi çevresi ise bütçe segmenti araç hareketliliği getirir. Görükle'den Özlüce'ye tüm mahallelerde süreç aynıdır — net teklif, ücretsiz çekici ve noterde nakit ödeme.",
    ],
    points: [
      "OSB işletmelerine vardiyaya uygun randevu",
      "İzmir Yolu kazalarına hızlı çözüm",
      "Üniversite çevresi araçlarına tam süreç",
      "Site otoparklarından ücretsiz çekici",
    ],
    faqs: [
      {
        q: "Nilüfer OSB'deki firmamız için hafta içi mesai bitiminde görüş olur mu?",
        a: "Olur. Yerinde görüş vardiya ve mesai düzeninize göre planlanır; filo başvurularında devirler tek noter randevusunda toplanır.",
      },
      {
        q: "Görükle'de öğrenci evinin önünde duran aracımı dönem sonunda satmak istiyorum; süreç hızlı mı?",
        a: "Hızlı. Fotoğrafla teklif çoğunlukla aynı gün verilir; dönem bitmeden devir ve ödeme tamamlanacak şekilde randevu planlanır.",
      },
    ],
  },
  {
    districtSlug: "osmangazi",
    citySlug: "bursa",
    metaTitle: "Osmangazi Hasarlı Araç Alan — Bursa Merkez Araç Alımı",
    metaDescription:
      "Osmangazi'de hasarlı, kazalı ve esnaf aracı alımı. Tarihi merkezin dar sokakları dahil ücretsiz çekici ile yerinden alım ve nakit ödeme.",
    heroTitle: "Osmangazi'de Hasarlı Araç Alımı",
    lead: "Bursa'nın tarihi merkezi Osmangazi'de dar sokakların park hasarlarından santral garaj çevresinin ticari araçlarına kadar her durumu alıyoruz.",
    body: [
      "Osmangazi, Bursa'nın en kalabalık ilçesi ve ticari kalbidir; tarihi çarşı bölgesinin dar sokakları park ve manevra hasarlarını olağanlaştırır, hanlar bölgesi esnafının yük araçları yoğun tempoyla yıpranır. Dar sokaklardan araç çekme deneyimimiz sayesinde merkezin her noktasından alım yapabiliyoruz.",
      "İlçenin Mudanya Yolu ve çevre yolu bağlantıları kaza başvurularını, Uludağ eteklerindeki mahalleler ise kış aylarında buzlanma hasarlarını getirir. Değeri düşük yaşlı araçlardan filo çıkışlarına kadar her başvuruda süreç nettir: ücretsiz teklif, ücretsiz çekici, noterde nakit ödeme.",
    ],
    points: [
      "Tarihi merkezin dar sokaklarından alım",
      "Hanlar bölgesi esnaf araçlarına teklif",
      "Uludağ etekleri kış hasarlarına çözüm",
      "Devir günü eksiksiz nakit ödeme",
    ],
    faqs: [
      {
        q: "Osmangazi'de çarşı içindeki dar sokakta duran araç için çekici girebilir mi?",
        a: "Girebilir. Dar sokaklara uygun kayar kasa çekici kullanıyoruz; gerekiyorsa aracın uygun bir noktaya manevrası da ekibimizce yapılır.",
      },
      {
        q: "Kışın Uludağ yolunda hasar alan aracımı bahara kadar bekletmeli miyim?",
        a: "Beklemenize gerek yok; hasarlı araç bekledikçe değer kaybeder. Kış koşullarında da çekici planlıyoruz, teklif ve devir mevsimden bağımsız aynı hızda ilerler.",
      },
    ],
  },
];

export function getCityContent(citySlug: string): CityContent | undefined {
  return cityContent.find((c) => c.citySlug === citySlug);
}

export function getDistrictContent(
  citySlug: string,
  districtSlug: string,
): DistrictContent | undefined {
  return districtContent.find(
    (d) => d.citySlug === citySlug && d.districtSlug === districtSlug,
  );
}
