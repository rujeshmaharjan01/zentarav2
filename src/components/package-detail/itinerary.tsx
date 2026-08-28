"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, MapPin, Utensils, Hotel, Route } from "lucide-react";
import type { ItineraryDay } from "@/lib/types";

interface ItineraryProps {
  itinerary: ItineraryDay[];
}

export function Itinerary({ itinerary }: ItineraryProps) {
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([1]));

  function toggle(day: number) {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  function expandAll() {
    setOpenDays(new Set(itinerary.map((d) => d.day)));
  }

  function collapseAll() {
    setOpenDays(new Set());
  }

  if (!itinerary.length) return null;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={expandAll} className="text-xs text-primary hover:underline">Show all</button>
        <span className="text-muted-foreground text-xs">·</span>
        <button onClick={collapseAll} className="text-xs text-primary hover:underline">Hide all</button>
      </div>

      <div className="space-y-2">
        {itinerary.map((day) => {
          const isOpen = openDays.has(day.day);
          return (
            <div key={day.day} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggle(day.day)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {day.day}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{day.title}</div>
                  {(() => {
                    const parts = [day.overnight, day.elevation, day.trekTime || day.driveTime].filter(Boolean);
                    return parts.length > 0 ? (
                      <p className="text-xs text-muted-foreground mt-1">{parts.join(" – ")}</p>
                    ) : null;
                  })()}
                </div>
                <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-0 space-y-3">
                  <p className="text-sm text-muted-foreground">{day.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    {day.accommodation && (
                      <span className="inline-flex items-center gap-1">
                        <Hotel className="h-3 w-3 text-muted-foreground" /> {day.accommodation}
                      </span>
                    )}
                    {day.distance && (
                      <span className="inline-flex items-center gap-1">
                        <Route className="h-3 w-3 text-muted-foreground" /> {day.distance}
                      </span>
                    )}
                    {day.meals && (
                      <span className="inline-flex items-center gap-1">
                        <Utensils className="h-3 w-3 text-muted-foreground" /> {day.meals}
                      </span>
                    )}
                    {day.overnight && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" /> {day.overnight}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
