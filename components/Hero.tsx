import type { Profile } from "@/lib/content-schema";

/** Decorative data-flow signal line (pure SVG, hidden from AT). */
function SignalLine() {
  return (
    <svg
      aria-hidden="true"
      className="mt-10 h-8 w-full max-w-md text-accent-500/60 motion-reduce:hidden"
      viewBox="0 0 320 32"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <path d="M0 16 H96 M112 16 H208 M224 16 H320" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <circle cx="104" cy="16" r="3" fill="currentColor" opacity="0.7" />
      <circle cx="216" cy="16" r="3" fill="currentColor" opacity="0.7" />
      <line
        x1="0"
        y1="16"
        x2="24"
        y2="16"
        stroke="#2cc9b4"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="6 18"
        className="animate-signal"
      />
    </svg>
  );
}

export default function Hero({ profile }: { profile: Profile }) {
  const firstName = profile.name.split(" ")[0] ?? profile.name;
  const lastName = profile.name.split(" ").slice(1).join(" ");

  return (
    <section id="about" aria-labelledby="hero-heading" className="relative overflow-hidden">
      {/* subtle technical grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-accent-500) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent-500) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="container-site relative pt-20 pb-16 sm:pt-28 sm:pb-24">
        <ol className="space-y-1 font-mono text-sm text-accent-400">
          <li className="animate-rise">Hi, my name is</li>
        </ol>
        <h1 id="hero-heading" className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-paper-50 animate-rise [animation-delay:80ms]">
          {firstName} {lastName}.
        </h1>
        <p className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-paper-400 animate-rise [animation-delay:160ms]">
          {profile.safeTitle}
        </p>
        <div className="mt-6 max-w-xl space-y-4 text-base sm:text-lg text-paper-300 animate-rise [animation-delay:240ms]">
          <p>{profile.tagline}</p>
          <p className="flex items-center gap-2 font-mono text-sm text-accent-400">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {profile.location}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 animate-rise [animation-delay:320ms]">
          <a
            href="#experience"
            className="inline-flex min-h-12 items-center rounded-md bg-accent-500 px-6 font-mono text-sm font-semibold text-ink-950 hover:bg-accent-400 transition-colors"
          >
            View experience
          </a>
          {profile.cvPath ? (
            <a
              href={profile.cvPath}
              download
              className="inline-flex min-h-12 items-center rounded-md border border-ink-600 px-6 font-mono text-sm text-paper-100 hover:border-accent-500 hover:text-accent-400 transition-colors"
            >
              Download CV
            </a>
          ) : null}
          <a
            href="#contact"
            className="inline-flex min-h-12 items-center rounded-md px-4 font-mono text-sm text-paper-300 underline-offset-4 hover:text-accent-400 hover:underline transition-colors"
          >
            Contact
          </a>
        </div>

        <SignalLine />
      </div>
    </section>
  );
}
