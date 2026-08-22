"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms */
  delay?: number;
  className?: string;
  /** Render as a different element (e.g. "li") to keep valid list semantics. */
  as?: "div" | "li";
}

/**
 * Scroll-based section reveal. Adds a visibility class when the element
 * enters the viewport. With prefers-reduced-motion the CSS disables the
 * transition entirely, so content is always visible.
 *
 * Defaults to a <div>; pass as="li" when wrapping list items so the
 * parent <ul>/<ol> keeps only allowed direct children (axe rule "list").
 */
export default function Reveal({ children, delay = 0, className = "", as = "div" }: RevealProps) {
  const ref = useRef<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      // Very old browsers: show content immediately via direct style (no setState cascade).
      node.classList.add("reveal-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
