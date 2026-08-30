import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");

  if (!dateStr) {
    return NextResponse.json({ error: "date query param required" }, { status: 400 });
  }

  const pkg = await prisma.package.findUnique({ where: { id }, select: { maxGroupSize: true } });
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const date = new Date(dateStr);
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await prisma.booking.aggregate({
    _sum: { guests: true },
    where: {
      packageId: id,
      status: { not: "cancelled" },
      travelDate: { gte: startOfDay, lte: endOfDay },
    },
  });

  const booked = result._sum.guests || 0;
  const available = Math.max(0, pkg.maxGroupSize - booked);

  return NextResponse.json({ available, maxGroupSize: pkg.maxGroupSize, booked });
}
