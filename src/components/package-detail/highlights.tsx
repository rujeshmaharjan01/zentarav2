import { Check } from "lucide-react";

interface HighlightsProps {
  highlights: string[];
}

export function Highlights({ highlights }: HighlightsProps) {
  if (!highlights.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {highlights.map((h, i) => (
        <div key={i} className="flex items-start gap-2">
          <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
          <span className="text-sm">{h}</span>
        </div>
      ))}
    </div>
  );
}
