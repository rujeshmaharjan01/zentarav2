import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Place {
  name: string;
  description: string;
  image: string;
}

interface PlacesProps {
  places: Place[];
}

export function Places({ places }: PlacesProps) {
  if (!places.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {places.map((p) => (
        <Card key={p.name} className="overflow-hidden">
          <AspectRatio ratio={16 / 10}>
            <img src={p.image} alt={p.name} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
          </AspectRatio>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-1">{p.name}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
