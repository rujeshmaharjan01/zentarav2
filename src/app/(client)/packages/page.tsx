import { prisma } from "@/lib/prisma";
import { PackageCard } from "@/components/package-card";
import { SearchForm } from "./search-form";
import { CategoryFilter } from "./category-filter";
import { PriceFilter } from "./price-filter";
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Travel Packages - Zentara Travels",
  description:
    "Browse our curated collection of Nepal treks, tours, and adventure packages. Find your perfect Himalayan getaway.",
  openGraph: {
    title: "Travel Packages - Zentara Travels",
    description:
      "Browse our curated collection of Nepal treks, tours, and adventure packages.",
  },
};

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const { q, category, minPrice, maxPrice } = await searchParams;

  const minP = minPrice ? parseInt(minPrice) : undefined;
  const maxP = maxPrice ? parseInt(maxPrice) : undefined;

  const packages = await prisma.package.findMany({
    where: {
      available: true,
      ...(q
        ? {
            OR: [
              {
                destinationRel: { name: { contains: q, mode: "insensitive" } },
              },
              { title: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(category && category !== "all" ? { category } : {}),
      ...(minP !== undefined || maxP !== undefined
        ? {
            price: {
              ...(minP !== undefined ? { gte: minP } : {}),
              ...(maxP !== undefined ? { lte: maxP } : {}),
            },
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { destinationRel: { select: { name: true } } },
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
        <Suspense fallback={<div className="flex flex-col sm:flex-row gap-4"><div className="h-10 w-48 bg-muted animate-pulse rounded-lg" /><div className="h-10 w-64 bg-muted animate-pulse rounded-lg" /></div>}>
          <div className="flex flex-col sm:flex-row gap-4">
            <CategoryFilter />
            <PriceFilter />
          </div>
        </Suspense>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {q ? (
            <>
              No packages match &quot;{q}&quot;.{" "}
              <Link href="/packages" className="text-primary hover:underline">
                View all packages
              </Link>
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
              destination={pkg.destinationRel?.name ?? ""}
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
  );
}
