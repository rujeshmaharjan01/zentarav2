"use client";

import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { MapPin, Utensils, Hotel, Route } from "lucide-react";
import type { ItineraryDay } from "@/lib/types";

interface ItineraryProps {
  itinerary: ItineraryDay[];
}

export function Itinerary({ itinerary }: ItineraryProps) {
  const [value, setValue] = useState<string[]>(["day-1"]);

  function expandAll() {
    setValue(itinerary.map((d) => `day-${d.day}`));
  }

  function collapseAll() {
    setValue([]);
  }

  if (!itinerary.length) return null;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={expandAll} className="text-xs text-primary hover:underline">Show all</button>
        <span className="text-muted-foreground text-xs">·</span>
        <button onClick={collapseAll} className="text-xs text-primary hover:underline">Hide all</button>
      </div>

      <Accordion multiple value={value} onValueChange={setValue}>
        {itinerary.map((day) => (
          <AccordionItem key={day.day} value={`day-${day.day}`} className="border rounded-lg mb-2">
            <AccordionTrigger className="px-4 py-4 min-h-[56px]">
              <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
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
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3">
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
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
