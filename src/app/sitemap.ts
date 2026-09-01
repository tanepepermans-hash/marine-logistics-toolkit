import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Only public, indexable pages — /download is excluded (its own metadata
// already sets noindex, see src/app/download/page.tsx) and the /dg-training
// sub-pages beyond the landing page sit behind a purchase gate, so there's
// nothing useful for a crawler to index there.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: siteConfig.url, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/dg-training`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/refunds`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
