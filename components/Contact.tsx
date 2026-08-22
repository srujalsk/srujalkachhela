import CopyEmailButton from "./CopyEmailButton";
import Reveal from "./Reveal";
import type { Profile } from "@/lib/content-schema";

export default function Contact({ profile }: { profile: Profile }) {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="container-site py-20 sm:py-28">
      <Reveal>
        <h2 id="contact-heading" className="flex items-baseline gap-4 font-mono text-xl sm:text-2xl font-bold text-paper-50">
          <span aria-hidden="true" className="text-accent-500 text-base">05.</span>
          Get in touch
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-paper-300">
          I&apos;m open to conversations about engineering leadership, full-stack roles, and
          consulting work. The fastest way to reach me is email.
        </p>

        <div className="mt-8">
          <CopyEmailButton email={profile.email} />
        </div>

        {profile.showPhone && profile.phone ? (
          <p className="mt-6 font-mono text-sm text-paper-300">
            Phone:{" "}
            <a href={`tel:${profile.phone.replace(/\s+/g, "")}`} className="text-accent-400 underline-offset-4 hover:underline">
              {profile.phone}
            </a>
          </p>
        ) : null}

        <ul className="mt-10 flex flex-wrap gap-6" aria-label="Social profiles">
          <li>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-mono text-sm text-accent-400 hover:text-accent-300 underline-offset-4 hover:underline"
            >
              LinkedIn
              <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </a>
          </li>
          <li>
            <a
              href={profile.x}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-mono text-sm text-accent-400 hover:text-accent-300 underline-offset-4 hover:underline"
            >
              X (Twitter)
              <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </a>
          </li>
        </ul>
      </Reveal>
    </section>
  );
}
