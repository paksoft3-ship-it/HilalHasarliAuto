import type { Metadata } from "next";
import { LegalDocument } from "@/components/ui/legal-document";
import { termsDoc } from "@/config/legal";
import { routes } from "@/config/navigation";

export const metadata: Metadata = {
  title: termsDoc.title,
  description: termsDoc.intro,
  alternates: { canonical: routes.terms },
};

export default function TermsPage() {
  return <LegalDocument doc={termsDoc} />;
}
