import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { packageId, travelDate, guests } = body;

  if (!packageId || !travelDate || !guests) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const pkg = await prisma.package.findUnique({ where: { id: packageId } });
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      packageId,
      travelDate: new Date(travelDate),
      guests: parseInt(guests),
      totalPrice: pkg.price * parseInt(guests),
    },
  });

  return NextResponse.json(booking);
}
