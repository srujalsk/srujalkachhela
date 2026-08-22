import Reveal from "./Reveal";
import type { Education, Skills } from "@/lib/content-schema";

export function SkillsSection({ skills }: { skills: Skills }) {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="container-site py-20 sm:py-28">
      <Reveal>
        <h2 id="skills-heading" className="flex items-baseline gap-4 font-mono text-xl sm:text-2xl font-bold text-paper-50">
          <span aria-hidden="true" className="text-accent-500 text-base">03.</span>
          Skills
        </h2>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 max-w-5xl">
        {skills.groups.map((group, i) => (
          <Reveal key={group.name} delay={i * 60}>
            <h3 className="font-mono text-sm font-semibold uppercase tracking-widest text-accent-400">
              {group.name}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item} className="rounded-full border border-ink-600 bg-ink-900 px-3 py-1.5 text-xs text-paper-200">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function EducationSection({ education }: { education: Education }) {
  return (
    <section id="education" aria-labelledby="education-heading" className="border-y border-ink-800 bg-ink-900/60 py-20 sm:py-28">
      <div className="container-site">
        <Reveal>
          <h2 id="education-heading" className="flex items-baseline gap-4 font-mono text-xl sm:text-2xl font-bold text-paper-50">
            <span aria-hidden="true" className="text-accent-500 text-base">04.</span>
            Education &amp; certifications
          </h2>
        </Reveal>
        <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 max-w-4xl">
          {education.entries.map((entry, i) => (
            <Reveal key={entry.title} delay={i * 60} as="li">
              <div className="border-l-2 border-accent-600 pl-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-semibold text-paper-50">{entry.title}</h3>
                  {entry.year ? <span className="font-mono text-xs text-accent-500">{entry.year}</span> : null}
                </div>
                {entry.detail ? <p className="mt-1.5 text-sm leading-relaxed text-paper-300">{entry.detail}</p> : null}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
