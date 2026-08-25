"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * Fixed left rail (Brittany Chiang-style): vertical numbered nav that tracks
 * the section currently in view via IntersectionObserver. Hidden below lg.
 */
export default function SideRail() {
  const [active, setActive] = useState<string>("about");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A band around the middle of the viewport decides the active section.
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );
    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Section" className="hidden lg:block">
      <ul className="sticky top-0 flex h-screen flex-col justify-center gap-1">
        {SECTIONS.map(({ id, label }, i) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? "true" : undefined}
                className="group inline-flex min-h-11 items-center gap-2 py-1 font-mono text-xs"
              >
                <span
                  aria-hidden="true"
                  className={`h-px transition-all duration-300 ${
                    isActive
                      ? "w-12 bg-accent-400"
                      : "w-6 bg-paper-400 group-hover:w-10 group-hover:bg-paper-300"
                  }`}
                />
                <span
                  className={`transition-colors duration-300 ${
                    isActive
                      ? "text-accent-400"
                      : "text-paper-400 group-hover:text-paper-300"
                  }`}
                >
                  <span className="mr-1.5 opacity-100 text-paper-300">0{i + 1}.</span>
                  {label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
