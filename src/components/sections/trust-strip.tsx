import { MapPin, BadgeCheck, ShieldCheck, Landmark } from "lucide-react";

const items = [
  { icon: MapPin, label: "Türkiye geneli hizmet", sub: "Bulunduğunuz yerden başvuru" },
  { icon: BadgeCheck, label: "Ücretsiz değerlendirme", sub: "Teklif almak bağlayıcı değil" },
  { icon: ShieldCheck, label: "Güvenli ödeme", sub: "Şeffaf ve kayıtlı süreç" },
  { icon: Landmark, label: "Noter destekli işlem", sub: "Resmi devir planlaması" },
];

export function TrustStrip() {
  return (
    <div className="border-y border-line bg-white">
      <div className="container-page grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
        {items.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3 px-2 py-5 lg:px-6">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream-100 text-burgundy-700">
              <Icon size={22} strokeWidth={1.9} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-ink">{label}</span>
              <span className="text-xs text-ink-muted">{sub}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
