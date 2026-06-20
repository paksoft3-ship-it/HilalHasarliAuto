import {
  MessageCircle,
  CarFront,
  ShieldCheck,
  MapPin,
  Landmark,
  Clock3,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";

const benefits = [
  { icon: MessageCircle, title: "Açık ve hızlı iletişim", desc: "Telefon ve WhatsApp ile sürecin her adımında size ulaşılır." },
  { icon: CarFront, title: "Araca özel değerlendirme", desc: "Her araç durumuna göre ayrı ve gerçekçi şekilde değerlendirilir." },
  { icon: ShieldCheck, title: "Güvenli resmi süreç", desc: "Devir ve ödeme adımları kayıtlı ve şeffaf biçimde yürütülür." },
  { icon: MapPin, title: "Türkiye geneli başvuru", desc: "Bulunduğunuz ilden değerlendirme talebi oluşturabilirsiniz." },
  { icon: Landmark, title: "Noter sürecinde destek", desc: "Noter ve devir işlemlerinde adım adım yönlendirme sağlanır." },
  { icon: Clock3, title: "Hızlı geri dönüş", desc: "Talebiniz ulaştığında uzman ekibimiz sizinle iletişime geçer." },
];

export function WhyUs() {
  return (
    <Section tone="charcoal">
      <SectionHeading
        eyebrow="Neden Biz?"
        title="Güvenilir, Hızlı ve Profesyonel Hizmet"
        intro="Aracınızı birlikte değerlendirelim; süreci açık ve güvenli şekilde yönetelim."
        tone="light"
      />
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b) => (
          <div key={b.title} className="flex gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] border border-white/12 text-gold-600">
              <b.icon size={24} strokeWidth={1.8} />
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">{b.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/65">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
