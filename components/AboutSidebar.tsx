import type { Profile } from "@/lib/content-schema";

/**
 * Static left-rail "about me" card for the two-column layout.
 * Stays fixed on large screens while the right column scrolls.
 */
export default function AboutSidebar({ profile }: { profile: Profile }) {
  return (
    <aside
      id="about-sidebar"
      aria-label="About"
      className="lg:sticky lg:top-24 lg:self-start"
    >
      <div className="rounded-lg border border-ink-700 bg-ink-900 p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-500">
          About
        </p>
        <h2 className="mt-2 text-xl font-bold text-paper-50">{profile.name}</h2>
        <p className="mt-1 text-sm text-paper-400">{profile.safeTitle}</p>
        <p className="mt-1 flex items-center gap-2 font-mono text-xs text-accent-400">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {profile.location}
        </p>

        <p className="mt-4 text-sm leading-relaxed text-paper-300">{profile.tagline}</p>

        {/* Contact */}
        <div className="mt-6 border-t border-ink-700 pt-5">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-paper-400">
            Get in touch
          </h3>
          <a
            href={`mailto:${profile.email}`}
            className="mt-3 inline-flex min-h-11 items-center gap-2 break-all text-sm text-accent-400 underline-offset-4 hover:underline"
          >
            {profile.email}
          </a>
          {profile.showPhone && profile.phone ? (
            <a
              href={`tel:${profile.phone.replace(/\s+/g, "")}`}
              className="mt-1 block min-h-11 text-sm text-paper-300 hover:text-accent-400"
            >
              {profile.phone}
            </a>
          ) : null}
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1" aria-label="Social profiles">
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center gap-1.5 font-mono text-sm text-paper-300 hover:text-accent-400"
              >
                LinkedIn
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href={profile.x}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center gap-1.5 font-mono text-sm text-paper-300 hover:text-accent-400"
              >
                X
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>
            </li>
          </ul>
        </div>

        {/* Quick links to the scrolling column */}
        <nav aria-label="Section shortcuts" className="mt-6 border-t border-ink-700 pt-5">
          <ul className="space-y-1">
            {[
              ["#work", "Featured work"],
              ["#experience", "Experience"],
              ["#skills", "Skills"],
              ["#education", "Education"],
            ].map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="flex min-h-9 items-center font-mono text-sm text-paper-300 hover:text-accent-400"
                >
                  <span aria-hidden="true" className="mr-2 text-accent-500">›</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
