import Link from "next/link";
import type { Profile } from "@/lib/content-schema";

const FOOTER_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
] as const;

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-ink-800 bg-ink-900">
      <div className="container-site py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/" className="font-mono text-sm text-accent-400 min-h-11 inline-flex items-center">
              {"<sk />"}
            </Link>
            <p className="mt-3 text-sm text-paper-400">
              © {new Date().getFullYear()} {profile.name} · {profile.location}
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-11 items-center text-sm text-paper-300 hover:text-accent-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Social profiles">
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex min-h-11 items-center text-sm text-paper-300 hover:text-accent-400"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-sm text-paper-300 hover:text-accent-400"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={profile.x}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-sm text-paper-300 hover:text-accent-400"
              >
                X (Twitter)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
