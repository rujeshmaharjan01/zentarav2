import { PackageCard } from "@/components/package-card";
import { prisma } from "@/lib/prisma";

interface SimilarTripsProps {
  category: string;
  currentId: string;
}

export async function SimilarTrips({ category, currentId }: SimilarTripsProps) {
  const packages = await prisma.package.findMany({
    where: { category, available: true, id: { not: currentId } },
    orderBy: { reviewCount: "desc" },
    take: 3,
  });

  if (!packages.length) return null;

  return (
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
  );
}
