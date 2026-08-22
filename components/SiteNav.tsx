"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/#education", label: "Education" },
  { href: "/#contact", label: "Contact" },
] as const;

export default function SiteNav() {
  const [open, setOpen] = useState(false);
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

  const closeAndReturnFocus = () => {
    setOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-950/95">
      <nav aria-label="Main" className="container-site flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm text-accent-400 min-h-11 inline-flex items-center"
          aria-label="Srujal Kachhela — home"
        >
          {"<sk />"}
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex items-center min-h-11 px-3 text-sm text-paper-300 hover:text-accent-400 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="mailto:srujal.k@gmail.com"
              className="ml-2 inline-flex items-center min-h-11 px-4 rounded-md border border-accent-500 text-sm font-mono text-accent-400 hover:bg-accent-500/10 transition-colors"
            >
              Email me
            </a>
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close main menu" : "Open main menu"}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex min-w-11 min-h-11 items-center justify-center rounded-md text-paper-100 hover:text-accent-400"
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

      {/* Mobile menu (dialog) */}
      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="md:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-ink-950 border-t border-ink-700 p-6 flex flex-col"
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
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeAndReturnFocus}
                  className="flex min-h-14 items-center px-2 text-lg text-paper-100 hover:text-accent-400 border-b border-ink-800"
                >
                  <span aria-hidden="true" className="mr-3 font-mono text-xs text-accent-500">
                    0{i + 1}
                  </span>
                  {link.label}
                </Link>
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
