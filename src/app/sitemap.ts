import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://zentaratravels.com";

  const [packages, destinations] = await Promise.all([
    prisma.package.findMany({
      where: { available: true },
      select: { id: true, createdAt: true },
    }),
    prisma.destination.findMany({
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const packageUrls = packages.map((pkg) => ({
    url: `${baseUrl}/packages/${pkg.id}`,
    lastModified: pkg.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const destinationUrls = destinations.map((d) => ({
    url: `${baseUrl}/destinations/${d.slug}`,
    lastModified: d.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/packages`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/destinations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/sign-in`, lastModified: new Date(), changeFrequency: "never", priority: 0.3 },
    { url: `${baseUrl}/sign-up`, lastModified: new Date(), changeFrequency: "never", priority: 0.3 },
    ...destinationUrls,
    ...packageUrls,
  ];
}
