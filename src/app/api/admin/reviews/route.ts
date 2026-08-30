import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, package: true },
  });

  return NextResponse.json(reviews);
}
