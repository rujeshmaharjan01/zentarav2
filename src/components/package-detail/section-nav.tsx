"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const allSections = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Itinerary" },
  { id: "includes", label: "Includes" },
  { id: "why-us", label: "Why Us" },
  { id: "faqs", label: "FAQs" },
];

interface SectionNavProps {
  hasItinerary?: boolean;
}

export function SectionNav({ hasItinerary = true }: SectionNavProps) {
  const sections = hasItinerary ? allSections : allSections.filter((s) => s.id !== "itinerary");
  const [active, setActive] = useState("overview");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-scroll active pill into view
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const activeEl = nav.querySelector(`[data-section="${active}"]`) as HTMLElement | null;
    if (!activeEl) return;

    const navRect = nav.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();
    const isOutOfView = elRect.left < navRect.left || elRect.right > navRect.right;

    if (isOutOfView) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [active]);

  // Track scroll position for gradient indicators
  function updateScrollState() {
    const nav = navRef.current;
    if (!nav) return;
    setCanScrollLeft(nav.scrollLeft > 4);
    setCanScrollRight(nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 4);
  }

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    updateScrollState();
    nav.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      nav.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto relative">
        {/* Left gradient */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none z-10 transition-opacity duration-200",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Right gradient */}
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none z-10 transition-opacity duration-200",
            canScrollRight ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          ref={navRef}
          className="flex gap-1 py-2 px-4 overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-section={s.id}
              className={cn(
                "whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 shrink-0",
                active === s.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
