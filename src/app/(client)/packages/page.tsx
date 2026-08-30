import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/package-card";
import { SearchForm } from "./search-form";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Travel Packages - Zentara Travels",
  description: "Browse our curated collection of Nepal treks, tours, and adventure packages. Find your perfect Himalayan getaway.",
  openGraph: {
    title: "Travel Packages - Zentara Travels",
    description: "Browse our curated collection of Nepal treks, tours, and adventure packages.",
  },
};

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const packages = await prisma.package.findMany({
    where: {
      available: true,
      ...(q
        ? {
            OR: [
              { destination: { contains: q, mode: "insensitive" } },
              { title: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {q ? `Results for "${q}"` : "Travel Packages"}
          </h1>
          <p className="text-muted-foreground">
            {q
              ? `${packages.length} package${packages.length !== 1 ? "s" : ""} found`
              : "Find your perfect getaway from our curated collection"}
          </p>
        </div>
        <SearchForm defaultValue={q ?? ""} />
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {q ? (
            <>
              No packages match &quot;{q}&quot;.{" "}
              <a href="/packages" className="text-primary hover:underline">
                View all packages
              </a>
            </>
          ) : (
            "No packages available yet. Check back soon!"
          )}
        </div>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
