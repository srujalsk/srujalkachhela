import Reveal from "./Reveal";
import type { Experience } from "@/lib/content-schema";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatMonth(value: string): string {
  if (value.toLowerCase() === "present") return "Present";
  const [year, month] = value.split("-");
  const idx = Number(month) - 1;
  const name = MONTHS[idx];
  return name ? `${name} ${year}` : value;
}

/** Simple paragraph renderer for content bodies (plain text / inline Markdown-lite). */
function Body({ text }: { text: string }) {
  const paragraphs = text.trim().split(/\n{2,}/);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className="mt-4 text-sm leading-relaxed text-paper-300">
          {p}
        </p>
      ))}
    </>
  );
}

export default function ExperienceTimeline({ entries }: { entries: Experience[] }) {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-24">
        <Reveal>
          <h2 id="experience-heading" className="flex items-baseline gap-4 font-mono text-xl sm:text-2xl font-bold text-paper-50">
            <span aria-hidden="true" className="text-accent-500 text-base">02.</span>
            Experience
          </h2>
        </Reveal>

        <ol className="relative mt-12 space-y-14 border-l border-ink-600 pl-6 sm:pl-8">
          {entries.map((entry, i) => (
            <li key={`${entry.company}-${entry.start}`} className="relative">
              {/* timeline node */}
              <span
                aria-hidden="true"
                className="absolute -left-[31px] top-1.5 block h-3 w-3 rounded-full border-2 border-accent-500 bg-ink-950 sm:-left-[47px]"
              />
              <Reveal delay={i * 80}>
                <header>
                  <p className="font-mono text-xs text-paper-400">
                    {formatMonth(entry.start)} — {formatMonth(entry.end)}
                  </p>
                  <h3 className="mt-1.5 text-lg sm:text-xl font-bold text-paper-50">
                    {entry.role} <span className="text-accent-400">@ {entry.company}</span>
                  </h3>
                  {entry.location ? <p className="mt-1 text-xs text-paper-400">{entry.location}</p> : null}
                </header>

                {"projects" in entry && Array.isArray(entry.projects) && entry.projects.length > 0 ? (
                  <p className="mt-3 text-xs text-paper-400">
                    Projects: {(entry.projects as string[]).join(" · ")}
                  </p>
                ) : null}

                {entry.highlights.length > 0 ? (
                  <ul className="mt-4 space-y-2.5">
                    {entry.highlights.map((h, j) => (
                      <li key={j} className="flex gap-3 text-sm leading-relaxed text-paper-300">
                        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-1 shrink-0 text-accent-500">
                          <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <Body text={entry.body} />

                {entry.stack.length > 0 ? (
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${entry.company} technology stack`}>
                    {entry.stack.map((tech) => (
                      <li key={tech} className="rounded-full border border-ink-600 bg-ink-800 px-3 py-1 font-mono text-xs text-paper-300">
                        {tech}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Reveal>
            </li>
          ))}
        </ol>
    </section>
  );
}
