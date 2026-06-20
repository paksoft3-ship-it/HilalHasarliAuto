import type { Metadata } from "next";
import { LegalDocument } from "@/components/ui/legal-document";
import { privacyDoc } from "@/config/legal";
import { routes } from "@/config/navigation";

export const metadata: Metadata = {
  title: privacyDoc.title,
  description: privacyDoc.intro,
  alternates: { canonical: routes.privacy },
};

export default function PrivacyPage() {
  return <LegalDocument doc={privacyDoc} />;
}
