import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(__dirname, "..");

/**
 * The site URL (NEXT_PUBLIC_SITE_URL) already contains the GitHub Pages
 * subpath (e.g. https://user.github.io/repo). absoluteUrl() must therefore
 * NOT append the base path again — otherwise sitemap/robots/JSON-LD URLs
 * end up as /repo/repo/.
 *
 * Playwright's runner cannot import the app's TS ESM directly, so the module
 * is compiled in-process with esbuild (already a transitive dependency via
 * tsx) and evaluated against a sandboxed env.
 */
function loadSiteModule(env: { siteUrl?: string; basePath?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { transformSync } = require("esbuild") as typeof import("esbuild");
  const fsSync = require("node:fs") as typeof import("node:fs");
  let src = fsSync.readFileSync(path.join(ROOT, "lib/site.ts"), "utf8");
  src = src.replace(/import type[^\n]*\n/, ""); // strip type-only import
  const js = transformSync(src, { loader: "ts", format: "cjs" });
  const mod = { exports: {} as { absoluteUrl: (p: string) => string; withBasePath: (p: string) => string } };
  const processShim = {
    env: {
      NEXT_PUBLIC_SITE_URL: env.siteUrl,
      NEXT_PUBLIC_BASE_PATH: env.basePath,
    },
  };
  new Function("module", "exports", "process", js.code)(mod, mod.exports, processShim);
  return mod.exports;
}

test.describe("absoluteUrl base-path handling", () => {
  test("guards against appending the base path when SITE_URL already ends with it", () => {
    const { absoluteUrl } = loadSiteModule({
      siteUrl: "https://example.github.io/srujalkachhela",
      basePath: "/srujalkachhela",
    });
    expect(absoluteUrl("/")).toBe("https://example.github.io/srujalkachhela/");
    expect(absoluteUrl("/sitemap.xml")).toBe(
      "https://example.github.io/srujalkachhela/sitemap.xml",
    );
  });

  test("still appends the base path when SITE_URL does not include it", () => {
    const { absoluteUrl } = loadSiteModule({
      siteUrl: "https://example.com",
      basePath: "/srujalkachhela",
    });
    expect(absoluteUrl("/")).toBe("https://example.com/srujalkachhela/");
  });

  test("works without any base path configured", () => {
    const { absoluteUrl } = loadSiteModule({ siteUrl: "https://example.com" });
    expect(absoluteUrl("/")).toBe("https://example.com/");
  });

  test("withBasePath always prefixes the app-relative path", () => {
    const { withBasePath } = loadSiteModule({
      siteUrl: "https://example.com",
      basePath: "/srujalkachhela",
    });
    expect(withBasePath("/")).toBe("/srujalkachhela/");
    expect(withBasePath("icon.svg")).toBe("/srujalkachhela/icon.svg");
  });
});

test.describe("generated static export URLs", () => {
  test("sitemap.xml loc has no doubled base path", () => {
    const sitemap = readFileSync(path.join(ROOT, "out/sitemap.xml"), "utf8");
    expect(sitemap).not.toMatch(/\/srujalkachhela\/srujalkachhela\//);
    if (/srujalkachhela\.github\.io/.test(sitemap)) {
      expect(sitemap).toContain(
        "<loc>https://srujalsk.github.io/srujalkachhela/</loc>",
      );
    }
  });

  test("robots.txt points at the canonical sitemap URL", () => {
    const robots = readFileSync(path.join(ROOT, "out/robots.txt"), "utf8");
    expect(robots).toContain(
      "Sitemap: https://srujalsk.github.io/srujalkachhela/sitemap.xml",
    );
  });

  test("JSON-LD Person url has no doubled base path", () => {
    const html = readFileSync(path.join(ROOT, "out/index.html"), "utf8");
    expect(html).not.toContain("/srujalkachhela/srujalkachhela");
  });

  test("all asset URLs in index.html are base-path prefixed exactly once", () => {
    const html = readFileSync(path.join(ROOT, "out/index.html"), "utf8");
    const urls: string[] = [];
    const re = /(?:src|href)="(\/[^"]*)"/g;
    let match = re.exec(html);
    while (match !== null) {
      urls.push(match[1] as string);
      match = re.exec(html);
    }
    for (const url of urls) {
      expect(url.startsWith("/srujalkachhela/srujalkachhela"), url).toBe(false);
    }
  });

  test("canonical and og:url are the single-prefixed site URL", () => {
    const html = readFileSync(path.join(ROOT, "out/index.html"), "utf8");
    expect(html).toContain(
      '<link rel="canonical" href="https://srujalsk.github.io/srujalkachhela/"/>',
    );
    expect(html).toContain(
      '<meta property="og:url" content="https://srujalsk.github.io/srujalkachhela/"/>',
    );
  });
});
