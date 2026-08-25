"use client";

import { useRef, useState } from "react";
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
 * Brittany Chiang-style experience: vertical list of company tabs on the
 * left; the selected job's details render on the right. Keyboard accessible
 * per WAI-ARIA tabs pattern (roving tabindex, arrow keys). Tabs wrap into
 * pills on small screens.
 */
export default function ExperienceTabs({ entries }: { entries: Experience[] }) {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  if (entries.length === 0) return null;

  const entry = entries[selected];
  if (!entry) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (selected + 1) % entries.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (selected - 1 + entries.length) % entries.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = entries.length - 1;
    if (next !== null) {
      e.preventDefault();
      setSelected(next);
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <div className="mt-10 flex flex-col gap-6 md:flex-row md:gap-10">
      {/* Company tabs */}
      <div
        role="tablist"
        aria-label="Work history"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="flex flex-row flex-wrap gap-1 md:flex-col md:flex-nowrap md:gap-0 md:border-l md:border-ink-700"
      >
        {entries.map((e, i) => {
          const isActive = i === selected;
          return (
            <button
              key={`${e.company}-${e.start}`}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`exp-tab-${i}`}
              aria-selected={isActive}
              aria-controls={`exp-panel-${i}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setSelected(i)}
              className={`relative min-w-0 whitespace-normal rounded-md border-b-2 px-3 py-2 text-left font-mono text-sm transition-colors md:min-h-11 md:w-full md:rounded-none md:border-b-0 ${
                isActive
                  ? "border-accent-500 text-accent-400 md:bg-accent-500/10"
                  : "border-transparent text-paper-400 hover:bg-ink-800 hover:text-paper-300"
              }`}
            >
              {e.company}
            </button>
          );
        })}
      </div>

      {/* Selected role details */}
      <div
        role="tabpanel"
        id={`exp-panel-${selected}`}
        aria-labelledby={`exp-tab-${selected}`}
        tabIndex={0}
        className="min-w-0 flex-1 focus-visible:outline-2 focus-visible:outline-accent-400"
      >
        <h3 className="text-lg font-bold text-paper-50 sm:text-xl">
          {entry.role}{" "}
          <span className="text-accent-400">@ {entry.company}</span>
        </h3>
        <p className="mt-2 font-mono text-xs text-paper-400">
          {formatMonth(entry.start)} — {formatMonth(entry.end)}
          {entry.location ? ` · ${entry.location}` : ""}
        </p>

        {entry.highlights.length > 0 ? (
          <ul className="mt-5 space-y-2.5">
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

        {entry.body.trim() ? (
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-paper-300">
            {entry.body.trim().split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ) : null}

        {entry.stack.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-xs text-paper-400" aria-label={`${entry.company} technology stack`}>
            {entry.stack.map((tech) => (
              <li key={tech} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-accent-500">▹</span>
                {tech}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
