import { MapPin, Clock, Mountain, Users, Star } from "lucide-react";

interface TripStatsProps {
  destination: string;
  duration: number;
  maxGroupSize: number;
  rating: number;
  reviewCount: number;
  itinerary?: { elevation?: string | null }[];
}

export function TripStats({ destination, duration, maxGroupSize, rating, reviewCount, itinerary }: TripStatsProps) {
  const maxElevation = itinerary
    ?.map((d) => d.elevation)
    .filter(Boolean)
    .pop();

  return (
    <div className="flex flex-wrap gap-4 text-sm">
      <div className="flex items-center gap-1.5">
        <MapPin className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">{destination}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="h-4 w-4 text-primary" />
        <span>{duration} days</span>
      </div>
      {maxElevation && (
        <div className="flex items-center gap-1.5">
          <Mountain className="h-4 w-4 text-primary" />
          <span>Max {maxElevation}</span>
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <Users className="h-4 w-4 text-primary" />
        <span>Max {maxGroupSize}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span>{rating}</span>
        <span className="text-muted-foreground">({reviewCount} reviews)</span>
      </div>
    </div>
  );
}
