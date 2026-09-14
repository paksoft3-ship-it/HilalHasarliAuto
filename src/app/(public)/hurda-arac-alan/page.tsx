import type { Metadata } from "next";
import { getClusterPage } from "@/config/cluster-content";
import { routes } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { ClusterPageBody } from "@/components/sections/cluster-page-body";
import { seoTitle, seoDescription } from "@/lib/seo/title";

const content = getClusterPage("hurda-arac-alan")!;

export const metadata: Metadata = {
  title: seoTitle(content.metaTitle),
  description: seoDescription(content.metaDescription),
  alternates: { canonical: routes.hurdaAracAlan },
  openGraph: {
    title: `${content.metaTitle} | ${siteConfig.brandName}`,
    description: content.metaDescription,
    url: routes.hurdaAracAlan,
    type: "website",
  },
};

export default function HurdaAracAlanPage() {
  return <ClusterPageBody content={content} />;
}
