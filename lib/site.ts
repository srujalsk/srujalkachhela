import type { SiteConfig } from "./site-config";

/** Resolve site URL + base path from env (no hard-coded repo name). */
export function getSiteConfig(): SiteConfig {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");
  return {
    siteUrl,
    basePath,
    titleTemplate: "%s | Srujal Kachhela",
    defaultTitle: "Srujal Kachhela — Full Stack Developer",
    description:
      "Full Stack Developer in Bangkok with 11+ years of experience across cloud and on-premises systems: Azure, AWS, .NET, React, and distributed integrations.",
    author: "Srujal Kachhela",
    locale: "en",
    showFooter: false,
  };
}

/** Join basePath with an app-relative path for static-export-safe URLs. */
export function withBasePath(path: string, basePath = getSiteConfig().basePath): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${basePath}${path}`;
}

export function absoluteUrl(path: string, siteUrl = getSiteConfig().siteUrl): string {
  const withPath = withBasePath(path);
  // NEXT_PUBLIC_SITE_URL for GitHub Pages project sites already contains the
  // subpath (e.g. https://user.github.io/repo), which is also the basePath.
  // Avoid appending it twice (…/repo/repo/) in sitemap/robots/JSON-LD URLs.
  if (getSiteConfig().basePath && siteUrl.endsWith(getSiteConfig().basePath)) {
    return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
  }
  return `${siteUrl}${withPath}`;
}
