import type { FaqItem } from "./faq";

/** Simple structured content block (avoids a markdown dependency). */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "note"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** SEO meta description override (trimmed for SERPs). Falls back to `excerpt`. */
  metaDescription?: string;
  /** Per-post SEO keywords override. Falls back to shared `blogMetaKeywords`. */
  metaKeywords?: string;
  /** SEO `<title>` override. Falls back to `title`. */
  seoTitle?: string;
  /** Canonical URL override. Falls back to the auto-generated route. */
  canonical?: string;
  /** Robots directive override (e.g. "noindex, follow"). */
  robots?: string;
  /** Open Graph image override. Falls back to `image`. */
  ogImage?: string;
  category: string;
  /** ISO date — editable; sample content for development. */
  date: string;
  readingMinutes: number;
  image: string;
  imageAlt: string;
  body: Block[];
  faqs?: FaqItem[];
  /** Mark sample content so it is clearly non-production. */
  sample: boolean;
}

export const blogCategories = [
  "Hasarlı Araç",
  "Pert ve Ağır Hasar",
  "Araç Değerleme",
  "Noter ve Devir",
  "Hurda ve Çekme Belgeli",
  "Belgeler ve Sorgulama",
  "Sigorta ve Tazminat",
];

/** Shared meta keywords for editorial (blog + guide) pages. */
export const blogMetaKeywords =
  "hasarlı araç, kazalı araç satışı, pert araç, hurda araç, araç satış rehberi";

export const blogPosts: BlogPost[] = [
  {
    slug: "hasarli-aracimi-nasil-satarim",
    title: "Hasarlı Aracımı Nasıl Satarım? Adım Adım Rehber",
    excerpt:
      "Hasarlı aracınızı en yüksek fiyata nasıl satarsınız? Değerleme, ücretsiz çekici, noter devri ve ödeme süreci adım adım bu rehberde.",
    metaDescription:
      "Hasarlı aracınızı en yüksek fiyata nasıl satarsınız? Değerleme, ücretsiz çekici, noter devri ve ödeme süreci adım adım bu rehberde.",
    metaKeywords:
      "hasarlı araç satmak, hasarlı araç nasıl satılır, hasarlı araç alan, hasarlı araç değerleme, araç satış rehberi",
    category: "Hasarlı Araç",
    date: "2026-06-26",
    readingMinutes: 7,
    image: "/images/blog/az-hasarli-arac.jpg",
    imageAlt: "Satışa hazırlanan, ön tamponu hafif hasarlı beyaz otomobil",
    body: [
      { type: "p", text: "Hasarlı bir aracı satmak, ilk bakışta karmaşık görünebilir. Ekspertiz, değer kaybı, noter devri, hasar kaydı… Aklınızda birçok soru olması çok normal. Bu rehberde, hasarlı aracınızı en yüksek fiyata ve sorunsuz bir şekilde nasıl satabileceğinizi adım adım anlatıyoruz." },
      { type: "h2", text: "Hasarlı Araç Satışında İlk Adım: Doğru Değerlendirme" },
      { type: "p", text: "Hasarlı araç satmadan önce yapmanız gereken ilk şey, aracınızın gerçek değerini öğrenmektir. Birçok kişi hasarlı aracının değerini olduğundan düşük tahmin eder ve bu yüzden hak ettiğinden az fiyata satar." },
      { type: "p", text: "Aracınızın değerini etkileyen başlıca faktörler şunlardır:" },
      { type: "ul", items: [
        "Marka, model ve yaşı — Daha yeni ve talep gören modeller, hasarlı olsa bile yüksek değer korur.",
        "Hasarın türü ve boyutu — Ön, arka, yan hasar veya motor hasarı; her biri değeri farklı etkiler.",
        "Aracın çalışır durumda olup olmadığı — Çalışan bir araç, çalışmayana göre daha değerlidir.",
        "Belgelerin durumu — Ruhsat, hasar kaydı ve varsa ekspertiz raporu süreci hızlandırır.",
      ] },
      { type: "p", text: "En sağlıklı yöntem, aracınızın fotoğraflarını çekip profesyonel bir değerlendirme almaktır. Böylece pazarlık masasına gerçek bir rakamla oturursunuz." },
      { type: "h2", text: "Adım Adım Hasarlı Araç Satış Süreci" },
      { type: "h3", text: "1. Aracınızın Fotoğraflarını Çekin" },
      { type: "p", text: "Hasarlı araç alımında ilk değerlendirme genellikle fotoğraf üzerinden yapılır. Aracın dört bir yanını, hasarlı bölgeleri, iç mekânı ve kilometre göstergesini net bir şekilde çekin. İyi çekilmiş fotoğraflar, daha doğru ve daha yüksek bir teklif almanızı sağlar." },
      { type: "h3", text: "2. Ücretsiz Değerlendirme Talep Edin" },
      { type: "p", text: "Fotoğraflarınızı gönderdikten sonra, aracınız için ücretsiz bir değerlendirme alın. Güvenilir bir alıcı, aracınızı görmeden önce bile size yaklaşık bir fiyat aralığı sunabilir." },
      { type: "h3", text: "3. Teklifi Değerlendirin" },
      { type: "p", text: "Gelen teklifi acele etmeden değerlendirin. Şeffaf bir alıcı, fiyatın nasıl belirlendiğini açıklar ve gizli kesintiler içermez. Aklınıza takılan her soruyu sormaktan çekinmeyin." },
      { type: "h3", text: "4. Anlaşma ve Çekici" },
      { type: "p", text: "Anlaşma sağlandığında, çalışmayan veya ağır hasarlı araçlar için ücretsiz çekici hizmetinden yararlanabilirsiniz. Aracınızın bulunduğu yerden alınması, sizi ekstra masraftan ve uğraştan kurtarır." },
      { type: "h3", text: "5. Noter Devri ve Ödeme" },
      { type: "p", text: "Son adım, noterde resmi satış işlemidir. Devir tamamlandığında ödemenizi alırsınız. Güvenilir alıcılar, devir işlemiyle eş zamanlı olarak nakit veya banka havalesiyle ödeme yapar." },
      { type: "h2", text: "Hasarlı Araç Satarken Dikkat Edilmesi Gerekenler" },
      { type: "ul", items: [
        "Acele etmeyin, ama oyalanmayın. Aracın değeri zamanla düşebilir; özellikle açık alanda bekleyen hasarlı araçlar daha da yıpranır.",
        "Birden fazla teklif almak mantıklıdır, ancak çok düşük tekliflere de itibar etmeyin.",
        "Belgelerinizi hazır bulundurun. Ruhsat ve kimlik, devir işlemi için gereklidir.",
        "Ödeme almadan aracı teslim etmeyin. Güvenilir işlemlerde ödeme ve devir aynı anda yapılır.",
      ] },
      { type: "h2", text: "Hangi Hasarlı Araçlar Alınır?" },
      { type: "p", text: "Çoğu kişi yalnızca hafif hasarlı araçların alındığını düşünür, ama durum böyle değildir. Ağır hasarlı, motor arızalı, çalışmayan, yanmış, sel hasarlı, pert kayıtlı ve hurda belgeli araçlar dahil olmak üzere her durumdaki araç için değerlendirme yapılabilir. Aracınız ne durumda olursa olsun, bir değerleme almadan \"satılmaz\" diye düşünmeyin." },
      { type: "h2", text: "Sonuç" },
      { type: "p", text: "Hasarlı aracınızı satmak, doğru adımlarla hem hızlı hem de kârlı bir süreç olabilir. Özetle: aracınızın fotoğraflarını çekin, ücretsiz bir değerlendirme alın, teklifi şeffaf bir şekilde inceleyin ve noter güvencesiyle satışı tamamlayın." },
      { type: "p", text: "Aracınızın değerini merak ediyorsanız, fotoğraflarını göndererek 30 dakika içinde ücretsiz teklifinizi alabilirsiniz. Hasarlı aracınız, düşündüğünüzden daha değerli olabilir." },
    ],
    sample: false,
  },
  {
    slug: "pert-arac-nedir",
    title: "Pert Araç Nedir? Pert Kayıtlı Aracın Satışı",
    excerpt:
      "Pert araç ne demek, pert kayıtlı araç satılır mı, değeri ne olur? Pert total ve pert muhtemel farkı ile satış süreci bu yazıda.",
    metaDescription:
      "Pert araç ne demek, pert kayıtlı araç satılır mı, değeri ne olur? Pert total ve pert muhtemel farkı ile satış süreci bu yazıda.",
    metaKeywords:
      "pert araç nedir, pert araç satılır mı, pert kayıtlı araç, pert araç alan, pert total pert muhtemel",
    category: "Pert ve Ağır Hasar",
    date: "2026-06-26",
    readingMinutes: 7,
    image: "/images/blog/pert-arac.jpg",
    imageAlt: "Pert kayıtlı, ön tarafı ağır hasarlı otomobil",
    body: [
      { type: "p", text: "Aracınız bir kaza sonrası \"pert\" olarak kaydedildiyse veya sigorta şirketiniz size \"pert\" kelimesini söylediyse, kafanızda birçok soru oluşmuş olabilir. Pert ne demek? Pert araç satılır mı? Değeri ne olur? Bu yazıda, pert araçlarla ilgili merak ettiğiniz her şeyi sade bir dille açıklıyoruz." },
      { type: "h2", text: "Pert Araç Ne Demek?" },
      { type: "p", text: "\"Pert\", bir aracın onarım maliyetinin, aracın piyasa değerine yaklaşması veya onu aşması durumunda kullanılan bir terimdir. Yani sigorta şirketi, aracı onarmanın ekonomik olmadığına karar verdiğinde araç \"pert\" olarak kaydedilir." },
      { type: "p", text: "Pert kavramı genellikle ikiye ayrılır:" },
      { type: "ul", items: [
        "Pert Total (Tam Pert): Aracın onarımı teknik veya ekonomik olarak mümkün değildir. Bu araçlar genellikle hurdaya ayrılır veya parça değeri için alınır.",
        "Pert Muhtemel (Ekonomik Pert): Onarım mümkündür, ancak maliyeti aracın değerine çok yakındır. Bu araçlar onarılıp tekrar trafiğe çıkabilir veya olduğu gibi satılabilir.",
      ] },
      { type: "h2", text: "Pert Kaydı Aracın Değerini Nasıl Etkiler?" },
      { type: "p", text: "Pert kaydı, aracın ruhsatına ve tramer kaydına işlenir. Bu kayıt, aracın ikinci el piyasa değerini düşürür çünkü gelecekteki alıcılar aracın ciddi bir hasar geçmişi olduğunu görür." },
      { type: "p", text: "Ancak şunu unutmamak gerekir: pert kaydı, aracın değersiz olduğu anlamına gelmez. Pert bir aracın bile;" },
      { type: "ul", items: [
        "Sağlam parçaları,",
        "Motoru ve şanzımanı,",
        "Elektronik aksamı,",
        "Lastikleri ve iç donanımı",
      ] },
      { type: "p", text: "hâlâ ciddi bir değer taşıyabilir. Bu yüzden pert aracınızı \"nasılsa hurda\" diye düşünüp yok pahasına elden çıkarmamalısınız." },
      { type: "h2", text: "Pert Araç Satılır mı?" },
      { type: "p", text: "Evet, pert kayıtlı araçlar satılabilir. Üstelik bu tür araçlar için özel olarak değerlendirme yapan alıcılar vardır. Pert bir aracı satmanın birkaç yolu vardır:" },
      { type: "ol", items: [
        "Olduğu gibi satmak: Aracı onarmadan, mevcut durumuyla satarsınız. En hızlı ve en pratik yöntemdir.",
        "Onarıp satmak: Pert muhtemel araçlarda, onarım maliyeti düşükse araç onarılıp satılabilir. Ancak bu, zaman ve sermaye gerektirir.",
        "Parça değeri için satmak: Pert total araçlarda, aracın sağlam parçaları ayrı ayrı değer taşır.",
      ] },
      { type: "p", text: "Çoğu kişi için en mantıklı seçenek, aracı olduğu gibi, tek seferde ve nakit ödemeyle satmaktır. Böylece onarım riskine ve uzun bekleme sürecine girmeden aracınızı nakde çevirirsiniz." },
      { type: "h2", text: "Pert Araç Satışında Süreç Nasıl İşler?" },
      { type: "p", text: "Pert aracınızı satarken süreç, diğer hasarlı araçlarla benzerdir:" },
      { type: "ol", items: [
        "Fotoğraf gönderin: Aracın hasarlı bölgelerini ve genel durumunu net bir şekilde fotoğraflayın.",
        "Pert raporunu paylaşın: Varsa sigorta ekspertiz raporu ve pert kaydı bilgisi, daha doğru bir teklif almanızı sağlar.",
        "Ücretsiz değerlendirme alın: Aracınız için şeffaf ve gerçekçi bir fiyat teklifi alın.",
        "Anlaşıp teslim edin: Çalışmayan pert araçlar için ücretsiz çekici ile aracınız bulunduğu yerden alınır.",
        "Noter devri ve ödeme: Resmi devir işlemiyle birlikte ödemenizi anında alırsınız.",
      ] },
      { type: "h2", text: "Pert Araç Satarken Nelere Dikkat Etmelisiniz?" },
      { type: "ul", items: [
        "Pert kaydını gizlemeyin. Şeffaf bir satış, hem yasal açıdan doğru hem de güvenilir bir süreç sağlar.",
        "Aracın gerçek değerini öğrenin. Pert olması, aracı bedavaya vermeniz gerektiği anlamına gelmez.",
        "Belgelerinizi hazırlayın. Ruhsat ve pert/ekspertiz raporu, süreci hızlandırır.",
        "Güvenilir bir alıcı seçin. Ödemeyi devir ile aynı anda yapan, gizli kesinti uygulamayan alıcılarla çalışın.",
      ] },
      { type: "h2", text: "Sonuç" },
      { type: "p", text: "Pert araç, onarımı ekonomik olmayan ancak hâlâ ciddi bir değer taşıyan bir araçtır. Pert kaydı aracınızın değerini düşürse de, doğru alıcıyla aracınızı hak ettiği fiyata satabilirsiniz." },
      { type: "p", text: "Pert kayıtlı aracınızın güncel değerini merak ediyorsanız, fotoğraflarını ve varsa pert raporunu göndererek ücretsiz bir teklif alabilirsiniz. Aracınızı olduğu gibi, ücretsiz çekici ve anında nakit ödeme ile satmak mümkün." },
    ],
    sample: false,
  },
  {
    slug: "hasarli-arac-noter-devri-gerekli-belgeler",
    title: "Hasarlı Araç Noter Devri: Adım Adım Gerekli Belgeler (2026)",
    excerpt:
      "Hasarlı bir aracın satışı da sağlam araçlar gibi noterde tek işlemde tamamlanır. Devir öncesi hazırlamanız gereken belgeleri, borç sorgusunu ve sürecin işleyişini adım adım anlattık.",
    metaDescription:
      "Hasarlı bir aracın satışı da sağlam araçlar gibi noterde tek işlemde tamamlanır. Devir öncesi hazırlamanız gereken belgeleri, borç sorgusunu ve sürecin...",
    category: "Noter ve Devir",
    date: "2026-06-18",
    readingMinutes: 7,
    image: "/images/blog/az-hasarli-arac.jpg",
    imageAlt: "Devir için hazırlanan, ön tamponu hasarlı beyaz Renault",
    body: [
      { type: "p", text: "Türkiye'de araç satışı 2019'dan bu yana doğrudan noterde yapılıyor. Noter, satış sözleşmesini düzenlerken devri elektronik olarak tescil sistemine işler; ayrıca trafik tescil müdürlüğüne gitmenize gerek kalmaz. Bu kural hasarlı, pert kayıtlı veya çalışmayan araçlar için de aynıdır." },
      { type: "h2", text: "Devir öncesi mutlaka kontrol edilmesi gerekenler" },
      { type: "p", text: "Noter, devir anında aracın üzerindeki borçları sistemden sorgular. Aşağıdaki kalemlerde borç görünürse devir yapılamaz; bu nedenle randevudan önce kontrol etmek zaman kaybını önler:" },
      { type: "ul", items: [
        "Ödenmemiş Motorlu Taşıtlar Vergisi (MTV) — yılda iki taksit (Ocak ve Temmuz) hâlinde tahakkuk eder.",
        "Trafik idari para cezaları (hız, muayene gecikmesi vb.).",
        "Geçerli bir Zorunlu Trafik Sigortası (ZMSS) poliçesi — devir için araçta geçerli poliçe aranır.",
        "Araç üzerinde haciz, rehin veya yakalama şerhi bulunup bulunmadığı.",
      ] },
      { type: "note", text: "MTV ve trafik cezası borcunuzu, devirden önce e-Devlet üzerinden Gelir İdaresi Başkanlığı (GİB) ve İçişleri Bakanlığı sorgu ekranlarından ücretsiz kontrol edebilirsiniz." },
      { type: "h2", text: "Satıcının hazırlaması gereken belgeler" },
      { type: "ul", items: [
        "Araç Tescil Belgesi (ruhsat) — yeni tip belge tek parçadır.",
        "Geçerli kimlik belgesi (yeni T.C. kimlik kartı veya nüfus cüzdanı).",
        "Geçerli Zorunlu Trafik Sigortası poliçesi.",
        "Araç gerçek kişi adına değilse imza sirküleri / yetki belgesi.",
      ] },
      { type: "h2", text: "Alıcının hazırlaması gerekenler" },
      { type: "p", text: "Alıcı için geçerli kimlik belgesi yeterlidir. Vergi kimlik numarası ayrıca istenmez; T.C. kimlik numarası bu işlevi görür. Aracı devraldıktan sonra Zorunlu Trafik Sigortası'nı kendi adına yeniletmek alıcının sorumluluğundadır." },
      { type: "h2", text: "Noter devri adım adım nasıl ilerler?" },
      { type: "ol", items: [
        "Alıcı ve satıcı bir noterde buluşur (online randevu çoğu noterde mümkündür).",
        "Noter, plakadan aracı ve üzerindeki borç/şerh durumunu sorgular.",
        "Satış bedeli ve araç bilgileri sözleşmeye işlenir; taraflar imzalar.",
        "Noter devri tescil sistemine kaydeder ve yeni ruhsatı düzenler.",
        "Ödeme güvenli biçimde (genellikle banka havalesi/EFT ile) tamamlanır.",
      ] },
      { type: "h3", text: "Hasarlı araçta farklı olan ne?" },
      { type: "p", text: "Hasarın kendisi devri engellemez. Ancak araç kendi gücüyle hareket edemiyorsa veya plakaları teslim edilmişse, satış 'çekme belgesi' ile yapılır. Pert (ağır hasar) kaydı varsa bu kayıt ruhsatta görünür ve devir yine noterde tamamlanır." },
      { type: "note", text: "Bu içerik genel bilgilendirme amaçlıdır; hukuki veya mali tavsiye niteliği taşımaz. Güncel ücret ve uygulama için ilgili noter ve resmi kurumlardan teyit alınız." },
    ],
    faqs: [
      { q: "Hasarlı aracı noterde satarken plakam değişir mi?", a: "Aynı il içinde yapılan devirlerde plaka değişmez; plaka araçla birlikte alıcıya geçer." },
      { q: "MTV borcu varken devir yapılır mı?", a: "Hayır. Noter, ödenmemiş MTV veya trafik cezası borcu varsa devri tamamlayamaz. Borcun devir öncesi kapatılması gerekir." },
      { q: "Çalışmayan aracı da noterde satabilir miyim?", a: "Evet. Araç hareket edemiyorsa çekme belgesiyle satış yapılabilir; süreç yine noterde tamamlanır." },
    ],
    sample: false,
  },
  {
    slug: "arac-hasar-kaydi-sorgulama-edevlet-tramer",
    title: "Araç Hasar Kaydı Nasıl Sorgulanır? e-Devlet ve TRAMER Rehberi",
    excerpt:
      "Bir aracın geçmiş hasar kayıtlarını e-Devlet (SBM/TRAMER) üzerinden nasıl sorgularsınız? Hasar kaydı ile hasar/değer kaybının farkını ve sorgu adımlarını açıkladık.",
    metaDescription:
      "Bir aracın geçmiş hasar kayıtlarını e-Devlet (SBM/TRAMER) üzerinden nasıl sorgularsınız? Hasar kaydı ile hasar/değer kaybının farkını ve sorgu adımlarını...",
    category: "Belgeler ve Sorgulama",
    date: "2026-06-05",
    readingMinutes: 6,
    image: "/images/blog/kazali-arac-egea-on.jpg",
    imageAlt: "Ön sol tarafı hasarlı gri sedan otomobil",
    body: [
      { type: "p", text: "Araç hasar kaydı, o araç için sigorta şirketlerince ödenmiş hasarların kayıt altına alındığı veridir. Bu kayıtlar Sigorta Bilgi ve Gözetim Merkezi (SBM) bünyesindeki TRAMER sisteminde tutulur ve hem alıcı hem satıcı için aracın geçmişini şeffaf hâle getirir." },
      { type: "h2", text: "Hasar kaydı tam olarak neyi gösterir?" },
      { type: "p", text: "Hasar kaydı, sigortadan ödeme yapılmış olayları ve ödenen tutarı gösterir. Önemli ayrımlar şunlardır:" },
      { type: "ul", items: [
        "Sigortadan ödeme alınmadan, cepten yaptırılan onarımlar hasar kaydına genellikle yansımaz.",
        "Hasar kaydının yüksek olması her zaman ağır hasar anlamına gelmez; cam, far gibi küçük kalemler de kayda girer.",
        "'Pert/ağır hasar' kaydı ayrı bir durumdur ve aracın ruhsatına işlenir; bu, hasar tutarından farklı ve daha kritik bir bilgidir.",
      ] },
      { type: "h2", text: "e-Devlet üzerinden adım adım hasar sorgulama" },
      { type: "ol", items: [
        "turkiye.gov.tr adresine T.C. kimlik ve şifrenizle giriş yapın.",
        "Arama kutusuna 'Hasar' veya 'SBM' yazın; Sigorta Bilgi ve Gözetim Merkezi hizmetlerini seçin.",
        "'Araç Hasar Geçmişi / Hasar Bilgisi Sorgulama' hizmetini açın.",
        "Genellikle kendi adınıza kayıtlı araçları doğrudan sorgulayabilirsiniz; başkasının aracında satıcının onayı/paylaşımı gerekebilir.",
        "Sonuçta tarih, hasar tipi ve ödenen tutar bilgilerini görüntüleyin.",
      ] },
      { type: "note", text: "e-Devlet üzerindeki hizmet adları ve menü konumları zaman zaman güncellenebilir. Hizmeti bulamazsanız 'SBM' anahtar kelimesiyle aratmanız en hızlı yoldur." },
      { type: "h2", text: "Hasar kaydı satışı nasıl etkiler?" },
      { type: "p", text: "Şeffaflık, hasarlı araç satışında en güçlü pazarlık aracınızdır. Hasar geçmişini önceden bilmek; alıcıya doğru bilgi vermenizi, sürpriz değer düşüşlerinin önüne geçmenizi ve değerleme sürecini hızlandırmanızı sağlar. Kayıtları gizlemek yerine açıkça paylaşmak, güveni ve dolayısıyla teklifin netleşme hızını artırır." },
      { type: "note", text: "Bu içerik genel bilgilendirme amaçlıdır. Sorgu sonuçlarının resmi yorumu için SBM ve sigorta kuruluşlarına başvurunuz." },
    ],
    faqs: [
      { q: "Başkasının aracının hasar kaydını sorgulayabilir miyim?", a: "Kişisel verilerin korunması nedeniyle hasar geçmişi genellikle araç sahibine açıktır. Satın almadan önce satıcıdan kendi e-Devlet hesabından çıktı/ekran görüntüsü istemek en güvenli yoldur." },
      { q: "Hasar kaydı silinebilir mi?", a: "Sigortadan ödenmiş gerçek hasar kayıtları silinmez. 'Kayıt sildirme' vaadi veren tekliflere itibar etmeyin." },
      { q: "Hasar kaydı ile pert kaydı aynı şey mi?", a: "Hayır. Hasar kaydı ödenen onarımların geçmişidir; pert/ağır hasar kaydı ise aracın ruhsatına işlenen ve değeri belirgin etkileyen ayrı bir kayıttır." },
    ],
    sample: false,
  },
  {
    slug: "pert-kayitli-arac-nasil-satilir",
    title: "Pert Kayıtlı (Ağır Hasarlı) Araç Nasıl Satılır?",
    excerpt:
      "Pert ile ağır hasar kaydı arasındaki fark nedir, hangi araç tekrar trafiğe çıkabilir ve pert kayıtlı bir araç satarken nelere dikkat etmelisiniz? Süreci sade biçimde açıkladık.",
    metaDescription:
      "Pert ile ağır hasar kaydı arasındaki fark nedir, hangi araç tekrar trafiğe çıkabilir ve pert kayıtlı bir araç satarken nelere dikkat etmelisiniz? Süreci...",
    category: "Pert ve Ağır Hasar",
    date: "2026-05-22",
    readingMinutes: 7,
    image: "/images/blog/kazali-arac-agir-hasar.jpg",
    imageAlt: "Ön tarafı ağır hasarlı beyaz sedan otomobil",
    body: [
      { type: "p", text: "Halk arasında 'pert' denilen kavram, onarım maliyetinin aracın rayiç (piyasa) değerine yaklaştığı veya geçtiği durumu ifade eder. Sigorta tekniği açısından iki ana durumu birbirinden ayırmak önemlidir." },
      { type: "h2", text: "Tam hasarlı (pert-total) ile ağır hasarlı farkı" },
      { type: "ul", items: [
        "Tam hasarlı (pert-total): Onarımı teknik olarak mümkün/güvenli değildir. Bu araçlar genellikle hurdaya ayrılır ve yeniden trafiğe çıkamaz.",
        "Ağır hasarlı (onarılabilir pert): Maliyetli olsa da onarılabilir. Usulüne uygun onarım ve denetim sonrası tekrar trafiğe çıkabilir; ancak ruhsata 'ağır hasar kaydı' işlenir.",
      ] },
      { type: "p", text: "Bu ayrım kritik çünkü satılabilirliği ve hangi belgeyle satılacağını doğrudan belirler." },
      { type: "h2", text: "Pert/ağır hasar kaydı ruhsata işlenir" },
      { type: "p", text: "Ağır hasar kaydı bir kez işlendiğinde araçla birlikte kalır; araç onarılsa bile kayıt silinmez. Bu nedenle alıcı, aracın geçmişini her zaman görebilir. Şeffaf davranmak hem yasal hem de güveni artıran doğru yaklaşımdır." },
      { type: "h2", text: "Pert kayıtlı aracı satarken adımlar" },
      { type: "ol", items: [
        "Kaydın türünü netleştirin: tam hasarlı mı, onarılabilir ağır hasar mı?",
        "Ruhsattaki kaydı ve varsa sigorta eksper raporunu hazır bulundurun.",
        "Aracın güncel fiziki durumunu (çalışıyor/çalışmıyor, hareket ediyor/etmiyor) doğru aktarın.",
        "Hareket edemeyen araçlarda satışın çekme belgesiyle mi yapılacağını belirleyin.",
        "Değerlemeyi; aracın bütünü, çalışan parçaları ve hurda/parça değeri üzerinden isteyin.",
      ] },
      { type: "note", text: "Pert kayıtlı bir aracı 'kayıtsız' gibi göstermek hem alıcıyı yanıltır hem de hukuki sorumluluk doğurur. Doğru bilgi, en sağlıklı satıştır." },
      { type: "h2", text: "Pert araç ne kadar değer kaybeder?" },
      { type: "p", text: "Net bir yüzde vermek doğru olmaz; değer; marka, model, yaş, hasarın kapsamı ve parçaların kullanılabilirliğine göre değişir. Onarılabilir ağır hasarlı araçlarda kayıp, tam hasarlı (hurda) araçlara göre genellikle daha sınırlıdır. Gerçekçi bir rakam ancak aracın incelenmesiyle ortaya çıkar." },
    ],
    faqs: [
      { q: "Pert kayıtlı araç tekrar trafiğe çıkabilir mi?", a: "Onarılabilir 'ağır hasarlı' kayıtlı araçlar, usulüne uygun onarım ve denetim sonrası trafiğe çıkabilir. 'Tam hasarlı' (pert-total) araçlar çıkamaz." },
      { q: "Ağır hasar kaydı sonradan silinir mi?", a: "Hayır. Kayıt araçla birlikte kalıcıdır ve onarım sonrası da görünmeye devam eder." },
      { q: "Pert aracı parça parça mı yoksa bütün hâlde mi satmalıyım?", a: "Çoğu durumda bütün hâlde, kurumsal alıcıya satmak daha pratik ve güvenlidir. Hangisinin avantajlı olduğu aracın durumuna göre değişir." },
    ],
    sample: false,
  },
  {
    slug: "cekme-belgesi-nedir-nasil-alinir",
    title: "Çekme Belgesi Nedir, Nasıl Alınır? Trafiğe Çıkamayan Araçlar",
    excerpt:
      "Çalışmayan veya trafiğe çıkamayacak durumdaki araçlar için çekme belgesi nasıl alınır, plakalar ne olur ve bu araç nasıl satılır? Tüm süreci özetledik.",
    category: "Hurda ve Çekme Belgeli",
    date: "2026-05-08",
    readingMinutes: 6,
    image: "/images/blog/cekici-citroen-c4.jpg",
    imageAlt: "Çekici üzerine yüklenmiş, ön tarafı hasarlı kırmızı otomobil",
    body: [
      { type: "p", text: "Çekme belgesi; kendi gücüyle güvenli biçimde trafiğe çıkamayacak durumdaki araçlar için düzenlenen, aracın yalnızca çekici ile taşınabileceğini gösteren resmi belgedir. Ağır hasarlı, motor/şanzıman arızalı veya uzun süre kullanılmayacak araçlar için tercih edilir." },
      { type: "h2", text: "Çekme belgesi ne işe yarar?" },
      { type: "ul", items: [
        "Trafiğe çıkamayan aracı yasal zeminde elde tutmanızı veya satmanızı sağlar.",
        "Plakalar tescil birimine iade edilir; araç trafikten çekilmiş sayılır.",
        "Bu süreçte aracın trafikte kullanılmadığı için bazı yükümlülükler farklılaşır.",
      ] },
      { type: "h2", text: "Trafikten çekme ile hurdaya ayırma farkı" },
      { type: "p", text: "İki işlemi karıştırmamak gerekir:" },
      { type: "ul", items: [
        "Trafikten çekme (çekme belgesi): Araç fiziken vardır, onarılıp tekrar tescil ettirilmesi mümkün olabilir.",
        "Hurdaya ayırma: Araç bir daha trafiğe çıkamaz; tescil kaydı tamamen kapatılır ve genellikle yetkili hurda tesisine teslim edilir.",
      ] },
      { type: "h2", text: "Çekme belgesi için izlenen adımlar" },
      { type: "ol", items: [
        "Aracın güncel durumunu (çalışmıyor/hareket edemiyor) belirleyin.",
        "İlgili trafik tescil birimi / vergi dairesi işlemleri için gerekli belgeleri (ruhsat, kimlik) hazırlayın.",
        "Bazı işlemler e-Devlet üzerinden başlatılabilir; güncel yöntemi kontrol edin.",
        "Plakaları teslim edin ve çekme belgesini alın.",
        "Satış yapacaksanız devri çekme belgesiyle noterde tamamlayın.",
      ] },
      { type: "note", text: "Çekme/hurda işlemlerinin adımları ve istenen belgeler dönemsel olarak değişebilir. İşleme başlamadan önce ilgili vergi dairesi veya trafik tescil müdürlüğünden güncel bilgiyi teyit edin." },
      { type: "h2", text: "Çekme belgeli aracı satarken" },
      { type: "p", text: "Çekme belgeli araçlar genellikle kurumsal alıcılar tarafından bütün hâlde alınır; aracın taşınması için çekici hizmeti çoğu zaman alıcı tarafından üstlenilir. Satıştan önce belgenin ve aracın durumunun net olması, sürecin sorunsuz ilerlemesini sağlar." },
    ],
    faqs: [
      { q: "Çekme belgeli araç tekrar trafiğe çıkabilir mi?", a: "Çoğu durumda araç onarılıp gerekli denetimlerden geçtikten sonra yeniden tescil ettirilebilir. Hurdaya ayrılan araçlar ise çıkamaz." },
      { q: "Çekme belgeli aracın MTV'si öderim mi?", a: "Trafikten çekme işlemi vergi yükümlülüklerini etkileyebilir. Güncel durumu ilgili vergi dairesinden teyit etmeniz önerilir." },
      { q: "Plakalarımı teslim etmek zorunda mıyım?", a: "Trafikten çekme işleminde plakalar tescil birimine iade edilir; bu, işlemin doğal bir parçasıdır." },
    ],
    sample: false,
  },
  {
    slug: "hasarli-arac-degerleme-faktorleri",
    title: "Hasarlı Araç Değerini Belirleyen 7 Faktör",
    excerpt:
      "Hasarlı bir aracın gerçek değeri neye göre belirlenir? Marka-modelden hasarın kapsamına, pert kaydından parça değerine kadar fiyatı etkileyen 7 ana faktörü açıkladık.",
    metaDescription:
      "Hasarlı bir aracın gerçek değeri neye göre belirlenir? Marka-modelden hasarın kapsamına, pert kaydından parça değerine kadar fiyatı etkileyen 7 ana faktörü...",
    category: "Araç Değerleme",
    date: "2026-04-19",
    readingMinutes: 6,
    image: "/images/blog/hasarli-arac-on-hasar.jpg",
    imageAlt: "Ön tamponu ve farı hasarlı beyaz otomobil",
    body: [
      { type: "p", text: "Hasarlı araç değerlemesi, sağlam araç fiyatından belirli kalemlerin düşülmesiyle değil; aracın bütünü, onarım maliyeti ve kullanılabilir parça değeri birlikte değerlendirilerek yapılır. Aşağıdaki 7 faktör, teklifi en çok etkileyen unsurlardır." },
      { type: "h2", text: "1. Marka, model ve yaş" },
      { type: "p", text: "Yedek parçası bol ve ikinci el talebi yüksek modeller, hasarlı hâlde bile daha kolay değer bulur. Aracın yaşı ve jenerasyonu, parça uyumu açısından belirleyicidir." },
      { type: "h2", text: "2. Kilometre" },
      { type: "p", text: "Düşük kilometre, motor ve aktarma organları sağlamsa değeri yukarı çeker. Özellikle hasar gövdede ise, mekanik aksamın sağlamlığı önemli bir artıdır." },
      { type: "h2", text: "3. Hasarın kapsamı ve yeri" },
      { type: "ul", items: [
        "Kaput, tampon, çamurluk gibi dış panel hasarları çoğunlukla daha sınırlı etki yapar.",
        "Şasi/taşıyıcı yapı, airbag ve motor bölmesi hasarları değeri belirgin düşürür.",
        "Yan/devrilme hasarları ile su (sel) hasarı ayrı değerlendirilir.",
      ] },
      { type: "h2", text: "4. Aracın çalışır ve hareket eder durumda olması" },
      { type: "p", text: "Kendi gücüyle hareket edebilen bir araç, çekiciyle taşınması gereken araca göre lojistik açıdan avantajlıdır ve bu durum değerlemeye olumlu yansır." },
      { type: "h2", text: "5. Pert / ağır hasar kaydı" },
      { type: "p", text: "Ruhsata işlenmiş ağır hasar kaydı, aracın gelecekteki satılabilirliğini etkilediği için değerlemede dikkate alınır. Kaydın türü (tam hasarlı / onarılabilir) sonucu doğrudan değiştirir." },
      { type: "h2", text: "6. Kullanılabilir parça değeri" },
      { type: "p", text: "Ağır hasarlı araçlarda değer çoğu zaman bütün araçtan değil, sağlam kalan parçalardan gelir. Talep gören orijinal parçalara sahip bir araç, hasarlı olsa da iyi değer bulabilir." },
      { type: "h2", text: "7. Belgelerin eksiksizliği ve piyasa koşulları" },
      { type: "p", text: "Ruhsat, anahtar, varsa eksper raporu ve borçsuz olma durumu süreci hızlandırır. Ayrıca ikinci el ve yedek parça piyasasının genel seyri de o günkü teklifi etkiler." },
      { type: "note", text: "Bu içerik genel bilgilendirme amaçlıdır. Aracınıza özel net değer, ancak fotoğraf ve belgelerin incelenmesiyle ortaya çıkar; ilk değerlendirme bağlayıcı değildir." },
    ],
    faqs: [
      { q: "Fotoğrafla verilen ilk değer bağlayıcı mı?", a: "Hayır. Fotoğraf ve bilgilere göre yapılan ilk değerlendirme bir ön tahmindir; nihai teklif, aracın ve belgelerin kontrolünden sonra netleşir." },
      { q: "Hasarı kendim onarsam daha mı çok kazanırım?", a: "Her zaman değil. Onarım maliyeti çoğu zaman sağlayacağı değer artışını aşar; özellikle ağır hasarda olduğu gibi satmak daha avantajlı olabilir." },
    ],
    sample: false,
  },
  {
    slug: "trafik-kazasi-deger-kaybi-tazminati",
    title: "Trafik Kazası Sonrası Değer Kaybı Tazminatı Nasıl Alınır?",
    excerpt:
      "Kusurlu olmadığınız bir kazada aracınız onarılsa bile ikinci el değeri düşer. Bu 'değer kaybını' karşı tarafın sigortasından nasıl talep edebileceğinizi ve süreci anlattık.",
    metaDescription:
      "Kusurlu olmadığınız bir kazada aracınız onarılsa bile ikinci el değeri düşer. Bu 'değer kaybını' karşı tarafın sigortasından nasıl talep edebileceğinizi ve...",
    category: "Sigorta ve Tazminat",
    date: "2026-03-27",
    readingMinutes: 7,
    image: "/images/blog/yan-kaza-egea.jpg",
    imageAlt: "Yan tarafı kaza geçirmiş gri sedan otomobil yol kenarında",
    body: [
      { type: "p", text: "Araç değer kaybı; kusurlu olmadığınız bir trafik kazasında aracınız onarılsa dahi, kaza ve onarım geçmişi nedeniyle ikinci el piyasasındaki değerinin düşmesidir. Bu kayıp, kusurlu tarafın Zorunlu Trafik Sigortası'ndan (ZMSS) talep edilebilir." },
      { type: "h2", text: "Değer kaybı talebinin temel koşulları" },
      { type: "ul", items: [
        "Kazada kusursuz veya kısmen kusurlu olmanız (tazminat kusur oranına göre belirlenir).",
        "Aracın onarılmış ya da onarılabilir durumda olması.",
        "Aracın çok eski/yüksek kilometreli olmaması gibi sigortacılık ölçütlerinin sağlanması.",
      ] },
      { type: "h2", text: "Başvuru adımları" },
      { type: "ol", items: [
        "Kaza tespit tutanağı, fotoğraflar, onarım faturaları ve ruhsat gibi belgeleri toplayın.",
        "Önce kusurlu tarafın sigorta şirketine yazılı başvuru yapın.",
        "Sigortacı süresinde olumsuz yanıt verir veya teklifi yetersizse, Sigorta Tahkim Komisyonu'na başvurabilirsiniz.",
        "Gerekirse bağımsız eksper raporu ile değer kaybı tutarını belgeleyin.",
      ] },
      { type: "note", text: "Trafik kazasından doğan tazminat taleplerinde zamanaşımı süreleri vardır; hak kaybı yaşamamak için başvuruyu geciktirmeyin. Süreler ve uygulama için bir hukuk danışmanına veya Sigorta Tahkim Komisyonu'na başvurmanız önerilir." },
      { type: "h2", text: "Değer kaybı nasıl hesaplanır?" },
      { type: "p", text: "Standart tek bir formül yoktur; aracın kaza öncesi değeri, yaşı, kilometresi, hasarın ağırlığı ve onarım niteliği birlikte değerlendirilir. Yeni, az kilometreli ve ağır onarım görmüş araçlarda değer kaybı tutarı genellikle daha yüksek olur." },
      { type: "h2", text: "Aracı satmaya karar verdiyseniz" },
      { type: "p", text: "Onarım sonrası aracı elde tutmak istemiyorsanız, değer kaybı tazminatı süreciyle aracın satışını ayrı ayrı değerlendirebilirsiniz. Hasar kaydı bulunan bir aracı satarken geçmişi şeffaf paylaşmak, en sağlıklı ve hızlı sonuç veren yoldur." },
    ],
    faqs: [
      { q: "Kazada kusurluysam değer kaybı alabilir miyim?", a: "Tam kusurluysanız genellikle alamazsınız. Kısmen kusurluysanız tazminat, karşı tarafın kusur oranıyla orantılı olarak değerlendirilir." },
      { q: "Değer kaybı için sigorta şirketim mi öder?", a: "Hayır. Değer kaybı, kusurlu tarafın Zorunlu Trafik Sigortası'ndan talep edilir; kendi kasko/sigortanızdan değil." },
      { q: "Sigorta reddederse ne yapmalıyım?", a: "Sigorta Tahkim Komisyonu'na başvurabilirsiniz. Bağımsız eksper raporu, talebinizi güçlendirir." },
    ],
    sample: false,
  },
  {
    slug: "hasarli-arac-satarken-dikkat-edilmesi-gerekenler",
    title: "Hasarlı Araç Satarken Nelere Dikkat Edilmelidir?",
    excerpt:
      "Hasarlı aracınızı satmadan önce bilmeniz gereken hazırlık, değerleme ve devir adımlarını derledik.",
    category: "Hasarlı Araç",
    date: "2026-05-12",
    readingMinutes: 6,
    image: "/images/blog/cekme-belgeli-arac.jpg",
    imageAlt: "Ön sol tarafı hasarlı gri otomobil",
    body: [
      { type: "p", text: "Hasarlı bir aracı satmak, sağlam bir aracı satmaktan farklı bir süreçtir. Aracın gerçek durumunu doğru aktarmak hem değerlemeyi hem de devir sürecini hızlandırır." },
      { type: "h2", text: "1. Aracın durumunu net belirleyin" },
      { type: "p", text: "Hasarın kapsamını, aracın çalışıp çalışmadığını ve varsa hasar kayıtlarını önceden netleştirin. Bu bilgiler değerlendirmenin temelini oluşturur." },
      { type: "h2", text: "2. Doğru fotoğrafları hazırlayın" },
      { type: "ul", items: [
        "Aracın dört bir yönden genel görünümü",
        "Hasarlı bölgelerin yakın çekimi",
        "Motor bölmesi ve iç mekân",
        "Kilometre ve ruhsat bilgileri",
      ] },
      { type: "h2", text: "3. İlk değerlendirme ile nihai teklifi ayırın" },
      { type: "p", text: "Fotoğraf ve bilgilere göre yapılan ilk değerlendirme bağlayıcı değildir. Nihai teklif, aracın ve belgelerin kontrolünden sonra netleşir." },
      { type: "note", text: "Bu içerik genel bilgilendirme amaçlıdır; hukuki veya mali tavsiye niteliği taşımaz." },
      { type: "h2", text: "4. Noter ve ödeme adımlarını planlayın" },
      { type: "p", text: "Anlaşma sağlandığında noter devri ve ödeme adımları açık şekilde planlanmalı ve güvenli biçimde tamamlanmalıdır." },
    ],
    faqs: [
      { q: "Hasarlı aracı ekspertizsiz satabilir miyim?", a: "Evet. Ekspertiz zorunlu değildir; ancak varsa süreci hızlandırır." },
    ],
    sample: true,
  },
  {
    slug: "pert-arac-nedir-nasil-degerlenir",
    title: "Pert Araç Nedir ve Nasıl Değerlenir?",
    excerpt:
      "Pert kaydı, ağır hasarlı araçların değerlemesini nasıl etkiler? Pert araç satışında dikkat edilmesi gerekenler.",
    category: "Pert ve Ağır Hasar",
    date: "2026-04-28",
    readingMinutes: 5,
    image: "/images/blog/pert-arac.jpg",
    imageAlt: "Lastikler arasında bekleyen, ön tarafı ağır hasarlı pert araç",
    body: [
      { type: "p", text: "Pert araç, onarım maliyetinin aracın değerine yakın veya üzerinde olması nedeniyle ekonomik onarımı uygun görülmeyen araçtır." },
      { type: "h2", text: "Pert kaydının değerlemeye etkisi" },
      { type: "p", text: "Pert kaydı, aracın değerini etkileyen önemli bir faktördür. Ancak nihai değer, aracın bütünü ve kullanılabilir parçaları dikkate alınarak belirlenir." },
      { type: "h2", text: "Pert araç satışında belge süreci" },
      { type: "p", text: "Pert kayıt durumuna göre devir adımları değişebilir. Doğru ve resmi sürecin nasıl ilerleyeceği değerlendirme sırasında açıklanır." },
    ],
    sample: true,
  },
  {
    slug: "calismayan-araci-satmanin-yollari",
    title: "Çalışmayan Aracı Satmanın Yolları",
    excerpt:
      "Marş almayan veya uzun süredir çalışmayan aracınızı değerlendirmek için izleyebileceğiniz adımlar.",
    category: "Araç Değerleme",
    date: "2026-04-10",
    readingMinutes: 4,
    image: "/images/blog/motor-arizali-arac.jpg",
    imageAlt: "Motor arızası nedeniyle çalışmayan beyaz otomobil",
    body: [
      { type: "p", text: "Çalışmayan araçlar da değerlendirilebilir. Önemli olan aracın mevcut durumunu doğru aktarmaktır." },
      { type: "h2", text: "Arıza kaynağını bilmiyorsanız" },
      { type: "p", text: "Aracın neden çalışmadığını bilmeseniz dahi değerlendirme talebi oluşturabilirsiniz. Gerektiğinde taşıma seçenekleri planlanır." },
    ],
    sample: true,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
