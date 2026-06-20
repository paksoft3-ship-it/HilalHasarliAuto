import type { Metadata } from "next";
import { LegalDocument } from "@/components/ui/legal-document";
import { kvkkDoc } from "@/config/legal";
import { routes } from "@/config/navigation";

export const metadata: Metadata = {
  title: kvkkDoc.title,
  description: kvkkDoc.intro,
  alternates: { canonical: routes.kvkk },
};

export default function KvkkPage() {
  return <LegalDocument doc={kvkkDoc} />;
}
