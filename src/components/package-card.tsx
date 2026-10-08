import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface PackageCardProps {
  id: string;
  title: string;
  destination: string;
  price: number;
  duration: number;
  imageUrl?: string | null;
  category?: string;
  tag?: string | null;
  rating?: number;
  reviewCount?: number;
  highlights?: string[];
}

export function PackageCard({ id, title, destination, price, duration, imageUrl, category, tag, rating, reviewCount, highlights }: PackageCardProps) {
  const topHighlights = highlights?.slice(0, 3);

  return (
    <Card className="ring-0 bg-transparent py-0 rounded-xl overflow-hidden">
      <Link
        href={`/packages/${id}`}
        className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`View ${title} — ${destination}`}
      >
        {/* Image */}
        <div className="relative aspect-[3/2] sm:aspect-[4/3] xl:aspect-[3/2] overflow-hidden rounded-xl bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-0 mt-3">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <CardTitle className="text-sm xl:text-base leading-snug line-clamp-1">
                {title}
              </CardTitle>
              <CardDescription className="mt-0.5 flex items-center gap-1.5 line-clamp-1 text-xs xl:text-sm">
                {destination}
                {category && (
                  <span className="shrink-0 text-xs bg-muted px-1.5 py-0.5 rounded-md capitalize">
                    {category}
                  </span>
                )}
              </CardDescription>
            </div>
            {rating !== undefined && reviewCount !== undefined && reviewCount > 0 && (
              <div className="flex items-center gap-1 shrink-0 text-xs xl:text-sm">
                <Star className="h-3 w-3 xl:h-3.5 xl:w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{rating}</span>
                <span className="text-muted-foreground">({reviewCount})</span>
              </div>
            )}
          </div>

          {/* Highlights */}
          {topHighlights && topHighlights.length > 0 && (
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-1">
              {topHighlights.join(" · ")}
            </p>
          )}

          {/* Price */}
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-sm xl:text-base">
              <span className="font-bold text-base xl:text-lg">${price.toLocaleString()}</span>
              <span className="text-muted-foreground font-normal text-xs xl:text-sm"> / person</span>
            </p>
            <p className="text-xs xl:text-sm text-muted-foreground">{duration} {duration === 1 ? "day" : "days"}</p>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

export function PackageCardSkeleton() {
  return (
    <Card className="ring-0 bg-transparent py-0 rounded-xl overflow-hidden">
      <div className="animate-pulse">
        <div className="aspect-[3/2] sm:aspect-[4/3] xl:aspect-[3/2] rounded-xl bg-muted" />
        <CardContent className="p-0 mt-3 space-y-2">
          <div className="h-3.5 xl:h-4 bg-muted rounded w-3/4" />
          <div className="h-2.5 xl:h-3 bg-muted rounded w-1/2" />
          <div className="h-2.5 xl:h-3 bg-muted rounded w-2/3 mt-1.5" />
          <div className="flex justify-between items-baseline mt-2">
            <div className="h-4 xl:h-5 bg-muted rounded w-1/4" />
            <div className="h-2.5 xl:h-3 bg-muted rounded w-1/6" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
