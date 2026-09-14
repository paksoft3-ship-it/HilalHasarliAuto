import type { FaqItem } from "./faq";

/** Simple structured content block (avoids a markdown dependency). */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "note"; text: string }
  | { type: "img"; src: string; alt: string; width?: number; height?: number }
  | { type: "table"; header: string[]; rows: string[][] };

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
  /** ISO date of the last content edit (CMS updatedAt). Falls back to `date`. */
  modified?: string;
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
    image: "/images/blog/az-hasarli-arac.webp",
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
    image: "/images/blog/pert-arac.webp",
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
    image: "/images/blog/az-hasarli-arac.webp",
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
    image: "/images/blog/kazali-arac-egea-on.webp",
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
    image: "/images/blog/kazali-arac-agir-hasar.webp",
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
    image: "/images/blog/cekici-citroen-c4.webp",
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
    image: "/images/blog/hasarli-arac-on-hasar.webp",
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
    image: "/images/blog/yan-kaza-egea.webp",
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
    image: "/images/blog/cekme-belgeli-arac.webp",
    imageAlt: "Ön sol tarafı hasarlı gri otomobil",
    body: [
      { type: "p", text: "[Hasarlı bir aracı satmak](/arac-alimi/hasarli-arac-alimi), sağlam bir aracı satmaktan farklı bir süreçtir. Aracın gerçek durumunu doğru aktarmak hem değerlemeyi hem de devir sürecini hızlandırır." },
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
      { type: "p", text: "Anlaşma sağlandığında devir noterde yapılır ve ödeme imza ile eş zamanlı gerçekleşir. Ruhsat sahibinin randevuda bulunması ya da noterden satış vekâleti vermesi gerekir." },
      { type: "note", text: "Devirden önce kapora, nakliye avansı veya dosya masrafı isteyen alıcılara karşı dikkatli olun; ciddi alıcı ödemeyi devirle birlikte yapar." },
      { type: "h2", text: "5. Rehin, haciz ve MTV kontrolü" },
      { type: "p", text: "Araç üzerinde kredi rehni veya haciz şerhi varsa devir öncesinde kaldırılmalıdır. Ödenmemiş MTV ve trafik cezaları da devri engeller; bu kalemleri randevu öncesi kontrol etmek süreci tek seferde bitirir." },
      { type: "h2", text: "Sık yapılan hatalar" },
      { type: "ul", items: [
        "Hasarı olduğundan küçük göstermek — teklif yerinde görüşte düşer",
        "Aracı aylarca bekletmek; hasarlı araç bekledikçe değer kaybeder",
        "Çekici ve noter masraflarının kime ait olduğunu baştan netleştirmemek",
        "Devir belgesinin bir nüshasını saklamamak",
      ] },
    ],
    faqs: [
      { q: "Hasarlı aracı ekspertizsiz satabilir miyim?", a: "Evet. Ekspertiz zorunlu değildir; ancak elinizde varsa değerlendirmeyi hızlandırır ve teklifin isabetini artırır." },
      { q: "Aracım çalışmıyor, yine de satabilir miyim?", a: "Satabilirsiniz. Çalışmayan araçlar için çekici organize edilir; aracı çalıştırmanız veya bir yere getirmeniz gerekmez." },
      { q: "Kredisi devam eden aracı satabilir miyim?", a: "Evet, ancak devirden önce kalan borcun kapatılıp rehin şerhinin kaldırılması gerekir. Bu adım devir randevusu planlanırken birlikte çözülür." },
    ],
    sample: false,
  },
  {
    slug: "pert-arac-nedir-nasil-degerlenir",
    title: "Pert Araç Nedir ve Nasıl Değerlenir?",
    excerpt:
      "Pert kaydı, ağır hasarlı araçların değerlemesini nasıl etkiler? Pert araç satışında dikkat edilmesi gerekenler.",
    category: "Pert ve Ağır Hasar",
    date: "2026-04-28",
    readingMinutes: 5,
    image: "/images/blog/pert-arac.webp",
    imageAlt: "Lastikler arasında bekleyen, ön tarafı ağır hasarlı pert araç",
    body: [
      { type: "p", text: "[Pert araç](/arac-alimi/pert-arac-alimi), onarım maliyetinin aracın değerine yakın veya üzerinde olması nedeniyle ekonomik onarımı uygun görülmeyen araçtır." },
      { type: "h2", text: "Pert kaydının değerlemeye etkisi" },
      { type: "p", text: "Pert kaydı, aracın değerini etkileyen önemli bir faktördür. Ancak nihai değer, aracın bütünü ve kullanılabilir parçaları dikkate alınarak belirlenir." },
      { type: "h2", text: "Pert araç satışında belge süreci" },
      { type: "p", text: "Pert kaydının türü devir adımlarını doğrudan belirler. Onarımı ekonomik görülmeyen ancak trafiğe çıkabilecek araçlarda normal noter devri yapılırken, ağır hasar kaydı işlenmiş araçlarda çekme belgesi veya hurda süreci gündeme gelir." },
      { type: "h2", text: "Pert türleri arasındaki fark" },
      { type: "table", header: ["Durum", "Trafiğe çıkabilir mi?", "Satış yolu"], rows: [
        ["Onarımı ekonomik olmayan (kısmi)", "Evet, onarım sonrası", "Noterde normal devir"],
        ["Ağır hasar kaydı", "Hayır", "Çekme belgesi ile devir"],
        ["Hurdaya ayrılan", "Hayır", "Hurda belgesi süreci"],
      ] },
      { type: "h2", text: "Sigortadan kalan araç (sovtaj) ne olur?" },
      { type: "p", text: "Kasko pert ödemesi sonrası aracı sigorta şirketine bırakmayıp kendinizde tutmayı seçtiyseniz, o araç hâlâ sizindir ve ayrıca satılabilir. Bu araçlar parça ve metal değeri üzerinden değerlenir; birçok araç sahibi bu kalemin farkında olmadığı için gelir kaybeder." },
      { type: "note", text: "Pert kaydı olan bir aracın satılamayacağı yaygın bir yanlış bilgidir. Kayıt, satışı engellemez; yalnızca izlenecek resmi yolu değiştirir." },
    ],
    faqs: [
      { q: "Pert kayıtlı araç satılabilir mi?", a: "Satılabilir. Kaydın türüne göre noter devri, çekme belgesi veya hurda süreci uygulanır; hangisinin geçerli olduğu değerlendirme sırasında netleştirilir." },
      { q: "Pert aracın değeri nasıl hesaplanır?", a: "Değer; aracın kullanılabilir parçaları, motor ve şanzıman durumu, model yılı ve metal değeri birlikte hesaplanarak belirlenir. Kaydın tutarı tek başına belirleyici değildir." },
    ],
    sample: false,
  },
  {
    slug: "calismayan-araci-satmanin-yollari",
    title: "Çalışmayan Aracı Satmanın Yolları",
    excerpt:
      "Marş almayan veya uzun süredir çalışmayan aracınızı değerlendirmek için izleyebileceğiniz adımlar.",
    category: "Araç Değerleme",
    date: "2026-04-10",
    readingMinutes: 4,
    image: "/images/blog/motor-arizali-arac.webp",
    imageAlt: "Motor arızası nedeniyle çalışmayan beyaz otomobil",
    body: [
      { type: "p", text: "[Çalışmayan araçlar](/arac-alimi/calismayan-arac-alimi) da değerlendirilebilir. Önemli olan aracın mevcut durumunu doğru aktarmaktır." },
      { type: "h2", text: "Arıza kaynağını bilmiyorsanız" },
      { type: "p", text: "Aracın neden çalışmadığını bilmeseniz dahi değerlendirme talebi oluşturabilirsiniz; arızayı tespit ettirmek satıcının yükümlülüğü değildir. Marş denemesinin kısa bir videosu, teklifin isabetini artırmak için genellikle yeterlidir." },
      { type: "h2", text: "Yaygın çalışmama nedenleri ve değere etkisi" },
      { type: "table", header: ["Neden", "Onarım maliyeti", "Değere etkisi"], rows: [
        ["Akü bitmiş / şarj tutmuyor", "Düşük", "Çok sınırlı"],
        ["Marş motoru veya alternatör", "Orta", "Sınırlı"],
        ["Debriyaj / şanzıman", "Yüksek", "Belirgin"],
        ["Motor arızası (hararet, sarma)", "Çok yüksek", "En yüksek etki"],
      ] },
      { type: "h2", text: "Tamir ettirip satmak mantıklı mı?" },
      { type: "p", text: "Genellikle hayır. Yüksek maliyetli onarımlar (motor, şanzıman) ikinci el fiyatına nadiren aynı oranda yansır; 60 bin liralık bir motor yenilemesi aracın satış değerini çoğu zaman o kadar artırmaz. Düşük maliyetli kalemlerde (akü, marş) ise onarım kendini amorti edebilir." },
      { type: "h2", text: "Uzun süre bekleyen araçlar" },
      { type: "p", text: "Aylarca hareketsiz kalan araçlarda akü, lastik, fren ve yakıt sistemi sorunları birikir; bekleme süresi uzadıkça değer düşer. Kullanmayacağınız bir aracı bekletmek yerine erken değerlendirmek, çoğu durumda daha yüksek getiri sağlar." },
      { type: "note", text: "Çalışmayan araçlarda çekici organizasyonu alıcıya aittir; aracı çalıştırmanız veya bir yere götürmeniz gerekmez." },
    ],
    faqs: [
      { q: "Marş almayan aracı çekiciye yüklemek zorunda mıyım?", a: "Hayır. Çekici bizim tarafımızdan organize edilir ve aracın bulunduğu adrese gelir; sizin bir işlem yapmanız gerekmez." },
      { q: "Motoru yanmış aracın değeri kalır mı?", a: "Kalır. Gövde, şanzıman, elektronik aksam ve iç donanım kullanılabilir durumdaysa aracın ciddi bir parça değeri vardır." },
    ],
    sample: false,
  },

  // --- Phase 6: question-title posts. Titles match real search queries
  // verbatim (İnsanlar Ayrıca Soruyor / AI Overview data, research pass
  // 2026-09-14 — see ~/MyRestProjects/ArabaAnahtarKelimeler/google-serp-*.md).
  // Each answers the question directly in the first paragraph, then links to
  // the matching Phase 3 cluster page.
  {
    slug: "hasarli-aracimi-satmak-istiyorum-nereye-satabilirim",
    title: "Hasarlı Aracımı Satmak İstiyorum — Nereye Satabilirim?",
    excerpt:
      "Hasarlı aracınızı ilan açmadan, doğrudan bir alıcıya satabilirsiniz. Seçenekleriniz, süreç adımları ve hazır bulundurmanız gereken bilgiler bu yazıda.",
    metaDescription:
      "Hasarlı aracınızı nereye satabileceğinizi mi merak ediyorsunuz? İlan siteleri, ihale platformları ve doğrudan alım yapan firmalar arasındaki farkı ve süreci anlatıyoruz.",
    metaKeywords:
      "hasarlı aracımı satmak istiyorum, hasarlı araç nereye satılır, hasarlı araç alan, hasarlı araç alım yapan yerler",
    category: "Hasarlı Araç",
    date: "2026-09-14",
    readingMinutes: 3,
    image: "/images/blog/hasarli-arac-online-teklif-sureci.webp",
    imageAlt: "Hasarlı aracını fotoğraflayıp online teklif sürecine başlayan kullanıcı",
    body: [
      { type: "p", text: "Hasarlı aracınızı doğrudan alım yapan firmalara satabilirsiniz; ilan açıp alıcı beklemenize gerek kalmaz. Araç bilgilerinizi ve fotoğraflarınızı paylaştığınızda değerlendirme yapılır, teklif iletilir ve anlaşma sağlanırsa noter devri ile süreç aynı gün tamamlanabilir." },
      { type: "h2", text: "Hangi Seçenekleriniz Var?" },
      { type: "p", text: "İkinci el ilan siteleri sağlam araçlar için uygundur ama hasarlı bir aracı bu platformlarda satmak zordur: alıcı kitlesi dardır, süreç yavaş ilerler ve pazarlık ilan üzerinden, yabancı kişilerle birebir yürür. Sigorta şirketleriyle çalışan ihale/eşleştirme platformları ise genellikle bireysel satıcıya değil kurumsal tarafa hizmet verir. Hasarlı araç alan firmalar, üçüncü bir seçenek olarak doğrudan alıcı rolünü üstlenir." },
      { type: "ul", items: [
        "İlan siteleri — geniş kitleye açık ama hasarlı araçta yavaş ve belirsiz",
        "İhale / eşleştirme platformları — çoğunlukla kurumsal tarafa hizmet eder",
        "Doğrudan alım yapan firmalar — tek muhatap, aracı bulunduğu yerden alır",
      ] },
      { type: "h2", text: "İlan Sitelerinde Neden Zorlanırsınız?" },
      { type: "p", text: "Sağlam bir aracı ilan sitesinde satmak günler sürebilir; hasarlı bir aracı satmaksa çoğu zaman haftalarca sürer. Fotoğrafları gören ilgililerin büyük kısmı hasarı öğrenince vazgeçer, geriye kalanlar ise yerinde görüşte fiyatı aşağı çekmeye çalışır. Her görüşme için ayrı randevu planlamak, aracı defalarca göstermek ve her seferinde pazarlığı baştan yapmak, özellikle aracınızı bir an önce elden çıkarmak istiyorsanız yıpratıcı bir süreçtir." },
      { type: "h2", text: "Doğrudan Satışta Süreç Nasıl İşler?" },
      { type: "ol", items: [
        "Araç bilgisi ve güncel fotoğrafların paylaşılması",
        "Bu bilgilere dayanan ön değerlendirme ve teklif",
        "Teklifin incelenip kabul edilmesi",
        "Noter devri ve ödemenin eş zamanlı tamamlanması",
        "Gerekiyorsa ücretsiz çekici ile teslim alma",
      ] },
      { type: "p", text: "Bu adımların hiçbiri aracın hasarsız veya çalışır olmasını şart koşmaz. Süreç, aracın mevcut durumuna göre şekillenir; sürülemeyen bir araç için taşıma planlaması, ilk değerlendirmeyle birlikte yapılır." },
      { type: "h2", text: "Hangi Bilgileri Hazır Bulundurmalısınız?" },
      { type: "p", text: "Değerlendirmenin isabetli olması, paylaştığınız bilginin eksiksizliğine bağlıdır. Aşağıdaki bilgiler elinizin altındaysa ön teklif çoğu zaman aynı gün gelir:" },
      { type: "ul", items: [
        "Marka, model, model yılı ve güncel kilometre",
        "Hasarın türü ve kapsamı (kaza, yangın, su baskını, mekanik arıza)",
        "Aracın çalışır durumda olup olmadığı",
        "Ruhsat durumu ve varsa ekspertiz/hasar kaydı",
      ] },
      { type: "note", text: "Hasar seviyesi ne olursa olsun değerlendirme yapılır; küçük çiziklerden ağır hasara kadar geniş bir aralık kapsam dahilindedir." },
      { type: "h2", text: "Teklifi Değerlendirirken Nelere Dikkat Etmelisiniz?" },
      { type: "p", text: "Gelen teklifi acele etmeden inceleyin. Şeffaf bir alıcı, fiyatın hangi bilgilere dayandığını açıklar ve rakamın nasıl oluştuğunu sorduğunuzda net cevap verir. Devirden önce kapora, dosya masrafı veya nakliye avansı isteyen bir muhatapla karşılaşırsanız temkinli olun." },
      { type: "ul", items: [
        "Ödeme, noter devriyle eş zamanlı yapılmalı — önce imza sonra ödeme değil",
        "Çekici ücreti kime ait, baştan netleşmeli",
        "Teklifin bağlayıcı olup olmadığı açıkça belirtilmeli",
      ] },
      { type: "p", text: "Noter devri sırasında yanınızda araç ruhsatı ve kimliğinizin bulunması yeterlidir; devir tek işlemde tamamlanır ve ödemeniz aynı anda elinize geçer. Aracınız sürülemiyor durumdaysa, teslim için çekici planlaması bu görüşmede netleşir ve masrafı standart olarak alıcıya aittir." },
      { type: "h2", text: "Hangi Hasar Türleri Kapsam Dahilinde?" },
      { type: "p", text: "\"Hasarlı araç\" tek bir kategori değildir; aracınızın durumu ne olursa olsun değerlendirme yapılır:" },
      { type: "ul", items: [
        "Kazalı — trafik kazası sonucu gövde veya mekanik hasar",
        "Ağır hasarlı — şase, tavan veya hava yastığı gibi kritik hasar",
        "Pert kayıtlı — sigortanın ekonomik olarak pert ilan ettiği araçlar",
        "Motor veya mekanik arızalı — çalışmayan, tutuk çalışan veya aktarma organı arızalı araçlar",
        "Yanmış veya sel hasarlı — kısmi/tam yangın veya su hasarı görmüş araçlar",
        "Hurda veya çekme belgeli — ekonomik ömrünü tamamlamış araçlar",
      ] },
      { type: "p", text: "Aracınızın durumu bu listede tam olarak karşılığını bulmuyorsa da başvurmaktan çekinmeyin; birden fazla hasar türü bir arada bulunan araçlar da normal bir başvuru gibi değerlendirilir. Örneğin hem kaza hasarı hem de motor arızası bulunan bir araç, iki ayrı başvuru gerektirmeden tek bir değerlendirmede ele alınır." },
      { type: "p", text: "Değerlendirme talebi oluşturmanın herhangi bir ön koşulu veya ücreti yoktur. Aracınızın markasını, modelini ve durumunu net şekilde anlattığınız sürece, süreç aynı gün içinde ilerleyebilir; fotoğrafların net ve aracın gerçek durumunu yansıtır olması, ilk teklifin yerinde görüşte değişmeden kalmasını sağlar." },
      { type: "p", text: "Aracınızın hasar türüne özel daha fazla bilgi ve sık sorulan sorular için [hasarlı araç alan](/) sayfamıza göz atabilir, ya da doğrudan fotoğraf göndererek değerlendirme talebi oluşturabilirsiniz." },
    ],
    faqs: [
      { q: "Ekspertiz raporum yok, yine de satabilir miyim?", a: "Evet. Ekspertiz raporu zorunlu değildir; varsa süreci hızlandırır ama olmadan da değerlendirme talebi oluşturabilirsiniz." },
      { q: "Sigorta süreci bitmeden aracımı satabilir miyim?", a: "Çoğu hasar türünde evet. Yalnızca pert kaydı söz konusuysa, sigortanın resmi kararı ve mülkiyetin netleşmesi beklenir." },
    ],
    sample: false,
  },

  {
    slug: "agir-hasarli-aracimi-nasil-satarim",
    title: "Ağır Hasarlı Aracımı Nasıl Satarım?",
    excerpt:
      "Ağır hasarlı, sürülemeyen bir aracı satmak sağlam bir araçtan farklı işler. Taşıma, değerlendirme ve devir adımlarını bu yazıda anlattık.",
    metaDescription:
      "Ağır hasarlı aracınızı nasıl satabileceğinizi mi merak ediyorsunuz? Sürülemeyen araçlarda taşıma, değerlendirme ve noter devri adımlarını anlatıyoruz.",
    metaKeywords:
      "ağır hasarlı aracımı nasıl satarım, ağır hasarlı araç alan, ağır hasarlı araç satmak, pert araç satmak",
    category: "Pert ve Ağır Hasar",
    date: "2026-09-14",
    readingMinutes: 3,
    image: "/images/blog/kazali-arac-agir-hasar.webp",
    imageAlt: "Gövdesi ağır şekilde deforme olmuş, sürülemeyen otomobil",
    body: [
      { type: "p", text: "Ağır hasarlı aracınızı, tıpkı sağlam bir araç gibi doğrudan bir alıcıya satabilirsiniz; tek fark, aracın sürülemiyor olması durumunda taşımanın da sürece dahil edilmesidir. Fotoğraf ve bilgi paylaşımının ardından değerlendirme yapılır, teklif verilir ve anlaşma sağlanırsa aracınız bulunduğu yerden alınır." },
      { type: "h2", text: "Ağır Hasarlı Araç Ne Demek?" },
      { type: "p", text: "Ağır hasarlı araç; gövdesinde, şasisinde veya ana mekanik aksamında ciddi düzeyde zarar oluşmuş, çoğu zaman sürülemeyecek durumdaki araçtır. Onarımı teknik olarak mümkün olsa bile maliyeti genellikle ekonomik değildir; bu da satmayı, onarıp kullanmaya kıyasla daha mantıklı bir seçenek hâline getirir. Tavan, şasi veya hava yastığı gibi kritik noktalarda hasar bulunması, aracı bu kategoriye sokan en tipik durumdur." },
      { type: "h2", text: "Onarım mı, Satış mı Daha Mantıklı?" },
      { type: "p", text: "Ağır hasarlı bir aracın onarımı, genellikle parça ve işçilik maliyeti aracın piyasa değerine yaklaştığı için ekonomik çıkmaz. Onarıp sattığınızda bile harcadığınız tutarı satış fiyatına aynı oranda yansıtmanız zordur. Bu nedenle çoğu araç sahibi için, aracı olduğu hâliyle değerlendirip satmak — hem zaman hem maliyet açısından — daha isabetli bir tercih olur." },
      { type: "p", text: "Onarım yolunu seçseniz bile, parça tedariki ve işçilik süresi belirsizlik taşır; bu süre boyunca araç kullanılamaz durumda kalır ve değer kaybetmeye devam eder. Satış tarafında ise süreç günler içinde, çoğu zaman aynı hafta tamamlanır." },
      { type: "p", text: "Bu karşılaştırmayı yapmak için yalnızca birkaç fotoğraf ve temel araç bilgisi yeterlidir; onarım teklifi almadan önce, satış durumunda ne kadar bir rakamla karşılaşacağınızı görmüş olursunuz. Bu, hiçbir şekilde sizi bağlayan bir adım değildir." },
      { type: "h2", text: "Sürülemeyen Aracı Nasıl Teslim Edersiniz?" },
      { type: "p", text: "Aracınız hareket etmiyor olsa bile bir yere götürmenize gerek yoktur. Taşıma seçenekleri, değerlendirme aşamasında konuma göre planlanır ve genellikle çekici masrafı alıcı tarafından karşılanır." },
      { type: "ul", items: [
        "Aracın bulunduğu adresten alınması",
        "Site veya kapalı otoparklardan çıkarma dahil planlama",
        "Çekici ücretinin alıcıya ait olması (standart uygulama)",
      ] },
      { type: "h2", text: "Hangi Durumlar Ağır Hasarlı Sayılır?" },
      { type: "ul", items: [
        "Tavan veya şaside deformasyon",
        "Hava yastığının açılmış olması",
        "Çoklu bölge hasarı (ön + yan, arka + tavan gibi)",
        "Aracın kendi gücüyle hareket edememesi",
      ] },
      { type: "h2", text: "Değerlendirme Sürecinde Nelere Bakılır?" },
      { type: "ul", items: [
        "Şase veya karoser deformasyon derecesi",
        "Aracın sürülebilir olup olmadığı",
        "Ana mekanik aksamın etkilenip etkilenmediği",
        "Parça bütünlüğü ve kullanılabilir donanım",
      ] },
      { type: "p", text: "Fiyatı en çok bu dört unsur birlikte belirler. Sabit bir yüzde veya formül kullanılmaz; hasarın şase/taşıyıcı yapıya ulaşıp ulaşmadığı ile aracın sürülüp sürülemediği, aynı hasar seviyesindeki iki aracı bile farklı bir bant aralığına taşıyabilir." },
      { type: "h2", text: "Pert Kaydı Varsa Ne Değişir?" },
      { type: "p", text: "Ağır hasarlı bir araç, sigorta tarafından resmi olarak pert de ilan edilmiş olabilir. Bu durumda satış hâlâ mümkündür, ancak sigortanın pert kararı ve araç mülkiyetinin netleşmiş olması gerekir. Bu iki koşul netleşmeden nihai teklif verilemez; sürecin doğal bir parçasıdır." },
      { type: "note", text: "Pert kaydı bulunan araçlar hakkında daha fazla bilgi için [pert araç alan](/pert-arac-alan) sayfamıza göz atabilirsiniz." },
      { type: "h2", text: "Satış Sürecinde Sizden Ne İstenir?" },
      { type: "p", text: "Süreç, sağlam bir aracın satışından belge açısından farklı değildir: araç ruhsatı ve devir sırasında kimlik yeterlidir. Varsa ekspertiz raporu veya sigorta hasar dosyası, değerlendirmeyi daha isabetli hâle getirir ama şart değildir. Aracın rehinli olması durumunda, devirden önce borcun kapatılması ve şerhin kaldırılması gerekir; bu adım devir randevusu planlanırken birlikte çözülür." },
      { type: "p", text: "Aracınız sürülemiyor, gövdesi ağır hasarlı veya pert kayıtlı olsa bile değerlendirme talebi oluşturmanız için hiçbir engel yok. Fotoğraf ve bilgi paylaşımıyla süreç başlar, taşıma ihtiyacı da aynı görüşmede netleşir." },
      { type: "p", text: "Onarım kararını vermeden önce, olduğu hâliyle alacağınız teklifi görmenizde fayda var: bazı durumlarda satış, onarım masrafına girmekten daha kârlı çıkar. Bu karşılaştırmayı yapabilmeniz için ön değerlendirme her zaman ücretsizdir ve sizi hiçbir şekilde bağlamaz." },
      { type: "p", text: "Aracınızın fotoğraflarını ve bilgilerini paylaştığınızda, gövdenin hangi bölgesinin etkilendiğini ve aracın sürülüp sürülemediğini belirtmeniz değerlendirmeyi hızlandırır. Bu bilgiler ne kadar net olursa, ilk teklif de gerçek duruma o kadar yakın çıkar." },
      { type: "p", text: "Fotoğraf çekerken aracın dört köşesini, hasarlı bölgelerin yakın çekimini ve motor bölmesini kadraja alın; şase numarasının okunaklı bir görüntüsü de ilk değerlendirmeyi güçlendirir. Araç sürülemiyorsa bile, mevcut hâliyle çekilmiş net fotoğraflar isabetli bir teklif almanız için yeterlidir." },
    ],
    faqs: [
      { q: "Aracım çekiciyle taşınması gereken durumda, yine de teklif alabilir miyim?", a: "Evet. Taşıma ihtiyacı değerlendirmeyi engellemez; çekici planlaması konuma göre ayrıca yapılır." },
      { q: "Şasesi hasarlı araçları da alıyor musunuz?", a: "Evet. Şase veya karoser hasarı olan araçlar da kapsam dahilindedir; hasarın derecesi değerlendirmeye yansıtılır." },
    ],
    sample: false,
  },

  {
    slug: "pert-aracimi-satabilir-miyim",
    title: "Pert Aracımı Satabilir Miyim?",
    excerpt:
      "Evet, pert kayıtlı bir aracı satmak mümkün. Hangi koşulların netleşmesi gerektiğini ve satış sürecinin nasıl işlediğini anlattık.",
    metaDescription:
      "Pert aracımı satabilir miyim? Evet — sigorta kaydı ve mülkiyet netleştikten sonra pert aracınızı doğrudan satabilirsiniz. Süreç ve koşullar bu yazıda.",
    metaKeywords:
      "pert aracımı satabilir miyim, pert araç satılır mı, pert araç alan, pert araç alım yapan yerler",
    category: "Pert ve Ağır Hasar",
    date: "2026-09-14",
    readingMinutes: 3,
    image: "/images/blog/pert-arac-sigorta-belgeleri-kapak.webp",
    imageAlt: "Sigorta belgeleriyle birlikte değerlendirmeye hazırlanan pert kayıtlı araç",
    body: [
      { type: "p", text: "Evet, pert kayıtlı aracınızı satabilirsiniz. Tek koşul, sigorta şirketinin aracı resmi olarak pert ilan etmiş olması ve araç mülkiyetinin netleşmiş olmasıdır; bu iki şart sağlandığında doğrudan bir alıcıya satış yapabilir, onarıma veya uzun bir ihale sürecine girmeden aracınızı nakde çevirebilirsiniz." },
      { type: "h2", text: "Pert Kaydı Satışı Neden Engellemez?" },
      { type: "p", text: "Pert, aracın kullanılamaz olduğu anlamına gelmez; sigorta şirketinin onarım maliyetini ekonomik bulmadığı anlamına gelir. Motor, şanzıman, elektronik aksam ve iç donanım gibi kullanılabilir parçalar çoğu zaman hâlâ değer taşır. Bu nedenle pert kayıtlı araçlar için özel olarak değerlendirme yapan alıcılar vardır." },
      { type: "p", text: "Pert kaydını satıştan önce gizlemeye çalışmak da gereksizdir: kayıt zaten TRAMER sisteminde görünür ve şeffaf bir alıcı bunu zaten sorgular. Kaydı açıkça paylaşmak, hem yasal açıdan doğru hem de sürecin daha hızlı ilerlemesini sağlayan bir yaklaşımdır." },
      { type: "p", text: "Bazı araç sahipleri pert kaydını gördüklerinde aracı hemen hurdaya yönlendirmeyi düşünür; oysa pert ile hurda farklı kategorilerdir ve pert bir aracın çoğu zaman hurdadan daha yüksek bir değeri vardır. Bu ayrımı netleştirmeden karar vermek, elinizdeki değeri gözden kaçırmanıza yol açabilir." },
      { type: "p", text: "Karar vermeden önce her iki yolu da (hurdaya ayırma ve pert olarak satış) karşılaştırmanız, doğru seçim için en sağlıklısıdır; ikisi için de değerlendirme talebi oluşturmak ücretsizdir ve sizi bağlamaz." },
      { type: "h2", text: "Pert Total ile Pert Muhtemel Farkı" },
      { type: "p", text: "Pert kaydı genellikle iki alt kategoriye ayrılır ve bu ayrım satış seçeneklerinizi etkiler:" },
      { type: "ul", items: [
        "Pert Total (Tam Pert): Onarımı teknik veya ekonomik olarak mümkün değildir; araç genellikle olduğu gibi veya parça değeri üzerinden değerlendirilir.",
        "Pert Muhtemel (Ekonomik Pert): Onarım teknik olarak mümkündür ama maliyeti aracın değerine yakındır; bu araçlar olduğu gibi satılabileceği gibi onarılıp da değerlendirilebilir.",
      ] },
      { type: "p", text: "Hangi kategoride olursanız olun, aracı olduğu hâliyle ve tek seferde satmak — onarım riskine ve uzun bekleme sürecine girmeden — çoğu araç sahibi için en pratik seçenektir." },
      { type: "h2", text: "Satmadan Önce Netleşmesi Gereken İki Şey" },
      { type: "ul", items: [
        "Sigorta şirketinin resmi pert kararı — kaza sonrası süreç henüz tamamlanmadıysa beklenmesi gerekir",
        "Araç mülkiyetinin netliği — rehin, haciz veya ortak sahiplik gibi durumların çözülmüş olması",
      ] },
      { type: "p", text: "Bu iki koşul netleşmeden nihai teklif verilemez; ön değerlendirme yine de yapılabilir, ancak devir ve ödeme bu netleşmenin ardından planlanır." },
      { type: "h2", text: "Sovtaj Bedeli Düşülmüşse Ne Olur?" },
      { type: "p", text: "Sigortanız, pert araç için tazminat öderken hurda/hasarlı değerini (sovtaj bedelini) tazminattan düşmüş olabilir. Bu durum satışınızı engellemez; sovtaj bedeli düşülerek ödeme almış araçlar da aynı şekilde değerlendirmeye alınır." },
      { type: "h2", text: "Satış Süreci Nasıl İşler?" },
      { type: "ol", items: [
        "Araç bilgisi ve fotoğrafların paylaşılması",
        "Varsa pert tutanağı veya eksper raporunun iletilmesi",
        "Sigorta kararı ve mülkiyet netleştikten sonra nihai teklifin verilmesi",
        "Noter devri ve ödemenin eş zamanlı tamamlanması",
      ] },
      { type: "note", text: "Pert araçlarla ilgili daha fazla bilgi, tanım ve sık sorulan sorular için [pert araç alan](/pert-arac-alan) sayfamıza göz atabilirsiniz." },
      { type: "h2", text: "Pert Aracın Değeri Nasıl Belirlenir?" },
      { type: "p", text: "Sabit bir yüzde veya formül kullanılmaz. Aracın markası, modeli, pert kaydındaki hasar kapsamı ve kullanılabilir parça/mekanik değeri birlikte değerlendirilir. Sovtaj bedeli düşülerek sigortadan ödeme almış araçlar da bu kapsamda, mevcut fiziki durumuna göre teklif alır." },
      { type: "h2", text: "Pert Aracınızı Kime Satmalısınız?" },
      { type: "p", text: "İlan sitelerinde pert bir araca alıcı bulmak zordur; çoğu bireysel alıcı pert kaydından çekinir ve süreç uzar. Sigorta şirketleriyle çalışan ihale platformları ise genellikle bireysel satıcıya değil kurumsal tarafa hizmet verir. Pert araçlar için özel olarak değerlendirme yapan doğrudan alıcılar, bu iki seçeneğin ortasında kalan, hızlı ve tek muhataplı bir yol sunar." },
      { type: "h2", text: "Devir Aşamasında Nelere İhtiyacınız Olur?" },
      { type: "p", text: "Standart bir devirde araç ruhsatı ve kimlik yeterlidir. Pert kayıtlı araçlarda ek olarak sigorta şirketinin pert kararını gösteren belge veya eksper raporu istenebilir; bu belge, teklifin gerçekçi ve sigorta süreciyle uyumlu olmasını sağlar. Aracın rehinli olması durumunda, devirden önce borcun kapatılması ve şerhin kaldırılması gerekir." },
      { type: "p", text: "Ödemenin devir imzasıyla eş zamanlı yapılması esastır; önce imza sonra ödeme gibi düzenler risklidir. Ciddi bir alıcı, devir tamamlanırken ödemeyi elinize ulaştırır ve öncesinde sizden kapora veya dosya masrafı talep etmez." },
      { type: "p", text: "Özetle: pert kaydı bir aracı satılamaz hâle getirmez, yalnızca süreci sigorta tarafıyla uyumlu şekilde planlamanızı gerektirir. Bu iki koşul sağlandığında, aracınızı olduğu gibi ve tek seferde satmak mümkündür." },
    ],
    faqs: [
      { q: "Pert aracımı onarmadan satabilir miyim?", a: "Evet. Aracınızı mevcut durumuyla, onarmadan satabilirsiniz; bu en hızlı ve en pratik yöntemdir." },
      { q: "Pert kaydı aracın değerini tamamen sıfırlar mı?", a: "Hayır. Pert kaydı değeri düşürür ama sıfırlamaz; kullanılabilir parça ve mekanik değer üzerinden gerçekçi bir teklif oluşturulur." },
    ],
    sample: false,
  },

  {
    slug: "hurda-aracimi-nereye-satabilirim",
    title: "Hurda Aracımı Nereye Satabilirim?",
    excerpt:
      "Hurda aracınızı resmi belgeli bir işlemle doğrudan satabilirsiniz. Hurdaya ayırmadan önce netleştirmeniz gereken tek koşulu ve süreci anlattık.",
    metaDescription:
      "Hurda aracınızı nereye satabileceğinizi mi merak ediyorsunuz? Resmi hurda belgeli işlem, MTV borcu şartı ve satış süreci bu yazıda.",
    metaKeywords:
      "hurda aracımı nereye satabilirim, hurda araç alan, hurda araç alım yapan yerler, hurdaya araç satmak",
    category: "Hurda ve Çekme Belgeli",
    date: "2026-09-14",
    readingMinutes: 3,
    image: "/images/blog/hurda-arac-fiyatlari-kapak.webp",
    imageAlt: "Hurdaya ayrılmayı bekleyen, ekonomik ömrünü tamamlamış eski araç",
    body: [
      { type: "p", text: "Hurda aracınızı doğrudan hurda araç alan firmalara satabilirsiniz; resmi hurda belgeli işlem süreç boyunca sizinle birlikte planlanır. Tek koşul, hurdaya ayırmadan önce aracın MTV (Motorlu Taşıtlar Vergisi) borcunun ve varsa trafik cezalarının kapatılmış olmasıdır." },
      { type: "h2", text: "Hurdaya Ayırmadan Önce Ne Yapmalısınız?" },
      { type: "p", text: "Hurda devri resmi bir işlemdir ve aracın üzerinde MTV borcu veya trafik cezası varken tamamlanamaz. Bu borçları devir öncesinde kapatmak, süreci hızlandıran ilk adımdır." },
      { type: "ul", items: [
        "MTV borcunuzu e-Devlet üzerinden Gelir İdaresi Başkanlığı sorgu ekranından kontrol edin",
        "Varsa trafik cezalarını İçişleri Bakanlığı sorgu ekranından görüntüleyip kapatın",
        "Borç kalmadığını gösteren belgeyi devir randevusuna götürün",
      ] },
      { type: "note", text: "Bu sorgular e-Devlet üzerinden ücretsizdir; hizmet adı zaman zaman güncellenebilir, bulamazsanız \"MTV borç sorgulama\" anahtar kelimesiyle aratmanız en hızlı yoldur." },
      { type: "p", text: "Borç durumunu önceden netleştirmek yalnızca devri hızlandırmaz; teklif aşamasında da netlik sağlar. Borcu belirsiz bir araç için verilen ön değerlendirme, borç kapatıldıktan sonra değişebilir; bu yüzden mümkünse sorguyu başvurudan önce yapmanız önerilir." },
      { type: "h2", text: "Hurda Araç Alan Firma ile Hurdacı Arasındaki Fark Nedir?" },
      { type: "p", text: "\"Hurdacı\" günlük dilde sık kullanılan bir terimdir ve hurda araç alan firmalarla aynı ihtiyacı karşılar. Fark, sürecin resmi belgeli ve şeffaf ilerlemesidir: hurda araç alan firmalar, aracın hurda belgesini düzenli olarak çıkarır ve trafikten çıkış işlemini sizinle birlikte tamamlar." },
      { type: "h2", text: "Hurda Belgesi Düzenlendikten Sonra Ne Olur?" },
      { type: "p", text: "Hurda devri resmi olarak tamamlandığında araç trafikten çıkar ve sizinle ilgili yükümlülükler sona erer: MTV mükellefiyetiniz kapanır, trafik sigortası yenileme zorunluluğunuz kalmaz. Devir belgesinin bir nüshasını saklamanız, ileride araçla ilgili bir bildirim gelmesi ihtimaline karşı yeterlidir." },
      { type: "h2", text: "Hurda Aracın Diğer Satış Seçenekleri" },
      { type: "p", text: "Hurda aracınızı mahalledeki bir hurdacıya, yetkili geri dönüşüm tesisine veya doğrudan alım yapan bir firmaya satabilirsiniz. Mahalle hurdacıları genellikle metal ağırlığına göre hızlı ama düşük bir rakam sunar ve resmi belge süreciyle ilgilenmeyebilir; bu durumda hurda devrini kendinizin takip etmesi gerekebilir. Doğrudan alım yapan firmalar ise hem değerlendirmeyi hem resmi devri tek elden yürütür, böylece MTV ve trafikten çıkış sürecini ayrıca takip etmek zorunda kalmazsınız." },
      { type: "h2", text: "Satış Süreci Nasıl İşler?" },
      { type: "ol", items: [
        "Araç bilgisi ve fotoğrafların paylaşılması",
        "Parça ve metal değerine göre değerlendirme ve teklif",
        "MTV borcu / trafik cezası kontrolü",
        "Hurda belgeli devrin tamamlanması ve ödeme",
      ] },
      { type: "p", text: "Fiyatı en çok aracın kullanılabilir parça ve metal değeri belirler; marka, model ve ağırlık bu değeri doğrudan etkiler. Sabit bir rakam yoktur — güncel fotoğraf ve bilgi paylaşarak aracınıza özel bir değerlendirme alabilirsiniz." },
      { type: "h2", text: "Çekme Belgeli Hurda Araçlar İçin Fark Var mı?" },
      { type: "p", text: "Trafikten çekilmiş, çekme belgeli bir aracı hurdaya ayırmak istiyorsanız süreç aynıdır; tek fark, çekme belgesinin devir sırasında ruhsatla birlikte ibraz edilmesidir. Belgenin düzenlenme nedeni (hasar, arıza veya kayıt sorunu) değerlendirmeyi etkilemez, yalnızca başvuru sırasında paylaşmanız faydalı bir bilgidir." },
      { type: "p", text: "Aracınız uzun süredir bir yerde atıl duruyorsa, hurdaya ayırma kararını geciktirmemekte fayda var: açık alanda bekleyen araçlarda korozyon ve parça kaybı zamanla artar, bu da kullanılabilir değeri düşürür. MTV ve ceza durumunu netleştirip erken başvurmak, genellikle daha yüksek bir teklifle sonuçlanır." },
      { type: "p", text: "Aracın bulunduğu yerden alınması standart uygulamadır; sizin bir yere götürmeniz gerekmez. Çekici, değerlendirme ve anlaşma sonrası konuma göre planlanır ve masrafı alıcı tarafından karşılanır." },
      { type: "h2", text: "Aracın Ruhsatı Kayıpsa Ne Olur?" },
      { type: "p", text: "Ruhsatın kaybolmuş olması hurda başvurusunu engellemez; kayıp ruhsat için trafik tescil kuruluşundan veya e-Devlet üzerinden yeni bir nüsha çıkarılabilir. Bu adım, devir randevusu planlanmadan önce tamamlanması gereken bir detaydır ve değerlendirme aşamasında size hatırlatılır." },
      { type: "p", text: "Benzer şekilde araç sizin adınıza değil, örneğin bir yakınınızın adına kayıtlıysa da satış mümkündür; bu durumda ruhsat sahibinin kendisinin devir randevusunda bulunması ya da noterden düzenlenmiş bir satış vekâletiyle işlem yapılması gerekir." },
      { type: "p", text: "Tüm bu belge ve borç kontrollerini tek tek takip etmek zorunda değilsiniz; başvurunuzu oluşturduğunuzda hangi adımın ne zaman gerektiği size açıkça anlatılır ve süreç birlikte planlanır." },
      { type: "p", text: "Atıl durumda uzun süre bekleyen araçlar zamanla daha da yıpranır ve değer kaybeder. Aracınızı hurdaya ayırmaya karar verdiyseniz, MTV/ceza durumunu netleştirip erken değerlendirmek genellikle daha yüksek getiri sağlar." },
    ],
    faqs: [
      { q: "MTV borcum varken değerlendirme talebi oluşturabilir miyim?", a: "Evet. Değerlendirme ve teklif aşamasında borç şart değildir; yalnızca hurda devrinin resmi olarak sonuçlanabilmesi için devir öncesinde kapatılması gerekir." },
      { q: "Hurda belgesi kim tarafından düzenlenir?", a: "Hurda belgesi, resmi hurda devri sırasında düzenlenir; süreç ve gerekli adımlar değerlendirme aşamasında size açıklanır." },
    ],
    sample: false,
  },

  {
    slug: "hurdaci-arabayi-kaca-alir",
    title: "Hurdacı Arabayı Kaça Alır?",
    excerpt:
      "Hurda araç fiyatı için sabit bir rakam yoktur; fiyatı belirleyen gerçek etkenler ve gerçekçi bir teklif nasıl alınır, bu yazıda anlattık.",
    metaDescription:
      "Hurdacı arabayı kaça alır? Sabit bir fiyat yoktur — marka, model, ağırlık ve parça değeri fiyatı nasıl belirler, bu yazıda anlatıyoruz.",
    metaKeywords:
      "hurdacı arabayı kaça alır, hurda araç fiyatları, hurda araç değeri, hurda araç alan firmalar",
    category: "Hurda ve Çekme Belgeli",
    date: "2026-09-14",
    readingMinutes: 3,
    image: "/images/blog/hurda-metal-parca-bazli-degerleme-infografik.webp",
    imageAlt: "Hurda aracın parça ve metal değerine göre fiyatlandırılmasını gösteren infografik",
    body: [
      { type: "p", text: "Sabit bir rakam yoktur; hurdacının bir aracı kaça aldığı, aracın markası, model yılı, ağırlığı ve kullanılabilir parça durumuna göre değişir. Aynı yaştaki iki araç bile, birinin motoru veya elektronik aksamı sağlam kaldıysa farklı fiyat alabilir." },
      { type: "h2", text: "Fiyatı Belirleyen Gerçek Etkenler" },
      { type: "ul", items: [
        "Aracın ağırlığı ve metal değeri — daha ağır araçlar genellikle daha yüksek hurda değeri taşır",
        "Kullanılabilir parça durumu — motor, şanzıman, elektronik aksam sağlamsa değeri artırır",
        "Marka ve model — bazı parçalara ikinci el piyasada talep daha yüksektir",
        "Güncel hurda metal fiyatları — piyasa koşullarına göre dalgalanabilir",
      ] },
      { type: "p", text: "Bu yüzden telefonda veya internette gördüğünüz \"kilogram başına şu kadar\" gibi genel rakamlar gerçek bir teklifi yansıtmaz; aracınızın gerçek durumu görülmeden verilen her rakam yaklaşıktır." },
      { type: "p", text: "Bölgeye göre de küçük farklar olabilir; hurda metal fiyatları ve taşıma mesafesi, aracın bulunduğu konuma göre teklifi bir miktar etkileyebilir. Yine de belirleyici olan, aracın markası ve kullanılabilir parça durumudur — konum bu tabloda ikincil bir etkendir." },
      { type: "h2", text: "Fiyatı Artıran Durumlar" },
      { type: "ul", items: [
        "Motor, şanzıman ve elektronik aksamın büyük ölçüde sağlam olması",
        "Lastik, akü veya cam gibi parçaların kullanılabilir durumda olması",
        "Aracın kapalı veya korunaklı bir alanda bekletilmiş olması",
        "Belgelerin (ruhsat, varsa servis kayıtları) eksiksiz olması",
      ] },
      { type: "p", text: "Bu etkenlerin hiçbiri tek başına belirleyici değildir; hepsi bir arada değerlendirilir. Bu yüzden aracınızda bu maddelerden biri veya birkaçı eksik olsa da başvurmaktan çekinmeyin — değerlendirme yine de yapılır." },
      { type: "p", text: "Net bir rakam öğrenmenin en hızlı yolu, aracın fotoğraflarını ve temel bilgilerini paylaşmaktır; bu şekilde tahmini bir aralık yerine, aracınıza özel, gerçek durumunu yansıtan bir teklifle karşılaşırsınız ve süreç genellikle aynı gün içinde ilerler." },
      { type: "h2", text: "Fiyatı Düşüren Durumlar" },
      { type: "ul", items: [
        "Eksik veya sökülmüş parçalar (motor, şanzıman, elektronik aksam)",
        "Ağır korozyon veya gövde çürümesi",
        "Uzun süre açık alanda, korunmasız bekletilmiş olması",
        "MTV borcu veya trafik cezası bulunması (devri geciktirir, teklifi değil ama süreci etkiler)",
      ] },
      { type: "h2", text: "Online Sorgu ile Gerçek Teklif Arasındaki Fark" },
      { type: "p", text: "İnternette dolaşan hurda fiyat hesaplayıcıları, yalnızca güncel metal fiyatına ve ortalama ağırlığa dayanır; aracınızın markasını, kullanılabilir parçalarını veya genel durumunu hesaba katmaz. İki farklı araç aynı ağırlıkta olsa bile, biri motor ve elektronik aksamını koruyorsa çok daha yüksek bir teklif alabilir. Bu nedenle online bir hesaplayıcının verdiği rakamı kesin kabul etmek yerine, gerçek bir değerlendirme talep etmek daha sağlıklıdır." },
      { type: "h2", text: "Gerçekçi Bir Teklif Nasıl Alırsınız?" },
      { type: "p", text: "En sağlıklı yöntem, aracın güncel fotoğraflarını ve bilgilerini paylaşarak değerlendirme talebi oluşturmaktır. Bu şekilde, aracınızın gerçek durumuna göre hesaplanmış bir rakamla karşılaşırsınız — genel bir tahminle değil." },
      { type: "ol", items: [
        "Marka, model, model yılı bilgisini paylaşın",
        "Aracın güncel fotoğraflarını gönderin (dört köşe + iç mekân)",
        "Varsa eksik veya sökülmüş parçaları belirtin",
        "Değerlendirme sonrası net teklifi inceleyin",
      ] },
      { type: "h2", text: "Hurdaya Ayırmadan Önce Unutmayın" },
      { type: "p", text: "Hurda devri resmi bir işlemdir ve aracın MTV borcu ile varsa trafik cezalarının kapatılmış olmasını gerektirir. Bu adım tamamlanmadan hurda devri resmi olarak sonuçlandırılamaz; teklif aşamasında bu konuda da bilgilendirilirsiniz." },
      { type: "h2", text: "Çekme Belgeli Araçlarda Fiyat Değişir mi?" },
      { type: "p", text: "Trafikten çekilmiş, çekme belgeli bir aracın hurda değeri de aynı kriterlerle belirlenir; belgenin kendisi fiyatı doğrudan değiştirmez, önemli olan aracın fiziki durumu ve kullanılabilir parça değeridir. Çekme belgesinin düzenlenme nedeni (hasar mı, arıza mı, kayıt sorunu mu) değerlendirme sırasında sorulan bir bilgidir." },
      { type: "note", text: "Hurda araç değerlendirmesi ve süreç hakkında daha fazla bilgi için [hurda araç alan](/hurda-arac-alan) sayfamıza göz atabilirsiniz." },
      { type: "p", text: "Fiyat teklifini kabul etmeden önce, rakamın neyi kapsadığını sorun: çekici masrafı dahil mi, ödeme devirle aynı anda mı yapılıyor? Şeffaf bir alıcı bu sorulara net cevap verir ve devirden önce sizden herhangi bir ücret talep etmez." },
      { type: "p", text: "Birden fazla yerden teklif almak mantıklıdır, ancak aşırı düşük veya aşırı yüksek görünen tekliflere de temkinli yaklaşın; gerçekçi bir teklif, aracın markası, model yılı ve fiziki durumuyla tutarlı bir aralıkta olur." },
      { type: "p", text: "Kısacası: hurdacının bir arabayı kaça alacağını önceden, aracı görmeden kesin olarak söylemek mümkün değildir, ama aracınızın markasını, model yılını ve fiziki durumunu paylaştığınızda size özel, gerçekçi bir rakamla karşılaşırsınız." },
    ],
    faqs: [
      { q: "Hurda araç fiyatı kilogram üzerinden mi hesaplanır?", a: "Ağırlık bir etkendir ama tek etken değildir; kullanılabilir parça durumu ve marka/model de fiyatı doğrudan etkiler." },
      { q: "Eksik parçalı bir aracın hurda değeri düşer mi?", a: "Evet. Eksik veya sökülmüş parçalar, aracın toplam kullanılabilir değerini azaltır; bu durumu başvuru sırasında belirtmeniz değerlendirmeyi netleştirir." },
    ],
    sample: false,
  },

  {
    slug: "pert-araclarin-satisi-yasaklandi-mi",
    title: "Pert Araçların Satışı Yasaklandı Mı?",
    excerpt:
      "Hayır, pert araçların satışı yasak değildir. Sigorta kaydı ve mülkiyet netleştikten sonra pert bir aracı satmak tamamen mümkündür.",
    metaDescription:
      "Pert araçların satışı yasaklandı mı? Hayır — sigorta kaydı ve mülkiyet netleştikten sonra pert aracınızı satmanız yasal olarak mümkündür.",
    metaKeywords:
      "pert araçların satışı yasaklandı mı, pert araç satışı yasak mı, pert araç satılır mı, pert araç alan",
    category: "Pert ve Ağır Hasar",
    date: "2026-09-14",
    readingMinutes: 3,
    image: "/images/blog/pert-arac-hizli-teklif-infografik.webp",
    imageAlt: "Pert kayıtlı aracın satış ve teklif sürecini gösteren infografik",
    body: [
      { type: "p", text: "Hayır, pert araçların satışı yasaklanmadı. Sigorta şirketi tarafından resmi olarak pert kaydı düşülmüş bir aracı, mülkiyet netleştikten sonra satmak tamamen yasal ve mümkündür. Bu konudaki karışıklık genellikle pert kaydının aracı \"satılamaz\" hâle getirdiği yanılgısından kaynaklanır." },
      { type: "h2", text: "Bu Yanılgı Nereden Geliyor?" },
      { type: "p", text: "Pert kelimesi, onarım maliyetinin aracın değerine yaklaştığı veya onu aştığı durumlarda kullanılır; bu bir yasak değil, sigortanın ekonomik bir değerlendirmesidir. Araç fiziken hâlâ mevcuttur, ruhsatı vardır ve mülkiyeti size aittir — dolayısıyla satma hakkınız devam eder." },
      { type: "p", text: "Karışıklık genellikle \"pert\" ile \"trafiğe çıkamaz\" kavramlarının birbirine karıştırılmasından kaynaklanır. Pert, sigortanın araç hakkında verdiği ekonomik bir karardır; aracın trafiğe çıkıp çıkamayacağı ayrı bir konudur ve yalnızca aracın fiziken sürülebilir olup olmadığına bağlıdır. Sürülemeyen bir araç çekme belgesiyle satılır, sürülebilen pert bir araç ise normal şekilde devredilir." },
      { type: "p", text: "Böyle bir yasağı öngören resmi bir düzenleme bulunmuyor. Konuyla ilgili güncel ve doğru bilgi için, herhangi bir mevzuat değişikliği iddiasında resmi kurumların duyurularına bakmak her zaman en sağlıklı yoldur." },
      { type: "h2", text: "Pert Kaydı ile Hasar Kaydı Aynı Şey mi?" },
      { type: "p", text: "Hayır. Hasar kaydı, sigortadan ödeme yapılmış her olayı kapsayan geniş bir kategoridir ve küçük bir cam veya far hasarı bile bu kayda girebilir. Pert ise çok daha kritik, ayrı bir sınıflandırmadır ve yalnızca onarım maliyeti aracın değerine yaklaştığında veya kritik bölgelerde hasar oluştuğunda uygulanır. Bir aracın hasar kaydı olması, o aracın pert olduğu anlamına gelmez." },
      { type: "p", text: "Bu ayrımı bilmek, aracınızın gerçek durumunu doğru aktarmanız açısından önemlidir: yalnızca hasar kaydı olan bir araç ile resmi pert kaydı bulunan bir araç, değerlendirme sürecinde farklı ele alınır ve farklı bir bant aralığında teklif alır." },
      { type: "p", text: "Aracınızın hangi kategoriye girdiğinden emin değilseniz, elinizdeki bilgi ve belgeleri (varsa sigorta yazışmaları, ekspertiz raporu) paylaşmanız yeterlidir; hangi durumda olduğunuz değerlendirme sırasında netleştirilir." },
      { type: "h2", text: "Satmadan Önce Hangi İki Şey Netleşmeli?" },
      { type: "ul", items: [
        "Sigorta şirketinin resmi pert kararının kesinleşmiş olması",
        "Araç mülkiyetinin net olması (rehin, haciz veya ortak sahiplik gibi durumların çözülmüş olması)",
      ] },
      { type: "p", text: "Bu iki koşul sağlandığında satış önünde hiçbir engel kalmaz. Süreç, sigorta tarafıyla uyumlu şekilde ilerlediği için biraz daha fazla belge gerektirebilir, ama yasal bir kısıtlama söz konusu değildir." },
      { type: "h2", text: "Ağır Hasarlı (Pert) ile Hurda Belgeli Arasındaki Fark" },
      { type: "p", text: "Pert araçlar, hurda belgeli araçlarla sık karıştırılır ama ikisi farklı kategorilerdir:" },
      { type: "ul", items: [
        "Ağır Hasarlı (Pert): Onarımı teknik olarak mümkün olan, ancak maliyeti aracın değerine yaklaşan ya da tavan/şasi/hava yastığı gibi kritik noktalarında hasar bulunan araçlar.",
        "Hurda Belgeli: Onarımı teknik olarak mümkün olmayan, yalnızca parça veya hurda değeri taşıyan araçlar.",
      ] },
      { type: "p", text: "İki kategori de satılabilir; yalnızca süreç ve düzenlenecek belge farklıdır." },
      { type: "h2", text: "Peki Hangi Araçlar Gerçekten Satılamaz?" },
      { type: "p", text: "Pert kaydı satışı engellemez, ama bazı durumlar gerçekten satışı durdurur: araç üzerinde çözülmemiş bir haciz veya rehin şerhi varsa, mülkiyet birden fazla kişi arasında anlaşmazlıksa ya da sigortanın pert kararı henüz kesinleşmediyse devir tamamlanamaz. Bunlar pert kaydından kaynaklanan değil, herhangi bir araç satışında geçerli olan genel kısıtlamalardır." },
      { type: "h2", text: "Pert Aracınızı Nasıl Satarsınız?" },
      { type: "ol", items: [
        "Araç bilgisi ve fotoğrafların paylaşılması",
        "Sigorta pert kararı ve mülkiyet durumunun netleştirilmesi",
        "Nihai teklifin verilmesi",
        "Noter devri ve ödemenin eş zamanlı tamamlanması",
      ] },
      { type: "note", text: "Pert araçlar, tanımlar ve satış süreci hakkında daha fazla bilgi için [pert araç alan](/pert-arac-alan) sayfamıza göz atabilirsiniz." },
      { type: "h2", text: "Sigorta Pert Kararı Ne Kadar Sürer?" },
      { type: "p", text: "Süre, sigorta şirketinin eksper değerlendirmesine ve dosyanın kapsamına göre değişir; kesin bir gün sayısı verilemez. Karar netleşmeden de ön değerlendirme yapılabilir, ancak nihai teklif ve devir, sigortanın resmi kararı çıktıktan sonra planlanır. Bu bekleme süresi, satışın yasaklandığı anlamına gelmez — yalnızca sürecin doğal bir adımıdır." },
      { type: "p", text: "Bu süreyi beklerken aracınızı olduğu yerde bekletmek zorunda değilsiniz; ön değerlendirme ve fotoğraf paylaşımı sigorta kararından bağımsız olarak başlatılabilir, böylece karar çıktığında devir adımına doğrudan geçilir." },
      { type: "p", text: "Sürecin her adımında hangi belgenin ne zaman gerektiği size önceden açıklanır; sürpriz bir şart veya ek ücretle karşılaşmazsınız. Aracınızın pert kaydı ve mevcut durumu hakkında elinizdeki bilgiyi paylaşmanız, sürecin baştan sağlıklı ilerlemesini sağlar." },
      { type: "p", text: "Özetle: pert kaydı bir yasak değil, bir sınıflandırmadır. Sigorta kararı ve mülkiyet netleştikten sonra pert aracınızı istediğiniz zaman, olduğu gibi satabilirsiniz." },
    ],
    faqs: [
      { q: "Pert araç sigortasız satılabilir mi?", a: "Zorunlu trafik sigortası, devir için geçerli olmalıdır; pert kaydı bu şartı ortadan kaldırmaz." },
      { q: "Pert aracı satmak için avukat gerekir mi?", a: "Hayır. Standart bir araç satışında olduğu gibi süreç noterde tamamlanır; ekstra bir hukuki işlem gerekmez." },
    ],
    sample: false,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
