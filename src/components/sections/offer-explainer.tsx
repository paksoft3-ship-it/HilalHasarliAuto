import { ClipboardList, SearchCheck } from "lucide-react";

/**
 * "İlk teklif vs nihai teklif" explainer — used on service, how-it-works and
 * guide pages. Keeps expectations honest (no guaranteed price/purchase).
 */
export function OfferExplainer() {
  const cards = [
    {
      icon: ClipboardList,
      title: "İlk Değerlendirme",
      desc: "Paylaştığınız araç bilgileri ve fotoğraflara göre yapılan ön değerlendirmedir. Hızlı bir fikir verir, bağlayıcı bir fiyat taahhüdü değildir.",
    },
    {
      icon: SearchCheck,
      title: "Nihai Teklif",
      desc: "Aracın ve belgelerin kontrolünün ardından netleşen tekliftir. Aracın gerçek durumu, ilk paylaşılan bilgilerle örtüştüğünde süreç hızla ilerler.",
    },
  ];
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {cards.map((c) => (
        <div key={c.title} className="rounded-[14px] border border-line bg-white p-6">
          <span className="grid h-11 w-11 place-items-center rounded-[10px] bg-cream-100 text-burgundy-700">
            <c.icon size={22} strokeWidth={1.9} />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-ink">{c.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-secondary">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}
