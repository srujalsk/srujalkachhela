const config = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Applied at build time from the environment so the same source builds
  // for project Pages sites (subpath) and root user sites (no basePath).
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
};

/** @type {import('next').NextConfig} */
export default config;
