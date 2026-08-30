import { Badge } from "@/components/ui/badge";

interface HighlightsProps {
  highlights: string[];
}

export function Highlights({ highlights }: HighlightsProps) {
  if (!highlights.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {highlights.map((h) => (
        <Badge key={h} variant="secondary" className="text-sm py-1 px-3">{h}</Badge>
      ))}
    </div>
  );
}
