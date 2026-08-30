import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const UpdateDestinationSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  image: z.string().url().optional(),
  heroImage: z.string().url().optional().nullable(),
  continent: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  bestTime: z.string().min(1).optional(),
  travelTips: z.string().optional(),
  places: z.array(z.object({ name: z.string(), description: z.string(), image: z.string() })).optional(),
  gallery: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const destination = await prisma.destination.findUnique({
    where: { id },
    include: { _count: { select: { packages: true } } },
  });

  if (!destination) {
    return NextResponse.json({ error: "Destination not found" }, { status: 404 });
  }

  return NextResponse.json(destination);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const parsed = UpdateDestinationSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  try {
    const destination = await prisma.destination.update({ where: { id }, data: parsed.data });
    return NextResponse.json(destination);
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "A destination with this slug already exists" }, { status: 409 });
    }
    const msg = e instanceof Error ? e.message : "Failed to update destination";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return PUT(request, { params });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  try {
    await prisma.destination.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }
    const msg = e instanceof Error ? e.message : "Failed to delete destination";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
