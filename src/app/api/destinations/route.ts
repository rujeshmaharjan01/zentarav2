import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const destinations = await prisma.destination.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, name: true, description: true, image: true },
  });
  return NextResponse.json(destinations);
}
