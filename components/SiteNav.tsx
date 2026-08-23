"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "work", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("about");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape, return focus to trigger.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    // Move focus into the dialog when opened.
    closeButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Highlight the nav item for the section currently in view.
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entriesList) => {
        for (const entry of entriesList) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const s of sections) observer.observe(s);
    return () => observer.disconnect();
  }, []);

  const closeAndReturnFocus = () => {
    setOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <header className="lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-r-0 lg:z-40 z-40">
      {/* Top bar (mobile/tablet): logo + menu button */}
      <nav
        aria-label="Main"
        className="lg:hidden sticky top-0 flex h-16 items-center justify-between border-b border-ink-700 bg-ink-950/95 px-6 backdrop-blur-sm"
      >
        <Link
          href="/#about"
          className="font-mono text-lg text-accent-400 min-h-11 inline-flex items-center"
          aria-label="Srujal Kachhela — home"
        >
          {"<sk />"}
        </Link>

        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close main menu" : "Open main menu"}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex min-w-11 min-h-11 items-center justify-center rounded-md text-paper-100 hover:text-accent-400"
        >
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Fixed left rail (desktop) */}
      <nav
        aria-label="Main"
        className="hidden lg:flex lg:flex-col lg:h-screen lg:sticky lg:top-0 lg:px-10 lg:py-12"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/#about"
            className="font-mono text-xl font-bold text-accent-400 min-h-11 inline-flex items-center hover:text-accent-300 transition-colors"
            aria-label="Srujal Kachhela — home"
          >
            {"<sk />"}
          </Link>
        </div>

        <ul className="mt-16 space-y-1">
          {NAV_LINKS.map((link, i) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? "true" : undefined}
                className={`group flex min-h-11 items-center gap-3 font-mono text-xs tracking-wider uppercase transition-colors ${
                  active === link.id ? "text-accent-400" : "text-paper-300 hover:text-accent-400"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`block h-px w-8 bg-current transition-all group-hover:w-12 ${active === link.id ? "w-12" : ""}`}
                />
                <span className="text-accent-500/70">0{i + 1}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="mailto:srujal.k@gmail.com"
          className="mt-auto inline-flex min-h-11 items-center justify-center rounded-md border border-accent-500 px-4 font-mono text-sm text-accent-400 hover:bg-accent-500/10 transition-colors"
        >
          Email me
        </a>
      </nav>

      {/* Mobile menu (dialog) */}
      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-ink-950 border-t border-ink-700 p-6 flex flex-col"
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeAndReturnFocus}
            className="self-end inline-flex min-w-11 min-h-11 items-center justify-center rounded-md text-paper-100 hover:text-accent-400"
            aria-label="Close menu"
          >
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
          <ul className="mt-4 flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={closeAndReturnFocus}
                  className="flex min-h-14 items-center px-2 text-lg text-paper-100 hover:text-accent-400 border-b border-ink-800"
                >
                  <span aria-hidden="true" className="mr-3 font-mono text-xs text-accent-500">
                    0{i + 1}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="mailto:srujal.k@gmail.com"
            onClick={closeAndReturnFocus}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md border border-accent-500 px-4 font-mono text-sm text-accent-400 hover:bg-accent-500/10"
          >
            Email me
          </a>
        </div>
      )}
    </header>
  );
}
