import Link from "next/link";
import { Home, LifeBuoy } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { routes } from "@/config/navigation";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream-50 px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-[72px] font-bold leading-none text-burgundy-700">404</p>
        <p className="eyebrow mt-4 justify-center">Sayfa Bulunamadı</p>
        <h1 className="mt-2 text-[28px] font-bold text-ink md:text-[34px]">
          Aradığınız Sayfaya Ulaşılamadı
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-secondary">
          Sayfa taşınmış veya kaldırılmış olabilir. Aşağıdaki bağlantılardan
          devam edebilirsiniz.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={routes.home} className={buttonClasses({ variant: "primary" })}>
            <Home size={18} />
            Ana Sayfaya Dön
          </Link>
          <Link
            href={routes.vehiclesWeBuy}
            className={buttonClasses({ variant: "outline" })}
          >
            Hangi Araçları Alıyoruz?
          </Link>
          <Link href={routes.contact} className={buttonClasses({ variant: "outline" })}>
            <LifeBuoy size={18} />
            İletişim
          </Link>
        </div>
      </div>
    </main>
  );
}
