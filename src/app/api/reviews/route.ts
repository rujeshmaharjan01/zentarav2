import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ReviewSchema = z.object({
  packageId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const packageId = request.nextUrl.searchParams.get("packageId");
  if (!packageId) {
    return NextResponse.json({ error: "packageId required" }, { status: 400 });
  }
  const reviews = await prisma.review.findMany({
    where: { packageId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
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

  const parsed = ReviewSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { packageId, rating, comment } = parsed.data;

  try {
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        packageId,
        rating,
        comment: comment || null,
      },
    });

    const agg = await prisma.review.aggregate({
      where: { packageId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.package.update({
      where: { id: packageId },
      data: {
        rating: agg._avg.rating || 5,
        reviewCount: agg._count,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "You already reviewed this package" }, { status: 409 });
    }
    throw e;
  }
}
