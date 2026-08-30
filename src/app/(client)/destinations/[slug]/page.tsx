import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/package-card";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const destinations: Record<string, { name: string; description: string; image: string }> = {
  nepal: {
    name: "Nepal",
    description: "Home to 8 of the world's 14 peaks over 8,000m, Nepal is the ultimate Himalayan destination. From the legendary Everest Base Camp to the diverse Annapurna Circuit, ancient temples in Kathmandu to jungle safaris in Chitwan — Nepal offers adventure, culture, and spirituality in equal measure.",
    image: "https://images.pexels.com/photos/6491135/pexels-photo-6491135.jpeg?auto=compress&w=1260&h=750&dpr=1",
  },
  bhutan: {
    name: "Bhutan",
    description: "The Land of the Thunder Dragon is one of the world's most exclusive travel destinations. With its pristine Himalayan landscapes, ancient Buddhist monasteries, and commitment to Gross National Happiness, Bhutan offers a truly unique travel experience.",
    image: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&w=1260&h=750&dpr=1",
  },
  tibet: {
    name: "Tibet",
    description: "The Roof of the World beckons with its vast high-altitude plateaus, ancient Buddhist monasteries, and the iconic Mount Everest north face. Tibet is a destination for those seeking profound cultural encounters and dramatic Himalayan scenery.",
    image: "https://images.pexels.com/photos/36478/amazing-beautiful-beauty-blue.jpg?auto=compress&w=1260&h=750&dpr=1",
  },
};

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dest = destinations[slug];
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
  const dest = destinations[slug];
  if (!dest) notFound();

  const packages = await prisma.package.findMany({
    where: {
      available: true,
      destination: { contains: dest.name, mode: "insensitive" },
    },
    orderBy: { reviewCount: "desc" },
  });

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[300px] sm:h-[400px] flex items-center justify-center overflow-hidden">
        <img src={dest.image} alt={dest.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold [text-shadow:_0_2px_14px_rgb(0_0_0_/_55%)]">
            {dest.name}
          </h1>
          <p className="mt-3 text-white/80 text-lg max-w-2xl mx-auto [text-shadow:_0_2px_10px_rgb(0_0_0_/_45%)]">
            {dest.description}
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
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
        </div>
      </section>
    </div>
  );
}
