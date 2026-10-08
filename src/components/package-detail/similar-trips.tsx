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
    take: 4,
    include: { destinationRel: { select: { name: true } } },
  });

  if (!packages.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {packages.map((pkg) => (
        <PackageCard
          key={pkg.id}
          id={pkg.id}
          title={pkg.title}
          destination={pkg.destinationRel?.name ?? ""}
          price={pkg.price}
          duration={pkg.duration}
          imageUrl={pkg.imageUrl}
          category={pkg.category}
          tag={pkg.tag}
          rating={pkg.rating}
          reviewCount={pkg.reviewCount}
          highlights={(pkg.highlights as string[]) ?? []}
        />
      ))}
    </div>
  );
}
