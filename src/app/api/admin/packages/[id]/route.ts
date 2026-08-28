import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const pkg = await prisma.package.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      destination: body.destination,
      imageUrl: body.imageUrl || null,
      category: body.category || "trek",
      tag: body.tag || null,
      price: body.price,
      duration: body.duration,
      maxGroupSize: body.maxGroupSize || 20,
      rating: body.rating ?? 5,
      available: body.available ?? true,
      highlights: body.highlights || [],
      itinerary: body.itinerary || [],
    },
  });

  return NextResponse.json(pkg);
}
