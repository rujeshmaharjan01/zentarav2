import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export const PackageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  destinationId: z.string().nullable().optional(),
  price: z.number().positive(),
  duration: z.number().int().positive(),
  imageUrl: z.string().nullable().optional(),
  category: z.string().optional(),
  tag: z.string().nullable().optional(),
  maxGroupSize: z.number().int().positive().optional(),
  rating: z.number().min(1).max(5).optional(),
  available: z.boolean().optional(),
  highlights: z.array(z.string()).optional(),
  itinerary: z.array(z.record(z.string(), z.string().nullable())).optional(),
  images: z.array(z.string()).optional(),
});

type PackageInput = z.infer<typeof PackageSchema>;

export function buildPackageData(b: PackageInput) {
  return {
    title: b.title, description: b.description,
    destinationId: b.destinationId || null,
    imageUrl: b.imageUrl || null, category: b.category || "trek", tag: b.tag || null,
    price: b.price, duration: b.duration, maxGroupSize: b.maxGroupSize || 20,
    rating: b.rating ?? 5, available: b.available ?? true,
    highlights: b.highlights || [], itinerary: b.itinerary || [],
    images: b.images || [],
  };
}

export async function getSessionUser(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function requireAdmin(request: Request) {
  let session;
  try {
    session = await auth.api.getSession({ headers: request.headers });
  } catch {
    return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!session) {
    return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "admin") {
    return { user: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user, error: null };
}

export function isPrismaError(e: unknown, code: string): boolean {
  return !!e && typeof e === "object" && "code" in e && (e as Record<string, unknown>).code === code;
}
