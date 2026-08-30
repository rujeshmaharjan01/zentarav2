import { prisma } from "@/lib/prisma";
import { requireAdmin, buildPackageData } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const PackageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  destination: z.string().min(1),
  price: z.number().positive(),
  duration: z.number().int().positive(),
  imageUrl: z.string().nullable().optional(),
  category: z.string().optional(),
  tag: z.string().nullable().optional(),
  maxGroupSize: z.number().int().positive().optional(),
  rating: z.number().min(1).max(5).optional(),
  available: z.boolean().optional(),
  highlights: z.array(z.string()).optional(),
  itinerary: z.array(z.record(z.string(), z.string())).optional(),
});

export async function POST(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const parsed = PackageSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  try {
    const pkg = await prisma.package.create({ data: buildPackageData(parsed.data) });
    return NextResponse.json(pkg, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create package";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
