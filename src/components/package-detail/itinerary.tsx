"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Hotel, MapPin, Route, Utensils } from "lucide-react";
import type { ItineraryDay } from "@/lib/types";

export function Itinerary({ itinerary }: { itinerary: ItineraryDay[] }) {
  const [openDays, setOpenDays] = useState<string[]>(["day-1"]);

  if (!itinerary.length) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-xs">
        <button
          type="button"
          onClick={() => setOpenDays(itinerary.map((d) => `day-${d.day}`))}
          className="text-primary hover:underline"
        >
          Show all
        </button>
        <span className="text-muted-foreground">·</span>
        <button
          type="button"
          onClick={() => setOpenDays([])}
          className="text-primary hover:underline"
        >
          Hide all
        </button>
      </div>

      <Accordion multiple value={openDays} onValueChange={setOpenDays}>
        {itinerary.map((day) => {
          const meta = [
            day.overnight,
            day.elevation,
            day.trekTime || day.driveTime,
          ]
            .filter(Boolean)
            .join(" – ");

          return (
            <AccordionItem
              key={day.day}
              value={`day-${day.day}`}
              className="border rounded-lg mb-2"
            >
              <AccordionTrigger className="items-center px-4 py-4 min-h-14">
                <span className="flex flex-1 min-w-0 items-center gap-2 text-left">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {day.day}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">
                      {day.title}
                    </span>
                    {meta && (
                      <span className="text-xs text-muted-foreground">
                        {meta}
                      </span>
                    )}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <p className="text-sm text-muted-foreground">
                  {day.description}
                </p>
                <div className="flex flex-wrap gap-3 text-xs mt-3">
                  {day.accommodation && (
                    <span className="inline-flex items-center gap-1">
                      <Hotel className="h-3 w-3 text-muted-foreground" />
                      {day.accommodation}
                    </span>
                  )}
                  {day.distance && (
                    <span className="inline-flex items-center gap-1">
                      <Route className="h-3 w-3 text-muted-foreground" />
                      {day.distance}
                    </span>
                  )}
                  {day.meals && (
                    <span className="inline-flex items-center gap-1">
                      <Utensils className="h-3 w-3 text-muted-foreground" />
                      {day.meals}
                    </span>
                  )}
                  {day.overnight && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {day.overnight}
                    </span>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
