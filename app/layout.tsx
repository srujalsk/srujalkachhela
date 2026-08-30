import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getSiteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0e12",
  width: "device-width",
  initialScale: 1,
};

export function generateMetadata(): Metadata {
  const site = getSiteConfig();
  return {
    metadataBase: new URL(site.siteUrl),
    title: {
      default: site.defaultTitle,
      template: site.titleTemplate,
    },
    description: site.description,
    keywords: [
      "Srujal Kachhela",
      "Technical Lead",
      "Full Stack Developer",
      "Software Engineer Bangkok",
      "React developer Thailand",
      "micro-frontends",
      "serverless",
      "Azure",
      "AWS",
      "Java microservices",
      "TypeScript",
      "engineering lead",
    ],
    authors: [{ name: site.author, url: site.siteUrl }],
    creator: site.author,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "profile",
      locale: site.locale,
      url: "/",
      siteName: site.defaultTitle,
      title: site.defaultTitle,
      description: site.description,
    },
    twitter: {
      card: "summary",
      title: site.defaultTitle,
      description: site.description,
      creator: "@srujalsk",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    category: "technology",
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent-500 focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-ink-950"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
