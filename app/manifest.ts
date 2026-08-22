import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { getSiteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const site = getSiteConfig();
  return {
    name: site.defaultTitle,
    short_name: "Srujal K",
    icons: [
      {
        src: `${site.basePath}/icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    theme_color: "#0a0e12",
    background_color: "#0a0e12",
    display: "standalone",
    start_url: `${site.basePath}/`,
  };
}
