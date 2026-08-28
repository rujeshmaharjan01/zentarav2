import { Check, X } from "lucide-react";

const INCLUDES = [
  "Licensed English-speaking guide",
  "All necessary trekking permits (ACAP/TIMS)",
  "Accommodation in mountain teahouses",
  "Three meals a day while on the trek",
  "Ground transportation as per itinerary",
  "Airport transfers",
  "First aid medical kit",
  "Government taxes and official expenses",
];

const EXCLUDES = [
  "International flights",
  "Nepal visa fee",
  "Travel insurance",
  "Porter service (optional add-on)",
  "Meals in Kathmandu and Pokhara",
  "Hot showers and device charging on trail",
  "Personal trekking gear",
  "Tips for guide and porter",
];

export function IncludeExclude() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Check className="h-5 w-5 text-green-600" /> Included
        </h3>
        <ul className="space-y-2">
          {INCLUDES.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 mt-0.5 shrink-0 text-green-600" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <X className="h-5 w-5 text-destructive" /> Excluded
        </h3>
        <ul className="space-y-2">
          {EXCLUDES.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <X className="h-4 w-4 mt-0.5 shrink-0 text-destructive" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
