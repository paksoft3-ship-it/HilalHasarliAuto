import type { Metadata } from "next";
import { LegalDocument } from "@/components/ui/legal-document";
import { cookieDoc } from "@/config/legal";
import { routes } from "@/config/navigation";

export const metadata: Metadata = {
  title: cookieDoc.title,
  description: cookieDoc.intro,
  alternates: { canonical: routes.cookies },
};

export default function CookiePage() {
  return <LegalDocument doc={cookieDoc} />;
}
