"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Itinerary" },
  { id: "includes", label: "Includes" },
  { id: "why-us", label: "Why Us" },
  { id: "faqs", label: "FAQs" },
];

export function SectionNav() {
  const [active, setActive] = useState("overview");

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

  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <nav className="flex gap-1 overflow-x-auto py-2 scrollbar-none snap-x snap-mandatory">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium transition-colors snap-start",
                active === s.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
