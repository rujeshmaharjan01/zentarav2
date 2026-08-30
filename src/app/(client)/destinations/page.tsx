import { prisma } from "@/lib/prisma";
import { DestinationCard } from "@/components/destination/destination-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destinations - Zentara Travels",
  description: "Explore our travel destinations across Nepal, Bhutan, Tibet, India, Sri Lanka, and China.",
  openGraph: {
    title: "Destinations - Zentara Travels",
    description: "Explore our travel destinations across Nepal, Bhutan, Tibet, India, Sri Lanka, and China.",
  },
};

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { packages: { where: { available: true } } } } },
  });

  const featured = destinations.filter((d) => d.featured);
  const others = destinations.filter((d) => !d.featured);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Explore Our Destinations</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From the towering Himalayas to tropical beaches, discover the best of Asia with expert-guided tours and treks.
          </p>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Featured Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((d) => (
                <DestinationCard
                  key={d.id}
                  slug={d.slug}
                  name={d.name}
                  description={d.description}
                  image={d.image}
                  packageCount={d._count.packages}
                  featured
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Destinations */}
      {others.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/40">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">All Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((d) => (
                <DestinationCard
                  key={d.id}
                  slug={d.slug}
                  name={d.name}
                  description={d.description}
                  image={d.image}
                  packageCount={d._count.packages}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
