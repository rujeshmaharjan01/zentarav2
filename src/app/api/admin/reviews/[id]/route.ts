import { prisma } from "@/lib/prisma";
import { requireAdmin, isPrismaError } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  try {
    const { id } = await params;
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (isPrismaError(e, "P2025")) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    const msg = e instanceof Error ? e.message : "Failed to delete review";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
