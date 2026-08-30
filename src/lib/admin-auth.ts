import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export const PackageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  destination: z.string().min(1),
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

interface PackageInput {
  title: string;
  description: string;
  destination: string;
  destinationId?: string | null;
  price: number;
  duration: number;
  imageUrl?: string | null;
  category?: string;
  tag?: string | null;
  maxGroupSize?: number;
  rating?: number;
  available?: boolean;
  highlights?: unknown;
  itinerary?: unknown;
  images?: string[];
}

export function buildPackageData(b: PackageInput) {
  return {
    title: b.title, description: b.description, destination: b.destination,
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
  const user = await getSessionUser(request.headers);
  if (!user) {
    const session = await auth.api.getSession({ headers: request.headers });
    const status = session ? 403 : 401;
    const msg = session ? "Forbidden" : "Unauthorized";
    return { user: null, error: NextResponse.json({ error: msg }, { status }) };
  }
  return { user, error: null };
}
