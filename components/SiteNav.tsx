"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * Fixed left rail (OpenViking-style "In this piece" index): eyebrow label,
 * top-aligned numbered heading links with scroll-spy. Heading-level links
 * only — no nested/sub-section entries. Hidden below lg — the top bar +
 * dialog handle mobile.
 */
export default function SiteNav() {
  const [active, setActive] = useState<string>("about");

  // Clicking a rail link highlights immediately and pins the choice until the
  // smooth scroll arrives: without the pin, scroll events fired mid-flight
  // would overwrite it with whatever section the passing viewport shows.
  const suppressRef = useRef(false);
  const pinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleNavClick = (id: string) => {
    setActive(id);
    // Pin the choice while the smooth scroll flies: mid-flight scroll events
    // would otherwise overwrite it with whatever section passes through the
    // band. Release after the scroll has had time to arrive. Clear any pin
    // a previous click left — a stale release must not end this pin early.
    suppressRef.current = true;
    if (pinTimerRef.current) clearTimeout(pinTimerRef.current);
    pinTimerRef.current = setTimeout(() => {
      suppressRef.current = false;
    }, 1400);
  };

  useEffect(() => {
    // Scroll-spy: on every scroll frame, the active section is the one whose
    // heading is at or above the 35% viewport line. A pure position check
    // (not IntersectionObserver) because transition-only events miss state
    // that doesn't change — e.g. scrolling up from a bottom-anchored Contact,
    // where Experience already spans the whole band.
    let raf = 0;

    const update = () => {
      raf = 0;
      if (suppressRef.current) return;
      const doc = document.documentElement;
      const line = window.innerHeight * 0.35;

      // Page scrolled to (or near) the bottom: always highlight the last
      // section — it may sit entirely below the band line.
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) {
        setActive((prev) => (prev === SECTIONS[SECTIONS.length - 1]!.id ? prev : SECTIONS[SECTIONS.length - 1]!.id));
        return;
      }

      let current: string = SECTIONS[0].id;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // Anchor navigation (deep links, back/forward) can jump without a scroll
    // event firing after load — recompute on hash changes and once more after
    // layout/fonts settle.
    const onHash = () => {
      update();
      setTimeout(update, 600); // after smooth scroll (if any) settles
    };
    window.addEventListener("hashchange", onHash);
    const settle = setTimeout(update, 600);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (pinTimerRef.current) clearTimeout(pinTimerRef.current);
      clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  return (
    <header className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 lg:flex lg:flex-col lg:px-8 lg:py-10 lg:z-40">
      {/* Logo */}
      <Link
        href="/#about"
        className="font-mono text-xl font-bold text-accent-400 min-h-11 inline-flex items-center hover:text-accent-300 transition-colors"
        aria-label="Srujal Kachhela — home"
      >
        {"<sk />"}
      </Link>

      {/* Top-aligned section index, OpenViking-style */}
      <nav aria-label="Main" className="mt-14">
        <p
          id="rail-label"
          className="font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-paper-400 mb-5"
        >
          In this piece
        </p>
        <ul aria-labelledby="rail-label" className="space-y-3.5">
          {SECTIONS.map(({ id, label }, i) => {
            const isActive = active === id;
            return (
              <li key={id} className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className={`mt-[7px] h-px flex-none transition-all duration-300 ${
                    isActive
                      ? "w-3.5 bg-accent-400"
                      : "w-0 group-hover:w-2.5 bg-paper-300 opacity-0 group-hover:opacity-100"
                  }`}
                />
                <a
                  href={`#${id}`}
                  onClick={() => handleNavClick(id)}
                  aria-current={isActive ? "true" : undefined}
                  className="group inline-flex items-baseline gap-2 text-sm leading-5 transition-colors duration-300"
                >
                  <span
                    className={`font-mono text-xs tabular-nums transition-colors duration-300 ${
                      isActive
                        ? "text-paper-50"
                        : "text-paper-400 group-hover:text-paper-300"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={`transition-colors duration-300 ${
                      isActive
                        ? "font-semibold text-paper-50"
                        : "text-paper-400 group-hover:text-paper-300"
                    }`}
                  >
                    {label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Social links at the bottom of the rail */}
      <ul className="mt-auto flex flex-col gap-4" aria-label="Social profiles">
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
