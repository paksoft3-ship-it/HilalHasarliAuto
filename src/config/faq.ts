export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  id: string;
  label: string;
  items: FaqItem[];
}

/** Full categorized FAQ for the /sss page. */
export const faqCategories: FaqCategory[] = [
  {
    id: "teklif-degerlendirme",
    label: "Teklif ve Değerlendirme",
    items: [
      { q: "Hasarlı araç için teklif almak ücretli mi?", a: "Hayır. Araç bilgilerinizi ve fotoğraflarınızı paylaşarak değerlendirme talebi oluşturmak ücretsizdir." },
      { q: "İlk teklif kesin midir?", a: "İlk değerlendirme paylaştığınız bilgilere dayanır ve bağlayıcı değildir. Nihai teklif, araç ve belgelerin kontrolü sonrası netleşir." },
      { q: "Teklifi kabul etmek zorunda mıyım?", a: "Hayır. Teklif almak sizi bağlamaz; kararı tamamen siz verirsiniz." },
      { q: "Ekspertiz raporu olmadan başvuru yapabilir miyim?", a: "Evet. Ekspertiz raporu zorunlu değildir; varsa süreci hızlandırır." },
    ],
  },
  {
    id: "arac-turleri",
    label: "Araç Türleri",
    items: [
      { q: "Hangi tür araçları satın alıyorsunuz?", a: "Hasarlı, kazalı, pert, ağır hasarlı, motor/mekanik arızalı, çalışmayan, yanmış, sel hasarlı, hurda ve çekme belgeli araçları değerlendiriyoruz." },
      { q: "Aracım çalışmıyorsa değerlendirilebilir mi?", a: "Evet. Çalışmayan veya marş almayan araçlar için de değerlendirme talebi oluşturabilirsiniz." },
      { q: "Çekme belgeli araçları alıyor musunuz?", a: "Evet. Çekme belgeli ve trafikten çekilmiş araçlar değerlendirilir." },
    ],
  },
  {
    id: "fotograf-belge",
    label: "Fotoğraf ve Belge",
    items: [
      { q: "Fotoğraflar nasıl gönderilir?", a: "Teklif formundaki yükleme alanından veya WhatsApp üzerinden aracınızın güncel fotoğraflarını paylaşabilirsiniz." },
      { q: "Hangi belgeler gereklidir?", a: "Genellikle araç ruhsatı yeterlidir; devir aşamasında kimlik bilgisi gerekir. Varsa çekme belgesi ve servis kayıtları faydalıdır." },
    ],
  },
  {
    id: "noter-odeme",
    label: "Noter ve Ödeme",
    items: [
      { q: "Noter ve ödeme hangi sırayla ilerler?", a: "Anlaşma sağlandığında noter devri ve ödeme adımları açık şekilde planlanır ve güvenli biçimde tamamlanır." },
      { q: "Ödeme nasıl yapılır?", a: "Ödeme yöntemi ve zamanlaması devir süreciyle birlikte netleştirilir. Süreç şeffaf biçimde planlanır." },
    ],
  },
  {
    id: "teslim-cekici",
    label: "Teslim ve Çekici",
    items: [
      { q: "Aracı bulunduğum yerden alıyor musunuz?", a: "Konum ve araç durumuna göre teslim veya taşıma seçenekleri planlanır ve sizinle netleştirilir." },
      { q: "Şehir dışındaki araç nasıl değerlendirilir?", a: "Türkiye geneli başvuru kabul edilir; konuma göre süreç planlanır." },
    ],
  },
  {
    id: "gizlilik",
    label: "Gizlilik ve İletişim",
    items: [
      { q: "Bilgilerim nasıl kullanılır?", a: "Bilgileriniz yalnızca aracınızın değerlendirilmesi ve sizinle iletişim kurulması amacıyla işlenir. Ayrıntılar KVKK Aydınlatma Metni'nde yer alır." },
      { q: "Hangi kanaldan iletişime geçmeliyim?", a: "Güvenliğiniz için yalnızca resmi telefon, WhatsApp ve e-posta kanallarımızı kullanmanızı öneririz." },
    ],
  },
];

/** Homepage FAQ (design.md §19.8). Calm, non-committal, accurate copy. */
export const homepageFaqs: FaqItem[] = [
  {
    q: "Hangi tür araçları satın alıyorsunuz?",
    a: "Hasarlı, kazalı, pert, ağır hasarlı, motor veya mekanik arızalı, çalışmayan, yanmış, sel hasarlı, hurda ve çekme belgeli araçları değerlendiriyoruz. Aracınızın durumu listede yoksa da bizimle iletişime geçebilirsiniz.",
  },
  {
    q: "Aracım çalışmıyorsa yine de teklif alabilir miyim?",
    a: "Evet. Çalışmayan veya marş almayan araçlar için de değerlendirme talebi oluşturabilirsiniz. Aracın bulunduğu konuma ve durumuna göre süreç birlikte planlanır.",
  },
  {
    q: "Değerlendirme talebi oluşturmak ücretli mi?",
    a: "Hayır. Araç bilgilerinizi ve fotoğraflarınızı paylaşarak değerlendirme talebi oluşturmak ücretsizdir. Teklifi kabul edip etmemek tamamen size bağlıdır.",
  },
  {
    q: "Aracı bulunduğum yerden alıyor musunuz?",
    a: "Konum ve araç durumuna göre teslim veya taşıma seçenekleri planlanır. Sürecin nasıl ilerleyeceği değerlendirme sırasında sizinle netleştirilir.",
  },
  {
    q: "İlk teklif kesin midir?",
    a: "Paylaştığınız bilgilere göre bir ilk değerlendirme yapılır. Nihai teklif, aracın ve belgelerin kontrolünün ardından netleşir.",
  },
  {
    q: "Noter ve ödeme işlemleri nasıl yürür?",
    a: "Anlaşma sağlandığında noter devri ve ödeme adımları açık şekilde planlanır ve güvenli biçimde tamamlanır. Süreç adım adım sizinle paylaşılır.",
  },
  {
    q: "Çekme belgeli araçları alıyor musunuz?",
    a: "Evet. Çekme belgeli ve trafikten çekilmiş araçlar için de değerlendirme talebi oluşturabilirsiniz.",
  },
  {
    q: "Fotoğraf göndererek teklif alabilir miyim?",
    a: "Evet. Aracınızın güncel fotoğraflarını WhatsApp üzerinden veya teklif formundaki yükleme alanından paylaşarak değerlendirme sürecini hızlandırabilirsiniz.",
  },
];
