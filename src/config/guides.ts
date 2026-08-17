import type { Block } from "./blog";

export interface GuideChapter {
  title: string;
  blocks: Block[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: string;
  difficulty: "Kolay" | "Orta" | "İleri";
  lastReviewed: string; // ISO
  image: string;
  imageAlt: string;
  chapters: GuideChapter[];
  sample: boolean;
}

export const guideCategories = [
  "Araç durumuna göre",
  "Satış sürecine göre",
  "Belge ve hazırlık",
  "Konum ve taşıma",
];

export const guides: Guide[] = [
  {
    slug: "hasarli-arac-satisi-bastan-sona",
    title: "Hasarlı Araç Satışı: Başvurudan Teslime Kadar Tüm Süreç",
    description:
      "Hasarlı aracınızı satarken izleyeceğiniz adımları başvurudan teslime kadar anlatan kapsamlı rehber: hazırlık, fotoğraf, değerleme, pazarlık, noter ve ödeme.",
    category: "Satış sürecine göre",
    estimatedTime: "10 dk",
    difficulty: "Kolay",
    lastReviewed: "2026-08-17",
    image: "/images/photos/2.png",
    imageAlt: "Değerlendirme için hazırlanmış hasarlı araç",
    chapters: [
      {
        title: "Süreç genel bakış",
        blocks: [
          { type: "p", text: "Hasarlı araç satışı beş aşamadan oluşur: bilgi ve fotoğrafların hazırlanması, uzaktan ön değerlendirme, aracın yerinde görülmesi, noter devri ve ödeme, son olarak da aracın teslim alınması. Tamamı, aracın bulunduğu yerden ayrılmadan yürütülebilir." },
          { type: "p", text: "Sağlam bir araç satışından en önemli farkı şudur: alıcı kitlesi dardır ve fiyatı belirleyen şey aracın görünümü değil, onarım maliyeti ile kalan parça değeridir. Bu yüzden hasarı gizlemek değil, eksiksiz anlatmak satıcının lehinedir — gizlenen her kusur, araç görüldüğünde teklifin düşmesine yol açar." },
          { type: "table", header: ["Aşama", "Ne kadar sürer?", "Kim yapar?"], rows: [
            ["Bilgi ve fotoğraf hazırlığı", "15–30 dakika", "Siz"],
            ["Ön değerlendirme", "Aynı gün", "Alıcı"],
            ["Yerinde görüş", "1–2 iş günü içinde", "Alıcı ekibi"],
            ["Noter devri ve ödeme", "1 saat", "Birlikte"],
            ["Aracın teslim alınması", "Devirle aynı gün", "Alıcı"],
          ] },
        ],
      },
      {
        title: "Araç bilgilerini hazırlayın",
        blocks: [
          { type: "p", text: "Değerlendirmeyi hızlandıran şey, aracın durumunun dürüst ve eksiksiz aktarılmasıdır. Aşağıdaki bilgileri başvurudan önce netleştirin; hepsi elinizin altındaysa ön teklif çoğu zaman aynı gün gelir." },
          { type: "ul", items: [
            "Marka, model, model yılı ve güncel kilometre",
            "Hasarın nasıl oluştuğu (kaza, yangın, su baskını, mekanik arıza)",
            "Aracın çalışıp çalışmadığı ve yürür durumda olup olmadığı",
            "Ruhsat durumu: kimin üzerine kayıtlı, rehin veya haciz şerhi var mı",
            "Tramer kaydı ve varsa ekspertiz/servis raporları",
            "Değişen, eksik veya sökülmüş parçalar",
          ] },
          { type: "note", text: "Rehinli (kredi ödemesi süren) araçlarda satış mümkündür ancak devirden önce borcun kapatılması ve şerhin kaldırılması gerekir; bu adım devir randevusu planlanırken birlikte çözülür." },
        ],
      },
      {
        title: "Aracı doğru fotoğraflayın",
        blocks: [
          { type: "p", text: "Uzaktan verilen teklifin isabetli olması tamamen fotoğrafların kalitesine bağlıdır. Kötü ışıkta çekilmiş, hasarı gizleyen fotoğraflar teklifin sonradan düşmesine yol açar; net fotoğraf hem sizi hem alıcıyı korur." },
          { type: "ol", items: [
            "Aracın dört köşesinden, tamamı kadraja girecek şekilde genel çekim",
            "Her hasarlı bölgenin yakın plan fotoğrafı (bir adım geriden bir de yakından)",
            "Kaput açık hâlde motor bölmesi",
            "Kilometre görünecek şekilde gösterge paneli",
            "İç mekân: ön ve arka koltuklar, bagaj",
            "Ruhsat ve şase numarasının okunaklı fotoğrafı",
          ] },
          { type: "p", text: "Gün ışığında, gölgesiz bir alanda ve aracı yıkamadan çekin — temizlenmiş bir araç hasarı gizliyor izlenimi verebilir. Araç çalışmıyorsa marş denemesinin kısa bir videosu da değerlendirmeyi hızlandırır." },
        ],
      },
      {
        title: "Ön değerlendirme ve teklif",
        blocks: [
          { type: "p", text: "Fotoğraf ve bilgilere dayanan ilk değerlendirme, aracın büyük olasılıkla hangi bant aralığında değerleneceğini gösterir; bağlayıcı değildir ve sizi hiçbir şekilde yükümlülük altına sokmaz. Kesin teklif ancak araç fiziken görüldükten sonra oluşur." },
          { type: "p", text: "Teklifi değerlendirirken yalnızca rakama değil, rakamın neyi kapsadığına bakın: çekici ücreti kime ait, noter masrafları nasıl paylaşılıyor, ödeme ne zaman ve hangi yöntemle yapılıyor? Sağlıklı bir teklif bu üç soruya baştan yanıt verir." },
          { type: "note", text: "Devirden önce kapora, dosya masrafı veya nakliye avansı isteyen alıcılara karşı dikkatli olun. Ciddi bir alıcı, ödemeyi noter devriyle eş zamanlı yapar ve öncesinde sizden para talep etmez." },
        ],
      },
      {
        title: "Noter devri ve ödeme",
        blocks: [
          { type: "p", text: "Anlaşma sağlandığında devir, noterde yapılır ve araç resmen alıcıya geçer. Randevuya ruhsat sahibinin kimliğiyle gelmesi gerekir; gelemiyorsa noterden düzenlenmiş satış vekâleti şarttır." },
          { type: "ul", items: [
            "Araç tescil belgesi (ruhsat)",
            "Ruhsat sahibinin kimliği veya noter onaylı vekâlet",
            "Varsa ikinci anahtar ve yedek parça belgeleri",
            "Zorunlu trafik sigortası poliçesi",
          ] },
          { type: "p", text: "Ödemenin devir imzasıyla eş zamanlı yapılması esastır: önce imza sonra ödeme ya da önce araç teslimi sonra ödeme gibi düzenler risklidir. Nakit veya banka transferi fark etmez, önemli olan devir tamamlanırken paranın elinize geçmesidir." },
          { type: "note", text: "Devirden sonra trafik sigortasını iptal ettirmeyi ve MTV kaydınızı kontrol etmeyi unutmayın; devir tamamlandığında araçla ilgili yükümlülükleriniz sona erer." },
        ],
      },
      {
        title: "Teslim ve sonrası",
        blocks: [
          { type: "p", text: "Çalışan araçlar genellikle devir günü teslim edilir; çalışmayan veya ağır hasarlı araçlar için çekici organize edilir ve araç bulunduğu adresten alınır. Çekici masrafının alıcıya ait olması standart uygulamadır." },
          { type: "p", text: "Teslimden sonra saklamanız gereken tek şey devir belgesinin bir nüshasıdır. İleride aracın plakasıyla ilgili bir bildirim gelirse — ki devir sonrası trafik cezaları yeni sahibine yazılır — bu belge durumu anında çözer." },
          { type: "note", text: "Bu rehber genel bilgilendirme amaçlıdır; hukuki tavsiye niteliği taşımaz. Aracınıza özel durumlar için bizimle doğrudan görüşebilirsiniz." },
        ],
      },
    ],
    sample: false,
  },
  {
    slug: "arac-fotografi-nasil-cekilir",
    title: "Değerlendirme İçin Araç Fotoğrafı Nasıl Çekilir?",
    description:
      "Hasarlı aracınızın değerini doğru yansıtan fotoğraflar çekmek için pratik kontrol listesi: ışık, açı, çekilecek kareler ve sık yapılan hatalar.",
    category: "Belge ve hazırlık",
    estimatedTime: "5 dk",
    difficulty: "Kolay",
    lastReviewed: "2026-08-17",
    image: "/images/photos/22.png",
    imageAlt: "Hasarlı aracın telefonla fotoğraflanması",
    chapters: [
      {
        title: "Neden fotoğraf bu kadar önemli?",
        blocks: [
          { type: "p", text: "Hasarlı araç alımında ilk teklif neredeyse tamamen fotoğraflara dayanır. İyi çekilmiş bir set, aracın gerçek durumunu yansıtır ve yerinde görüşte teklifin değişmemesini sağlar; eksik veya yanıltıcı fotoğraflar ise sürecin sonunda hayal kırıklığı yaratır." },
          { type: "p", text: "Pratikte fark şudur: net fotoğraf gönderen satıcılar çoğunlukla aynı gün teklif alır ve teklif yerinde görüşte aynı kalır. Karanlıkta, uzaktan veya tek açıdan çekilmiş fotoğraflarda ise alıcı riski fiyata yansıtmak zorunda kalır." },
        ],
      },
      {
        title: "Doğru ışık ve açı",
        blocks: [
          { type: "p", text: "Gün ışığında, tercihen sabah veya ikindi saatlerinde çekim yapın; öğle güneşi sert gölgeler ve parlama yaratır. Aracın etrafında dönebileceğiniz açık bir alan seçin ve telefonu göğüs hizasında tutun." },
          { type: "ul", items: [
            "Aracın tamamı kadraja girsin; çok yakından çekmeyin",
            "Flaş kullanmayın, doğal ışığı tercih edin",
            "Aracı yıkamayın — temizlik hasarı gizliyor izlenimi verebilir",
            "Fotoğrafları filtresiz ve düzenlemeden gönderin",
          ] },
        ],
      },
      {
        title: "Çekilmesi gereken kareler",
        blocks: [
          { type: "ol", items: [
            "Ön, arka ve her iki yan görünüm (dört köşe)",
            "Hasarlı her bölgenin yakın çekimi",
            "Kaput açık hâlde motor bölmesi",
            "Gösterge paneli — kilometre okunacak şekilde",
            "Ön ve arka iç mekân ile bagaj",
            "Şase numarası ve ruhsat",
          ] },
          { type: "p", text: "Araç çalışıyorsa gösterge panelinde yanan uyarı ışıklarını da fotoğraflayın; çalışmıyorsa marş denemesinin birkaç saniyelik videosu değerlendirmeyi ciddi biçimde hızlandırır." },
        ],
      },
      {
        title: "Sık yapılan hatalar",
        blocks: [
          { type: "ul", items: [
            "Yalnızca hasarsız tarafı fotoğraflamak — teklif yerinde görüşte düşer",
            "Karanlıkta veya kapalı otoparkta çekim yapmak",
            "Kilometreyi göstermemek",
            "Ruhsat fotoğrafını okunmayacak kadar bulanık göndermek",
            "Eksik veya sökülmüş parçaları belirtmemek",
          ] },
          { type: "note", text: "Hasarı olduğu gibi göstermek satıcının lehinedir: gerçek duruma dayanan teklif, yerinde görüşte değişmez ve süreç tek seferde tamamlanır." },
        ],
      },
    ],
    sample: false,
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
