"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Copy-email button with accessible feedback via aria-live region.
 * Falls back to showing the email as selectable text if clipboard is unavailable.
 */
export default function CopyEmailButton({ email }: { email: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "fallback">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("fallback");
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus("idle"), 2500);
  };

  return (
    <span className="inline-flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-12 items-center gap-2 rounded-md bg-accent-500 px-5 font-mono text-sm font-semibold text-ink-950 hover:bg-accent-400 transition-colors"
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        {status === "copied" ? "Copied!" : "Copy email"}
      </button>
      <a
        href={`mailto:${email}`}
        className="inline-flex min-h-12 items-center rounded-md border border-accent-500 px-5 font-mono text-sm text-accent-400 hover:bg-accent-500/10 transition-colors"
      >
        {email}
      </a>
      {/* Accessible live-region feedback for screen readers */}
      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied" && "Email address copied to clipboard."}
        {status === "fallback" && `Clipboard unavailable. Email address: ${email}`}
      </span>
      <span aria-hidden="true" className="font-mono text-xs text-accent-300 min-h-4">
        {status === "copied" ? "✓ copied" : ""}
        {status === "fallback" ? "select manually ↑" : ""}
      </span>
    </span>
  );
}
