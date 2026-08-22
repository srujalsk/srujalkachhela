import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { absoluteUrl, getSiteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteConfig();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
