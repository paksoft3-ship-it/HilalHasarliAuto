import type { Metadata } from "next";
import { getClusterPage } from "@/config/cluster-content";
import { routes } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { ClusterPageBody } from "@/components/sections/cluster-page-body";
import { seoTitle, seoDescription } from "@/lib/seo/title";

const content = getClusterPage("pert-arac-alan")!;

export const metadata: Metadata = {
  title: seoTitle(content.metaTitle),
  description: seoDescription(content.metaDescription),
  alternates: { canonical: routes.pertAracAlan },
  openGraph: {
    title: `${content.metaTitle} | ${siteConfig.brandName}`,
    description: content.metaDescription,
    url: routes.pertAracAlan,
    type: "website",
  },
};

export default function PertAracAlanPage() {
  return <ClusterPageBody content={content} />;
}
