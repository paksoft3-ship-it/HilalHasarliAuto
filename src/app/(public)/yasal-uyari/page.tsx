import type { Metadata } from "next";
import { LegalDocument } from "@/components/ui/legal-document";
import { legalNoticeDoc } from "@/config/legal";
import { routes } from "@/config/navigation";

export const metadata: Metadata = {
  title: legalNoticeDoc.title,
  description: legalNoticeDoc.intro,
  alternates: { canonical: routes.legalNotice },
};

export default function LegalNoticePage() {
  return <LegalDocument doc={legalNoticeDoc} />;
}
