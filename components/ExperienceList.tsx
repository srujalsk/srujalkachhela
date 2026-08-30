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

/**
 * Experience: each role renders sequentially as its own sub-section with an
 * h3 heading — no tabs, no hidden panels. Everything is visible on the page
 * (and to crawlers) at once.
 */
export default function ExperienceList({ entries }: { entries: Experience[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="mt-10 flex flex-col gap-14">
      {entries.map((e) => (
        <article key={`${e.company}-${e.start}`}>
          <h3 className="text-lg font-bold text-paper-50 sm:text-xl">
            {e.role}{" "}
            <span className="text-accent-400">@ {e.company}</span>
          </h3>
          <p className="mt-2 font-mono text-xs text-paper-400">
            {formatMonth(e.start)} — {formatMonth(e.end)}
            {e.location ? ` · ${e.location}` : ""}
          </p>

          {e.highlights.length > 0 ? (
            <ul className="mt-5 space-y-2.5">
              {e.highlights.map((h, j) => (
                <li key={j} className="flex gap-3 text-sm leading-relaxed text-paper-300">
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-1 shrink-0 text-accent-500">
                    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {e.body.trim() ? (
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-paper-300">
              {e.body.trim().split(/\n{2,}/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : null}

          {e.stack.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-xs text-paper-400" aria-label={`${e.company} technology stack`}>
              {e.stack.map((tech) => (
                <li key={tech} className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-accent-500">▹</span>
                  {tech}
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  );
}
