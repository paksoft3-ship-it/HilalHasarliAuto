import type { FaqItem } from "./faq";

/**
 * Long-form, UNIQUE content per service page. The master prompt forbids
 * duplicate/thin copy across service pages, so each service has its own
 * definition, conditions, who-it-suits and FAQ. Shared, genuinely-common
 * sections (what data is evaluated, required photos, useful documents) use
 * parameterized defaults to avoid keyword-stuffed duplication.
 *
 * This is seed content; the CMS owns it later.
 */
export interface ServiceContent {
  /** Value proposition shown under the H1. */
  heroLead: string;
  /** 1–2 paragraphs: what this vehicle category means. */
  definition: string[];
  /** Who the service suits. */
  whoFor: string[];
  /** Typical vehicle conditions for this category. */
  conditions: string[];
  /**
   * What's specifically checked for THIS damage type, beyond the universal
   * DEFAULT_EVALUATED baseline (master prompt Phase 4: "what is assessed").
   */
  assessedSpecific: string[];
  /**
   * Honest, non-formulaic explanation of what drives the price for this
   * damage type (master prompt Phase 4: "what drives the price" — new
   * section, no prior equivalent existed).
   */
  priceDrivers: string;
  /**
   * Documents needed beyond the universal DEFAULT_DOCUMENTS baseline
   * (master prompt Phase 4: "what documents are needed").
   */
  documentsSpecific: string[];
  /** Service-specific FAQ. */
  faqs: FaqItem[];
  /** Related service slugs. */
  related: string[];
}

export const DEFAULT_EVALUATED = [
  "Marka, model ve model yılı",
  "Kilometre ve genel kullanım durumu",
  "Hasar veya arızanın türü ve kapsamı",
  "Aracın çalışır durumda olup olmadığı",
  "Ruhsat ve belge durumu",
  "Eksik veya değişmiş parçalar",
  "Aracın bulunduğu il ve ilçe",
];

export const DEFAULT_PHOTOS = [
  "Aracın ön, arka ve her iki yan görünümü",
  "Hasarlı veya arızalı bölgelerin yakın çekimi",
  "Motor bölmesi",
  "İç mekân ve gösterge paneli (kilometre görünecek şekilde)",
  "Şase numarası ve ruhsat bilgileri",
];

export const DEFAULT_DOCUMENTS = [
  "Araç ruhsatı",
  "Kimlik bilgisi (yalnızca devir aşamasında)",
  "Varsa ekspertiz veya servis kayıtları",
  "Varsa çekme belgesi veya hasar kaydı belgesi",
];

const RELATED_FALLBACK = [
  "hasarli-arac-alimi",
  "kazali-arac-alimi",
  "pert-arac-alimi",
];

export const serviceContent: Record<string, ServiceContent> = {
  "hasarli-arac-alimi": {
    heroLead:
      "Küçük çaplı hasarlardan ağır hasara kadar her durumdaki aracınız için değerlendirme talebi oluşturun.",
    definition: [
      "Hasarlı araç; kaza, darbe, doğal etken veya kullanım sonucu gövdesinde, mekanik aksamında ya da iç donanımında zarar oluşmuş araçları kapsar. Hasarın boyutu küçük çizik ve ezikten, gövdesel deformasyona kadar değişebilir.",
      "Aracınızın hasar seviyesi ne olursa olsun, paylaştığınız bilgi ve fotoğraflara göre gerçekçi bir değerlendirme yapılır. Onarımı ekonomik olmayan araçlar için de süreç birlikte planlanır.",
    ],
    whoFor: [
      "Onarım maliyeti aracın değerine yaklaşan araç sahipleri",
      "Hasarlı aracını uğraşmadan satmak isteyenler",
      "Sigorta sürecini beklemeden değerlendirme isteyenler",
      "Hasar kaydı bulunan aracını satmak isteyenler",
    ],
    conditions: [
      "Çarpma veya darbe sonucu gövde hasarı",
      "Boya, kaput, çamurluk veya tampon hasarı",
      "Cam, far veya stop hasarı",
      "Onarımı ekonomik görünmeyen araçlar",
      "Hasar kayıtlı araçlar",
    ],
    assessedSpecific: [
      "Hasarın gövdede mi yoksa şase / taşıyıcı yapıda mı olduğu",
      "Güvenlik donanımlarının (hava yastığı, ABS, fren sistemi) hasardan etkilenip etkilenmediği",
      "Varsa önceki onarımların kalitesi",
    ],
    priceDrivers:
      "Fiyatı en çok hasarın kapsamı ve onarım maliyeti belirler; aynı hasar seviyesindeki iki araç bile marka, model yılı ve genel bakım durumuna göre farklı teklif alabilir. Sabit bir yüzde veya formül kullanılmaz, her araç kendi durumuna göre değerlendirilir.",
    documentsSpecific: [],
    faqs: [
      {
        q: "Az hasarlı aracımı da değerlendiriyor musunuz?",
        a: "Evet. Küçük çaplı hasarlar dâhil her seviyedeki araç için değerlendirme talebi oluşturabilirsiniz.",
      },
      {
        q: "Hasar kaydı olan araç değer kaybeder mi?",
        a: "Hasar kaydı değerlemeyi etkileyebilir; ancak nihai değerlendirme aracın bütününe göre yapılır. Şeffaf şekilde açıklanır.",
      },
    ],
    related: ["kazali-arac-alimi", "agir-hasarli-arac-alimi", "pert-arac-alimi"],
  },

  "kazali-arac-alimi": {
    heroLead:
      "Trafik kazası geçirmiş aracınız için hızlı ve şeffaf bir değerlendirme alın.",
    definition: [
      "Kazalı araç; trafik kazası sonucu ön, arka, yan veya çoklu bölgede hasar almış araçları ifade eder. Hava yastığının açıldığı, şaside deformasyon oluşan veya sürüş güvenliği etkilenen araçlar bu kapsamdadır.",
      "Kazalı aracınızın onarımı yerine satmayı tercih ediyorsanız, mevcut durumuna göre değerlendirme yapılır ve devir süreci güvenle yürütülür.",
    ],
    whoFor: [
      "Kaza sonrası onarımla uğraşmak istemeyenler",
      "Hava yastığı açılmış araç sahipleri",
      "Sürüş güvenliği etkilenmiş araçlar",
      "Sigortayla anlaşamayan araç sahipleri",
    ],
    conditions: [
      "Ön veya arka çarpışma hasarı",
      "Yan darbe ve kapı hasarı",
      "Hava yastığı açılmış araçlar",
      "Şase / karoser deformasyonu",
      "Çoklu bölge hasarı",
    ],
    assessedSpecific: [
      "Hava yastığının açılıp açılmadığı",
      "Kaza kaydının TRAMER sistemine yansıyıp yansımadığı",
      "Şase ölçüm/hizalama durumu (varsa ekspertiz raporu)",
    ],
    priceDrivers:
      "Kazalı araçlarda fiyatı, hasarın bölgesi (ön/arka/yan), hava yastığının açılıp açılmadığı ve şase hizalamasının bozulup bozulmadığı belirler. Kaza kaydının TRAMER'de görünmesi tek başına fiyatı değil, aracın genel durumuyla birlikte değerlendirilir.",
    documentsSpecific: ["Varsa kaza tespit tutanağı"],
    faqs: [
      {
        q: "Hava yastığı açılan aracı alıyor musunuz?",
        a: "Evet. Hava yastığı açılmış araçlar da değerlendirilir; durum fotoğraflarla netleştirildiğinde süreç hızlanır.",
      },
      {
        q: "Kazalı aracım çalışmıyorsa ne olur?",
        a: "Çalışmayan kazalı araçlar için de değerlendirme yapılır; teslim veya taşıma seçenekleri planlanır.",
      },
    ],
    related: ["hasarli-arac-alimi", "agir-hasarli-arac-alimi", "pert-arac-alimi"],
  },

  "pert-arac-alimi": {
    heroLead:
      "Pert kayıtlı veya pert olması muhtemel araçlarınız için değerlendirme talebi oluşturun.",
    definition: [
      "Pert araç; onarım maliyetinin aracın değerine yakın veya üzerinde olması nedeniyle ekonomik onarımı uygun görülmeyen araçtır. Sigorta tarafından pert (tam hasar) kaydı oluşturulmuş araçlar bu kapsamdadır.",
      "Pert kayıtlı aracınızı satarken belge durumunun doğru ele alınması önemlidir. Süreç, kayıt durumuna göre şeffaf biçimde planlanır.",
    ],
    whoFor: [
      "Sigortaca pert işlemi yapılmış araç sahipleri",
      "Onarımı ekonomik olmayan araç sahipleri",
      "Pert belgeli aracını satmak isteyenler",
      "Hurdaya ayırmak yerine değerlendirmek isteyenler",
    ],
    conditions: [
      "Sigorta pert (tam hasar) kaydı bulunan araçlar",
      "Onarım maliyeti yüksek araçlar",
      "Ağır gövde ve mekanik hasar",
      "Pert belgeli araçlar",
      "Sular altında kalmış veya yanmış pert araçlar",
    ],
    assessedSpecific: [
      "Sigorta pert kararının kapsamı ve tarihi",
      "Araç mülkiyetinin netleşmiş olup olmadığı",
      "Sovtaj bedeli düşülerek ödeme yapılıp yapılmadığı",
    ],
    priceDrivers:
      "Pert araçlarda fiyatı, sigorta pert kaydındaki hasar kapsamı ve aracın kullanılabilir parça/mekanik değeri belirler. Sovtaj bedeli düşülerek sigortadan ödeme almış araçlar da bu kapsamda değerlendirilir.",
    documentsSpecific: ["Sigorta pert tutanağı veya eksper raporu (varsa)"],
    faqs: [
      {
        q: "Pert belgeli aracın devri nasıl yapılır?",
        a: "Pert kayıt durumuna göre devir adımları değişebilir. Doğru ve resmi sürecin nasıl ilerleyeceği değerlendirme sırasında açıklanır.",
      },
      {
        q: "Pert aracın değeri nasıl belirlenir?",
        a: "Aracın markası, modeli, hasar kapsamı ve kullanılabilir parçaları dikkate alınarak gerçekçi bir değerlendirme yapılır.",
      },
    ],
    related: ["agir-hasarli-arac-alimi", "kazali-arac-alimi", "hurda-arac-alimi"],
  },

  "agir-hasarli-arac-alimi": {
    heroLead:
      "Ağır hasarlı aracınızı bulunduğu yerden değerlendiriyoruz.",
    definition: [
      "Ağır hasarlı araç; gövdesinde, şasisinde veya ana mekanik aksamında ciddi düzeyde zarar oluşmuş, çoğu zaman sürülemeyecek durumdaki araçtır. Bu araçların onarımı genellikle ekonomik değildir.",
      "Aracınız çekiciyle taşınması gereken durumda olsa bile değerlendirme talebi oluşturabilirsiniz; taşıma ve teslim seçenekleri konuma göre planlanır.",
    ],
    whoFor: [
      "Sürülemeyecek durumda ağır hasarlı araç sahipleri",
      "Şase / karoser hasarı olan araçlar",
      "Çoklu ve yaygın hasarlı araçlar",
      "Taşıma gerektiren araç sahipleri",
    ],
    conditions: [
      "Yaygın gövde ve şase hasarı",
      "Sürülemeyen, hareket etmeyen araçlar",
      "Büyük çaplı çarpışma hasarı",
      "Ana mekanik aksamı zarar görmüş araçlar",
      "Parça bütünlüğü bozulmuş araçlar",
    ],
    assessedSpecific: [
      "Şase veya karoser deformasyon derecesi",
      "Aracın sürülebilir olup olmadığı",
      "Taşıma / çekici ihtiyacı",
    ],
    priceDrivers:
      "Ağır hasarlı araçlarda fiyatı, hasarın şase veya ana taşıyıcı yapıya ulaşıp ulaşmadığı ve aracın sürülüp sürülemediği belirler. Taşıma gerektiren araçlarda çekici planlaması değerlendirmeye dahil edilir; olası ek maliyet varsa süreç öncesinde açıkça belirtilir.",
    documentsSpecific: [],
    faqs: [
      {
        q: "Sürülemeyen aracı nasıl teslim ederim?",
        a: "Sürülemeyen araçlar için taşıma seçenekleri konuma göre planlanır ve değerlendirme sırasında sizinle netleştirilir.",
      },
    ],
    related: ["pert-arac-alimi", "kazali-arac-alimi", "calismayan-arac-alimi"],
  },

  "motor-arizali-arac-alimi": {
    heroLead:
      "Motor arızası bulunan aracınız için süreç planlaması yapın.",
    definition: [
      "Motor arızalı araç; motor bloğu, silindir kapağı, turbo, enjeksiyon veya yağlama sistemi gibi ana motor bileşenlerinde sorun bulunan araçtır. Onarım maliyeti yüksek olabileceğinden satmak daha avantajlı olabilir.",
      "Aracınızın motor arızası nedeniyle değer kaybetmesini önlemek için mevcut durumuna göre gerçekçi bir değerlendirme yapılır.",
    ],
    whoFor: [
      "Motoru çalışmayan veya tutuk çalışan araç sahipleri",
      "Yüksek motor onarım maliyetiyle karşılaşanlar",
      "Motoru hasar görmüş araç sahipleri",
      "Onarım yerine satışı tercih edenler",
    ],
    conditions: [
      "Çalışmayan veya zor çalışan motor",
      "Aşırı ısınma veya yağ kaçağı sorunu",
      "Turbo, enjeksiyon veya yağlama arızası",
      "Motor sesi veya performans kaybı",
      "Motor revizyonu gereken araçlar",
    ],
    assessedSpecific: [
      "Arızanın motor bloğunda mı yoksa yardımcı sistemlerde (turbo, enjeksiyon, yağlama) mi olduğu",
      "Aşırı ısınma veya yağ kaçağı gibi ikincil belirtilerin bulunup bulunmadığı",
      "Motorun tamamen çalışmaz mı yoksa tutuk mu çalıştığı",
    ],
    priceDrivers:
      "Motor arızalı araçlarda fiyatı, arızanın kapsamı (parça değişimi mi, motor revizyonu mu gerektirdiği) ve aracın diğer bölümlerinin durumu birlikte belirler. Motor dışı donanımı sağlam araçlar, arızanın büyüklüğüne rağmen daha iyi değerlendirilebilir.",
    documentsSpecific: ["Varsa servis / motor bakım kayıtları"],
    faqs: [
      {
        q: "Motoru hiç çalışmayan aracı değerlendiriyor musunuz?",
        a: "Evet. Motoru çalışmayan araçlar için de değerlendirme talebi oluşturabilirsiniz.",
      },
    ],
    related: ["mekanik-arizali-arac-alimi", "calismayan-arac-alimi", "hasarli-arac-alimi"],
  },

  "mekanik-arizali-arac-alimi": {
    heroLead:
      "Mekanik arızalı, ekonomik onarımı zor araçlar için değerlendirme alın.",
    definition: [
      "Mekanik arızalı araç; şanzıman, debriyaj, aktarma organları, fren, direksiyon veya elektronik sistemlerinde arıza bulunan araçtır. Birden fazla mekanik sorun bir arada bulunabilir.",
      "Onarımı ekonomik olmayan mekanik arızalar nedeniyle aracınızı satmayı düşünüyorsanız, mevcut durumuna göre değerlendirme yapılır.",
    ],
    whoFor: [
      "Şanzıman veya aktarma arızası olan araç sahipleri",
      "Çoklu mekanik arızası bulunan araçlar",
      "Onarım maliyeti yüksek araç sahipleri",
      "Elektronik / mekanik sorunları biriken araçlar",
    ],
    conditions: [
      "Şanzıman veya debriyaj arızası",
      "Aktarma organlarında sorun",
      "Fren veya direksiyon sistemi arızası",
      "Elektronik sistem arızaları",
      "Çoklu mekanik sorun",
    ],
    assessedSpecific: [
      "Arızanın şanzıman, debriyaj veya aktarma organlarından hangisinde olduğu",
      "Birden fazla mekanik arızanın bir arada bulunup bulunmadığı",
      "Elektronik sistemlerin arızadan etkilenip etkilenmediği",
    ],
    priceDrivers:
      "Mekanik arızalı araçlarda fiyatı, arızanın kapsamı ve kaç farklı sistemi etkilediği belirler. Tek bir mekanik arıza ile çoklu arıza durumu farklı değerlendirilir; hangi sistemlerin etkilendiği başvuru sırasında netleştirilir.",
    documentsSpecific: [],
    faqs: [
      {
        q: "Birden fazla arızası olan aracı alıyor musunuz?",
        a: "Evet. Çoklu mekanik arızası olan araçlar da değerlendirilir; durum fotoğraf ve açıklamayla netleştirilir.",
      },
    ],
    related: ["motor-arizali-arac-alimi", "calismayan-arac-alimi", "hasarli-arac-alimi"],
  },

  "calismayan-arac-alimi": {
    heroLead:
      "Çalışmayan veya marş almayan aracınız için teklif talebi oluşturun.",
    definition: [
      "Çalışmayan araç; motoru çalışmayan, marş almayan veya uzun süredir kullanılmadığı için hareket etmeyen araçtır. Arızanın kaynağı motor, elektrik veya mekanik kaynaklı olabilir.",
      "Aracınızın neden çalışmadığını bilmeseniz dahi değerlendirme talebi oluşturabilirsiniz; gerekli durumlarda taşıma seçenekleri planlanır.",
    ],
    whoFor: [
      "Marş almayan araç sahipleri",
      "Uzun süredir çalışmayan / bekleyen araçlar",
      "Hareket etmeyen araç sahipleri",
      "Arıza kaynağı belirsiz araçlar",
    ],
    conditions: [
      "Marş almayan araçlar",
      "Uzun süre kullanılmadığı için çalışmayan araçlar",
      "Akü / elektrik kaynaklı çalışmama",
      "Motor kaynaklı çalışmama",
      "Hareket etmeyen araçlar",
    ],
    assessedSpecific: [
      "Arızanın elektriksel mi (akü, marş motoru) yoksa mekanik mi (yakıt sistemi, motor) olduğu",
      "Aracın ne kadar süredir hareketsiz beklediği",
      "Uzun bekleme nedeniyle oluşmuş ikincil sorunlar (lastik, akü, yakıt bozulması)",
    ],
    priceDrivers:
      "Çalışmayan araçlarda fiyatı, arızanın kaynağı ve aracın ne kadar süredir beklediği belirler. Kısa süreli akü kaynaklı arızalar ile uzun süre atıl bekleyip ikincil sorunlar biriktiren araçlar farklı değerlendirilir.",
    documentsSpecific: [],
    faqs: [
      {
        q: "Aracımın neden çalışmadığını bilmiyorum, sorun olur mu?",
        a: "Hayır. Arıza kaynağını bilmeseniz de değerlendirme talebi oluşturabilirsiniz.",
      },
    ],
    related: ["motor-arizali-arac-alimi", "mekanik-arizali-arac-alimi", "agir-hasarli-arac-alimi"],
  },

  "yanmis-arac-alimi": {
    heroLead:
      "Yangın hasarı görmüş aracınız için değerlendirme talebi oluşturun.",
    definition: [
      "Yanmış araç; kısmi veya tam yangın sonucu gövdesi, iç donanımı veya motoru zarar görmüş araçtır. Yangının boyutuna göre aracın kullanılabilir parçaları değişir.",
      "Yanmış aracınızın belge ve kayıt durumu, değerlendirme ve devir sürecinde önemli rol oynar. Süreç durumunuza göre şeffaf biçimde planlanır.",
    ],
    whoFor: [
      "Kısmi veya tam yanmış araç sahipleri",
      "Yangın sonrası pert işlemi yapılmış araçlar",
      "Motor yangını geçiren araçlar",
      "Yanmış aracını değerlendirmek isteyenler",
    ],
    conditions: [
      "Motor bölmesi yangını",
      "İç mekân / kabin yangını",
      "Kısmi yanmış araçlar",
      "Tam yanmış (kullanılamaz) araçlar",
      "Yangın sonrası pert kayıtlı araçlar",
    ],
    assessedSpecific: [
      "Yangının kaynağı (motor bölmesi, kabin veya dış gövde)",
      "Yangının şase üzerindeki ısı etkisi",
      "Yangının sigorta hasar kaydına yansıyıp yansımadığı",
    ],
    priceDrivers:
      "Yanmış araçlarda fiyatı, yangının kapsamı (kısmi mi tam mı) ve şase üzerindeki ısı etkisi belirler. Kısmi yangın geçirmiş, şasesi etkilenmemiş araçlar ile tamamen yanmış araçlar farklı değerlendirilir.",
    documentsSpecific: ["Varsa itfaiye raporu veya sigorta hasar dosyası"],
    faqs: [
      {
        q: "Tamamen yanmış aracı da değerlendiriyor musunuz?",
        a: "Evet. Tam veya kısmi yanmış araçlar için değerlendirme talebi oluşturabilirsiniz.",
      },
    ],
    related: ["pert-arac-alimi", "hurda-arac-alimi", "agir-hasarli-arac-alimi"],
  },

  "sel-hasarli-arac-alimi": {
    heroLead:
      "Sel ve su hasarı görmüş aracınız için süreç desteği alın.",
    definition: [
      "Sel hasarlı araç; sel, su baskını veya yoğun su teması sonucu motoru, elektroniği veya iç donanımı zarar görmüş araçtır. Su hasarı sonradan ortaya çıkan elektronik ve mekanik sorunlara yol açabilir.",
      "Su hasarının kapsamına göre aracınızın durumu değerlendirilir; nem ve elektronik etkileri dikkate alınarak gerçekçi bir değerlendirme yapılır. Aracı sel sırasında otoparkta veya yolda su basmış, kısacası sel mağduru olmuş araç sahipleri için de aynı süreç geçerlidir.",
    ],
    whoFor: [
      "Sel veya su baskınından etkilenen araç sahipleri",
      "İç mekânı su almış araçlar",
      "Elektroniği su nedeniyle arızalanan araçlar",
      "Su hasarı sonrası pert işlemi yapılmış araçlar",
    ],
    conditions: [
      "İç mekân ve döşeme su hasarı",
      "Elektronik sistem arızaları",
      "Motor / şanzımana su girmesi",
      "Nem ve korozyon oluşmuş araçlar",
      "Su baskını sonrası çalışmayan araçlar",
    ],
    assessedSpecific: [
      "Suyun seviyesi ve motor bloğuna ulaşıp ulaşmadığı",
      "Elektronik modüllerin su hasarından etkilenip etkilenmediği",
      "İç döşemede küf veya korozyon oluşup oluşmadığı",
    ],
    priceDrivers:
      "Sel hasarlı araçlarda fiyatı, suyun ulaştığı seviye ve elektronik sistemlerin etkilenme derecesi belirler. Yalnızca iç mekânı su alan araçlar ile motoruna su giren araçlar farklı değerlendirilir.",
    documentsSpecific: ["Varsa sigorta hasar dosyası veya ekspertiz raporu"],
    faqs: [
      {
        q: "Su hasarı sonradan sorun çıkarır mı?",
        a: "Su hasarı zamanla elektronik ve mekanik sorunlara yol açabilir. Bu nedenle değerlendirme, mevcut ve olası etkiler göz önünde tutularak yapılır.",
      },
      {
        q: "Sel mağduruyum, aracım otoparkta suyun altında kaldı; değerlendiriyor musunuz?",
        a: "Evet. Sel mağduru araç sahipleri için de aynı süreç geçerlidir; suyun ulaştığı seviye ve aracın mevcut durumu paylaştığınız bilgi ve fotoğraflara göre değerlendirilir.",
      },
    ],
    related: ["pert-arac-alimi", "motor-arizali-arac-alimi", "hasarli-arac-alimi"],
  },

  "hurda-arac-alimi": {
    heroLead:
      "Hurda ve ekonomik ömrünü tamamlamış aracınız için değerlendirme talebi oluşturun.",
    definition: [
      "Hurda araç; ekonomik ömrünü tamamlamış, onarımı mümkün veya mantıklı olmayan, çoğunlukla parça ve metal değeri için değerlendirilen araçtır. Hurdaya ayırma ve trafikten çıkış işlemleri belgeli şekilde yürütülür.",
      "Hurda aracınızın belge durumu ve hurda/çekme işlemleri sürecin önemli parçasıdır. Doğru ve resmi adımlar değerlendirme sırasında açıklanır.",
    ],
    whoFor: [
      "Ekonomik ömrünü tamamlamış araç sahipleri",
      "Onarımı mantıklı olmayan araçlar",
      "Uzun süredir atıl bekleyen araçlar",
      "Hurdaya ayırmak isteyen araç sahipleri",
    ],
    conditions: [
      "Çok eski ve yıpranmış araçlar",
      "Onarımı ekonomik olmayan araçlar",
      "Ağır korozyon / paslanma",
      "Parçalanmış veya eksik araçlar",
      "Atıl durumda bekleyen araçlar",
    ],
    assessedSpecific: [
      "Aracın parça ve metal değeri",
      "MTV (Motorlu Taşıtlar Vergisi) borcu ve trafik cezası durumu",
      "Hurda belgesi düzenlenmesi için gereken kayıt durumu",
    ],
    priceDrivers:
      "Hurda araçlarda fiyatı en çok kullanılabilir parça ve metal değeri belirler; marka, model ve ağırlık bu değeri doğrudan etkiler. Hurdaya ayırmadan önce aracın MTV borcunun ve varsa trafik cezalarının kapatılmış olması gerekir.",
    documentsSpecific: ["MTV borcu yok yazısı (hurda işlemi öncesi gerekir)"],
    faqs: [
      {
        q: "Hurda aracın trafikten çıkışı yapılıyor mu?",
        a: "Hurda ve trafikten çıkış işlemlerinin resmi süreci, aracın durumuna ve belgelerine göre değerlendirme sırasında açıklanır.",
      },
      {
        q: "Hurdaya ayırmadan önce ne yapmalıyım?",
        a: "Aracın MTV borcunun ve varsa trafik cezalarının kapatılmış olması gerekir. Bu adım tamamlanmadan hurda devri resmi olarak sonuçlandırılamaz.",
      },
    ],
    related: ["pert-arac-alimi", "cekme-belgeli-arac-alimi", "yanmis-arac-alimi"],
  },

  "cekme-belgeli-arac-alimi": {
    heroLead:
      "Çekme belgeli ve trafikten çekilmiş aracınız için teklif talebi oluşturun.",
    definition: [
      "Çekme belgeli araç; trafikten çekilmiş ve çekme belgesi düzenlenmiş, normal şartlarda trafiğe çıkışı uygun olmayan araçtır. Bu araçlar genellikle ağır hasarlı, arızalı veya kaydı kapatılmış araçlardır.",
      "Çekme belgeli aracın devir ve değerlendirme süreci, belge durumuna göre özel olarak ele alınır ve şeffaf biçimde planlanır.",
    ],
    whoFor: [
      "Çekme belgeli araç sahipleri",
      "Trafikten çekilmiş araçlar",
      "Kaydı kapatılmış araç sahipleri",
      "Çekme belgeli aracını değerlendirmek isteyenler",
    ],
    conditions: [
      "Çekme belgesi düzenlenmiş araçlar",
      "Trafikten çekilmiş araçlar",
      "Ağır hasarlı çekme belgeli araçlar",
      "Uzun süredir kullanılmayan çekme belgeli araçlar",
      "Belge / kayıt durumu özel araçlar",
    ],
    assessedSpecific: [
      "Çekme belgesinin düzenlenme nedeni (hasar mı, arıza mı, kayıt sorunu mu)",
      "Belgenin düzenlenme tarihi ve aracın o günden bu yana bekleme süresi",
      "Aracın bulunduğu yer (otopark, açık alan) ve teslim koşulları",
    ],
    priceDrivers:
      "Çekme belgeli araçlarda fiyatı, belgenin düzenlenme nedeni ve aracın genel durumu belirler. Hasar nedeniyle çekme belgesi düzenlenmiş araçlarla, kayıt/muayene kaynaklı düzenlenmiş araçlar farklı değerlendirilir.",
    documentsSpecific: ["Çekme belgesinin kendisi"],
    faqs: [
      {
        q: "Çekme belgeli aracın devri nasıl yapılır?",
        a: "Çekme belgeli araçlarda devir adımları belge durumuna göre değişir. Doğru ve resmi süreç değerlendirme sırasında açıklanır.",
      },
    ],
    related: ["hurda-arac-alimi", "pert-arac-alimi", "agir-hasarli-arac-alimi"],
  },

  "dolu-hasarli-arac-alimi": {
    heroLead:
      "Dolu yağışı sonucu hasar görmüş aracınız için değerlendirme talebi oluşturun.",
    definition: [
      "Dolu hasarlı araç; büyük taneli dolu yağışı sonucu tavanında, kaputunda, bagajında ve gövde panellerinde çok sayıda küçük göçük oluşmuş araçtır. Hasar geniş bir alana yayılır ancak çoğunlukla yüzeyseldir; şase veya mekanik aksam nadiren etkilenir.",
      "Dolu hasarı, tek bir büyük darbeden çok, gövde yüzeyine yayılmış çok sayıda küçük göçükten oluşur. Onarımı özel işçilik gerektirebileceğinden, satmayı tercih eden araç sahipleri için değerlendirme talebi oluşturuyoruz.",
    ],
    whoFor: [
      "Dolu yağışından gövdesi çok sayıda göçük almış araç sahipleri",
      "Sigorta sürecini beklemeden değerlendirme isteyenler",
      "Onarım yerine satışı tercih edenler",
      "Dolu hasarı sigorta kaydına yansımış araç sahipleri",
    ],
    conditions: [
      "Tavan, kaput ve bagajda yaygın göçükler",
      "Yan panellerde dolu izleri",
      "Cam çatlağı veya kırığı eşlik eden hasar",
      "Boya yüzeyinde çatlama",
    ],
    assessedSpecific: [
      "Göçüklerin sayısı ve gövdeye yayılma genişliği",
      "Cam hasarının eşlik edip etmediği",
      "Boya yüzeyinin çatlayıp çatlamadığı",
    ],
    priceDrivers:
      "Dolu hasarlı araçlarda fiyatı, göçük sayısı ve gövdeye yayılma genişliği belirler; birkaç küçük göçük ile tüm yüzeye yayılmış yoğun hasar farklı değerlendirilir. Mekanik aksam genellikle etkilenmediği için değer kaybı büyük ölçüde kozmetik onarım maliyetine bağlıdır.",
    documentsSpecific: ["Varsa sigorta hasar dosyası (dolu hasarı sigorta kapsamındaysa)"],
    faqs: [
      {
        q: "Dolu hasarı sadece kozmetik mi, yoksa aracın değerini ciddi şekilde etkiler mi?",
        a: "Dolu hasarı çoğunlukla yüzeyseldir ve mekanik aksamı etkilemez, ancak gövdeye yayılmış çok sayıda göçük ikinci el değerini belirgin şekilde düşürebilir. Değerlendirme, göçük sayısı ve yaygınlığına göre yapılır.",
      },
      {
        q: "Dolu hasarlı aracımı sigorta süreci bitmeden satabilir miyim?",
        a: "Evet. Sigorta süreciyle ilgisiz olarak değerlendirme talebi oluşturabilirsiniz; sigorta kaydı varsa süreç buna göre planlanır.",
      },
    ],
    related: ["hasarli-arac-alimi", "kazali-arac-alimi", "agir-hasarli-arac-alimi"],
  },
};

export function getServiceContent(slug: string): ServiceContent {
  return (
    serviceContent[slug] ?? {
      heroLead: "Aracınız için değerlendirme talebi oluşturun.",
      definition: [],
      whoFor: [],
      conditions: [],
      assessedSpecific: [],
      priceDrivers: "",
      documentsSpecific: [],
      faqs: [],
      related: RELATED_FALLBACK,
    }
  );
}
