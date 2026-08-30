import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms (kept for API compatibility; applied as CSS var) */
  delay?: number;
  className?: string;
  /** Render as a different element (e.g. "li") to keep valid list semantics. */
  as?: "div" | "li";
}

/**
 * Scroll-based section reveal — pure CSS via animation-timeline: view()
 * (see globals.css). Server component: zero client JS. Browsers without
 * scroll-driven-animation support simply show the content immediately.
 * Defaults to a <div>; pass as="li" when wrapping list items so the
 * parent <ul>/<ol> keeps only allowed direct children (axe rule "list").
 */
export default function Reveal({ children, delay = 0, className = "", as = "div" }: RevealProps) {
  const Tag = as;
  return (
    <Tag
      className={`reveal ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
