"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const faqCategories = [
  {
    category: "General Information",
    questions: [
      { q: "What is the best time to do this trek?", a: "Spring (March to May) and autumn (September to November) offer the best weather, clear skies, and ideal trekking conditions." },
      { q: "Do I need prior trekking experience?", a: "No prior experience is required for moderate treks. A reasonable level of fitness and preparation is sufficient. We recommend cardio exercises and stair climbing before the trek." },
      { q: "What fitness level is required?", a: "You should be in good health and comfortable walking 5-7 hours a day. Strong legs, a healthy heart, and a positive mindset are key." },
      { q: "Is it safe to trek?", a: "Yes, with a licensed guide and proper preparation. Our guides are trained in first aid and altitude awareness. Always follow their instructions." },
    ],
  },
  {
    category: "Guide & Permits",
    questions: [
      { q: "Do I need a guide?", a: "Yes, a licensed guide is required for all treks in Nepal since April 2023. Our guides are experienced, English-speaking, and trained in safety." },
      { q: "What permits do I need?", a: "We handle all necessary permits including conservation area permits and TIMS cards. You just need to provide a passport copy and photo." },
    ],
  },
  {
    category: "Accommodation & Food",
    questions: [
      { q: "What kind of accommodation is available?", a: "You'll stay in mountain teahouses — basic but comfortable lodges with twin beds and shared bathrooms. Lower elevations may have attached bathrooms." },
      { q: "What food is available on the trek?", a: "Teahouses offer a variety of meals including Nepali dal bhat, pasta, noodles, pancakes, soups, and eggs. Vegetarian options are widely available." },
      { q: "Is drinking water safe?", a: "Tap water is not safe to drink untreated. Use purification tablets, a filter bottle, or buy boiled water from teahouses." },
    ],
  },
  {
    category: "Cost & Payment",
    questions: [
      { q: "What is included in the trek price?", a: "Guide, permits, accommodation, meals on the trek, and transportation as per itinerary are included. Porter service can be added during booking." },
      { q: "How much extra money should I carry?", a: "Budget $15-20 per day in Nepali Rupees for drinks, snacks, hot showers, Wi-Fi, and device charging. Carry cash — no ATMs on the trail." },
    ],
  },
  {
    category: "Safety & Altitude",
    questions: [
      { q: "How do I prevent altitude sickness?", a: "Ascend gradually, stay hydrated (3-4 liters/day), avoid alcohol, eat well, and listen to your body. Carry Diamox as a precaution." },
      { q: "What if there's a medical emergency?", a: "Our guides carry first aid kits and are trained in emergency response. For serious cases, helicopter evacuation can be arranged through your travel insurance." },
    ],
  },
];

export function FaqSection() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {faqCategories.map((cat) => (
        <div key={cat.category}>
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3">{cat.category}</h3>
          <div className="space-y-1">
            {cat.questions.map((item) => {
              const id = `${cat.category}-${item.q}`;
              const isOpen = openItems.has(id);
              return (
                <div key={id} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggle(id)}
                    className="w-full flex items-center justify-between gap-3 p-3 text-left text-sm hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">{item.q}</span>
                    <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-3">
                      <p className="text-sm text-muted-foreground">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
