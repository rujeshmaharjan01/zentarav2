import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PackageForm } from "@/components/admin/package-form";

export const dynamic = "force-dynamic";

export default async function AdminEditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({ where: { id } });
  if (!pkg) notFound();

  const data = {
    title: pkg.title,
    description: pkg.description,
    destinationId: pkg.destinationId,
    imageUrl: pkg.imageUrl,
    category: pkg.category,
    tag: pkg.tag,
    price: pkg.price,
    duration: pkg.duration,
    maxGroupSize: pkg.maxGroupSize,
    rating: pkg.rating,
    available: pkg.available,
    highlights: pkg.highlights,
    itinerary: pkg.itinerary,
    images: pkg.images,
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Edit Package</h1>
      <PackageForm mode="update" packageId={id} initialData={data} />
    </div>
  );
}
