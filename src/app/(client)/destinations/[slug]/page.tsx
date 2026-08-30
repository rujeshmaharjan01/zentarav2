import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/package-card";
import { Highlights } from "@/components/destination/highlights";
import { Places } from "@/components/destination/places";
import { TravelTips } from "@/components/destination/travel-tips";
import { PhotoGallery } from "@/components/destination/photo-gallery";
import { notFound } from "next/navigation";
import { Calendar, Globe } from "lucide-react";
import type { Metadata } from "next";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dest = await prisma.destination.findUnique({ where: { slug } });
  if (!dest) return {};
  return {
    title: `${dest.name} Tours & Treks - Zentara Travels`,
    description: dest.description.slice(0, 160),
    openGraph: {
      title: `${dest.name} Tours & Treks - Zentara Travels`,
      description: dest.description.slice(0, 160),
      images: [dest.image],
    },
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params;

  const dest = await prisma.destination.findUnique({ where: { slug } });
  if (!dest) notFound();

  const packages = await prisma.package.findMany({
    where: { available: true, destinationId: dest.id },
    orderBy: { reviewCount: "desc" },
  });

  const highlights = dest.highlights as string[];
  const places = (dest.places as { name: string; description: string; image: string }[]) || [];
  const gallery = (dest.gallery as string[]) || [];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section aria-labelledby="dest-hero-heading" className="relative h-[300px] sm:h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src={dest.heroImage || dest.image}
          alt={dest.name}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 text-center px-4">
          <h1 id="dest-hero-heading" className="text-white text-4xl sm:text-5xl md:text-6xl font-bold [text-shadow:_0_2px_14px_rgb(0_0_0_/_55%)]">
            {dest.name}
          </h1>
          <p className="mt-3 text-white/80 text-lg max-w-2xl mx-auto [text-shadow:_0_2px_10px_rgb(0_0_0_/_45%)]">
            {dest.description}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16 space-y-16">
        {/* Quick Stats */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Globe className="h-4 w-4" />
            <span>{dest.continent}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>Best Time: {dest.bestTime.split(".")[0]}</span>
          </div>
          <span>{packages.length} {packages.length === 1 ? "package" : "packages"}</span>
        </div>

        {/* Highlights */}
        {highlights.length > 0 && (
          <section aria-labelledby="dest-highlights-heading">
            <h2 id="dest-highlights-heading" className="text-2xl font-bold mb-4">Highlights</h2>
            <Highlights highlights={highlights} />
          </section>
        )}

        {/* Top Places */}
        {places.length > 0 && (
          <section aria-labelledby="dest-places-heading">
            <h2 id="dest-places-heading" className="text-2xl font-bold mb-4">Top Places to Visit</h2>
            <Places places={places} />
          </section>
        )}

        {/* Best Time to Visit */}
        {dest.bestTime && (
          <section aria-labelledby="dest-besttime-heading">
            <h2 id="dest-besttime-heading" className="text-2xl font-bold mb-4">Best Time to Visit</h2>
            <p className="text-muted-foreground leading-relaxed">{dest.bestTime}</p>
          </section>
        )}

        {/* Travel Tips */}
        {dest.travelTips && (
          <section aria-labelledby="dest-tips-heading">
            <h2 id="dest-tips-heading" className="text-2xl font-bold mb-4">Travel Tips</h2>
            <TravelTips content={dest.travelTips} />
          </section>
        )}

        {/* Photo Gallery */}
        {gallery.length > 0 && (
          <section aria-labelledby="dest-gallery-heading">
            <h2 id="dest-gallery-heading" className="text-2xl font-bold mb-4">Photo Gallery</h2>
            <PhotoGallery images={gallery} name={dest.name} />
          </section>
        )}

        {/* Packages */}
        <section aria-labelledby="dest-packages-heading">
          <h2 id="dest-packages-heading" className="text-2xl font-bold mb-6">
            {dest.name} Packages ({packages.length})
          </h2>
          {packages.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              No packages available for {dest.name} yet. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  id={pkg.id}
                  title={pkg.title}
                  destination={pkg.destination}
                  price={pkg.price}
                  duration={pkg.duration}
                  imageUrl={pkg.imageUrl}
                  maxGroupSize={pkg.maxGroupSize}
                  tag={pkg.tag}
                  rating={pkg.rating}
                  reviewCount={pkg.reviewCount}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
