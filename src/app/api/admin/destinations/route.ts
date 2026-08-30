import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const DestinationSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().url(),
  heroImage: z.string().url().optional().nullable(),
  continent: z.string().default("Asia"),
  highlights: z.array(z.string()).default([]),
  bestTime: z.string().min(1),
  travelTips: z.string().default(""),
  places: z.array(z.object({ name: z.string(), description: z.string(), image: z.string() })).default([]),
  gallery: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export async function GET(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const destinations = await prisma.destination.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { packages: true } } },
  });

  return NextResponse.json(destinations);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const parsed = DestinationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  try {
    const destination = await prisma.destination.create({ data: parsed.data });
    return NextResponse.json(destination, { status: 201 });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "A destination with this slug already exists" }, { status: 409 });
    }
    const msg = e instanceof Error ? e.message : "Failed to create destination";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
