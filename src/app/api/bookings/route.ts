import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const BookingSchema = z.object({
  packageId: z.string().min(1),
  travelDate: z.string().min(1),
  guests: z.union([z.number().int().positive(), z.string().min(1)]),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  specialRequests: z.string().optional(),
});

export async function GET(request: NextRequest) {
  let session;
  try {
    session = await auth.api.getSession({ headers: request.headers });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { package: { select: { id: true, title: true, destination: true, imageUrl: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  let session;
  try {
    session = await auth.api.getSession({ headers: request.headers });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = BookingSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { packageId, travelDate, guests, name, email, phone, specialRequests } = parsed.data;
  const guestCount = typeof guests === "string" ? parseInt(guests) : guests;

  const pkg = await prisma.package.findUnique({ where: { id: packageId } });
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  // Availability check
  const date = new Date(travelDate);
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await prisma.booking.aggregate({
    _sum: { guests: true },
    where: {
      packageId,
      status: { not: "cancelled" },
      travelDate: { gte: startOfDay, lte: endOfDay },
    },
  });

  const booked = result._sum.guests || 0;
  if (booked + guestCount > pkg.maxGroupSize) {
    return NextResponse.json(
      { error: `Only ${pkg.maxGroupSize - booked} spot${pkg.maxGroupSize - booked === 1 ? "" : "s"} left for this date` },
      { status: 409 },
    );
  }

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      packageId,
      travelDate: date,
      guests: guestCount,
      totalPrice: pkg.price * guestCount,
      name: name || null,
      email: email || null,
      phone: phone || null,
      specialRequests: specialRequests || null,
    },
  });

  return NextResponse.json(booking);
}
