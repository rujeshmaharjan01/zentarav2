import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const UpdateRoleSchema = z.object({
  role: z.enum(["user", "admin"]),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      bookings: { orderBy: { createdAt: "desc" }, include: { package: { select: { title: true } } } },
      reviews: { orderBy: { createdAt: "desc" }, include: { package: { select: { title: true } } } },
      _count: { select: { bookings: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const parsed = UpdateRoleSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  try {
    const { id } = await params;
    const user = await prisma.user.update({ where: { id }, data: { role: parsed.data.role } });
    return NextResponse.json({ id: user.id, role: user.role });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const msg = e instanceof Error ? e.message : "Failed to update user";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
