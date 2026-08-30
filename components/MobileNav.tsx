"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * Mobile/tablet top bar + slide-in dialog. Hidden at lg where the fixed
 * left rail takes over.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const closeAndReturnFocus = () => {
    setOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <header className="lg:hidden sticky top-0 z-40 border-b border-ink-700 bg-ink-950/95 backdrop-blur-sm">
      <nav aria-label="Main" className="flex h-16 items-center justify-between px-6">
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

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-x-0 top-16 bottom-0 z-50 bg-ink-950 border-t border-ink-700 p-6 flex flex-col"
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
            {SECTIONS.map(({ id, label }, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={closeAndReturnFocus}
                  className="flex min-h-14 items-center px-2 text-lg text-paper-100 hover:text-accent-400 border-b border-ink-800"
                >
                  <span aria-hidden="true" className="mr-3 font-mono text-xs text-accent-500">
                    0{i + 1}
                  </span>
                  {label}
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
