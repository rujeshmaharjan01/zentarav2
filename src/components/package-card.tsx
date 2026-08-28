import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, ArrowRight, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface PackageCardProps {
  id: string;
  title: string;
  destination: string;
  price: number;
  duration: number;
  imageUrl?: string | null;
  maxGroupSize: number;
  tag?: string | null;
  rating?: number;
  reviewCount?: number;
}

export function PackageCard({ id, title, destination, price, duration, imageUrl, maxGroupSize, tag, rating, reviewCount }: PackageCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow">
      <div className="aspect-video relative bg-muted">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
        {tag && (
          <Badge className="absolute top-2 left-2" variant="secondary">
            {tag}
          </Badge>
        )}
        <Badge className="absolute top-2 right-2">${price}</Badge>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-3.5 w-3.5" />
            {destination}
          </div>
        </div>
        {rating !== undefined && reviewCount !== undefined && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span className="text-muted-foreground">· {reviewCount} reviews</span>
          </div>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {duration} days
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            Max {maxGroupSize}
          </div>
        </div>
        <Link href={`/packages/${id}`} className={buttonVariants({ className: "w-full" })}>
          View Details
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
