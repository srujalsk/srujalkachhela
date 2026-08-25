"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * Fixed left rail (Brittany Chiang-style): logo, vertical numbered nav with
 * scroll-spy, social links at the bottom. Hidden below lg — the top bar +
 * dialog handle mobile.
 */
export default function SiteNav() {
  const [active, setActive] = useState<string>("about");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );
    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <header className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex lg:flex-col lg:px-10 lg:py-10 lg:z-40">
      {/* Logo */}
      <Link
        href="/#about"
        className="font-mono text-xl font-bold text-accent-400 min-h-11 inline-flex items-center hover:text-accent-300 transition-colors"
        aria-label="Srujal Kachhela — home"
      >
        {"<sk />"}
      </Link>

      {/* Vertical section nav, vertically centered */}
      <nav aria-label="Section" className="flex-1 flex flex-col justify-center">
        <ul className="space-y-5">
          {SECTIONS.map(({ id, label }, i) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group inline-flex items-center gap-3 font-mono text-xs"
                >
                  <span
                    aria-hidden="true"
                    className={`h-px transition-all duration-300 ${
                      isActive
                        ? "w-8 bg-accent-400"
                        : "w-4 bg-paper-400 group-hover:w-7 group-hover:bg-paper-300"
                    }`}
                  />
                  <span
                    className={`transition-colors duration-300 ${
                      isActive
                        ? "text-accent-400"
                        : "text-paper-400 group-hover:text-paper-300"
                    }`}
                  >
                    <span className="mr-1.5 text-paper-300">0{i + 1}.</span>
                    {label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Social links at the bottom of the rail */}
      <ul className="flex flex-col gap-4" aria-label="Social profiles">
        <li>
          <a
            href="https://github.com/srujalsk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex min-h-11 items-center text-paper-400 hover:text-accent-400 transition-colors"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/srujalkachhela/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex min-h-11 items-center text-paper-400 hover:text-accent-400 transition-colors"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v1.5A6 6 0 0 1 16 8Z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </li>
        <li>
          <a
            href="https://x.com/srujalsk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="inline-flex min-h-11 items-center text-paper-400 hover:text-accent-400 transition-colors"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4l16 16M20 4L4 20" />
            </svg>
          </a>
        </li>
      </ul>
    </header>
  );
}

export { SECTIONS };
