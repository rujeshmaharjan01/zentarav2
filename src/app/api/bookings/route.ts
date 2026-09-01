import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
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

async function getSession(request: NextRequest) {
  try {
    const s = await auth.api.getSession({ headers: request.headers });
    return s ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { package: { select: { id: true, title: true, imageUrl: true, destinationRel: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = BookingSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { packageId, travelDate, guests, name, email, phone, specialRequests } = parsed.data;
    const guestCount = typeof guests === "string" ? parseInt(guests, 10) : guests;
    if (isNaN(guestCount) || guestCount <= 0) {
      return NextResponse.json({ error: "Invalid guest count" }, { status: 400 });
    }

    const pkg = await prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const date = new Date(travelDate);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const booking = await prisma.$transaction(async (tx) => {
      const result = await tx.booking.aggregate({
        _sum: { guests: true },
        where: {
          packageId,
          status: { not: "cancelled" },
          travelDate: { gte: startOfDay, lte: endOfDay },
        },
      });

      const booked = result._sum.guests || 0;
      if (booked + guestCount > pkg.maxGroupSize) {
        throw new Error(`Only ${pkg.maxGroupSize - booked} spot${pkg.maxGroupSize - booked === 1 ? "" : "s"} left for this date`);
      }

      return tx.booking.create({
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
    });

    const toEmail = email || session.user.email;
    if (toEmail) {
      sendMail({
        to: toEmail,
        subject: `Booking Confirmed — ${pkg.title}`,
        html: `
          <h2>Your booking is confirmed!</h2>
          <p><strong>Package:</strong> ${pkg.title}</p>
          <p><strong>Date:</strong> ${date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          <p><strong>Guests:</strong> ${guestCount}</p>
          <p><strong>Total:</strong> $${booking.totalPrice.toLocaleString()}</p>
          <p><strong>Status:</strong> ${booking.status}</p>
          <br>
          <p>We'll be in touch with next steps. For questions, reply to this email or call +977-9761506543.</p>
          <p>— Zentara Travels</p>
        `,
      }).catch(console.error);
    }

    return NextResponse.json(booking);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("POST /api/bookings error:", message, e);
    if (message.includes("spot") && message.includes("left")) {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
