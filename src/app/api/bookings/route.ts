import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const BookingSchema = z.object({
  packageId: z.string().min(1),
  travelDate: z.string().min(1),
  guests: z.union([z.number().int().positive(), z.string().min(1)]),
});

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = BookingSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { packageId, travelDate, guests } = parsed.data;
  const guestCount = typeof guests === "string" ? parseInt(guests) : guests;

  const pkg = await prisma.package.findUnique({ where: { id: packageId } });
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      packageId,
      travelDate: new Date(travelDate),
      guests: guestCount,
      totalPrice: pkg.price * guestCount,
    },
  });

  return NextResponse.json(booking);
}
