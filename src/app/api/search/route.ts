import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  const [packages, destinations] = await Promise.all([
    prisma.package.findMany({
      where: {
        available: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { destinationRel: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      take: 8,
      select: { id: true, title: true, destinationRel: { select: { name: true } } },
    }),
    prisma.destination.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 4,
      select: { slug: true, name: true, description: true },
    }),
  ]);

  const results = [
    ...packages.map((p) => ({ id: p.id, title: p.title, destination: p.destinationRel?.name ?? "", type: "package" as const })),
    ...destinations.map((d) => ({ id: d.slug, title: d.name, destination: d.description, type: "destination" as const })),
  ];

  return NextResponse.json(results);
}
