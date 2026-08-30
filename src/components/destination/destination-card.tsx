import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface DestinationCardProps {
  slug: string;
  name: string;
  description: string;
  image: string;
  packageCount: number;
  featured?: boolean;
}

export function DestinationCard({ slug, name, description, image, packageCount, featured }: DestinationCardProps) {
  return (
    <Link href={`/destinations/${slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="relative">
          <AspectRatio ratio={featured ? 16 / 9 : 4 / 3}>
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </AspectRatio>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <div className="flex items-center gap-2">
              <h3 className="text-white text-xl font-bold">{name}</h3>
              {featured && <Badge className="bg-white/20 text-white border-white/30 text-xs">Featured</Badge>}
            </div>
            <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
              <MapPin className="h-3.5 w-3.5" />
              {packageCount} {packageCount === 1 ? "package" : "packages"}
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
