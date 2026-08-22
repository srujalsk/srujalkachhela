import Reveal from "./Reveal";
import type { Project } from "@/lib/content-schema";

function ProjectLinks({ project }: { project: Project }) {
  const links: { href: string; label: string; external: boolean }[] = [];
  if (project.links.source) {
    links.push({ href: project.links.source, label: `View ${project.title} source code`, external: true });
  }
  if (project.links.demo) {
    links.push({ href: project.links.demo, label: `Open ${project.title} live demo`, external: true });
  }
  if (links.length === 0) return null;
  return (
    <ul className="mt-6 flex flex-wrap gap-4">
      {links.map((l) => (
        <li key={l.href}>
          <a
            href={l.href}
            {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-flex min-h-11 items-center gap-1.5 font-mono text-sm text-accent-400 hover:text-accent-300 underline-offset-4 hover:underline"
          >
            {l.external ? "Source" : "Demo"}
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function FeaturedWork({ projects }: { projects: Project[] }) {
  return (
    <section id="work" aria-labelledby="work-heading" className="container-site py-20 sm:py-28">
      <Reveal>
        <h2
          id="work-heading"
          className="flex items-baseline gap-4 font-mono text-xl sm:text-2xl font-bold text-paper-50"
        >
          <span aria-hidden="true" className="text-accent-500 text-base">
            01.
          </span>
          Featured work
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-paper-400">
          Open-source tools and selected case studies. Confidential engagements are described at an architecture level only.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 90}>
            <article className="group relative flex h-full flex-col rounded-lg border border-ink-700 bg-ink-900 p-6 sm:p-8 transition-colors hover:border-accent-600 focus-within:border-accent-600">
              <div className="flex items-start justify-between gap-4">
                <div className="font-mono text-xs uppercase tracking-widest text-accent-500">
                  {project.type === "case-study" ? "Case study" : "Open source"}
                  {project.confidential ? " · sanitized" : ""}
                </div>
                {project.year ? <div className="font-mono text-xs text-paper-400">{project.year}</div> : null}
              </div>
              <h3 className="mt-4 text-xl font-bold text-paper-50 group-hover:text-accent-400 transition-colors">
                {project.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-paper-300">{project.summary}</p>
              {project.stack.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-xs text-paper-400" aria-label={`${project.title} technology stack`}>
                  {project.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              ) : null}
              <ProjectLinks project={project} />
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
