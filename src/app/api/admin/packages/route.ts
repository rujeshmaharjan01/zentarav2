import { prisma } from "@/lib/prisma";
import { requireAdmin, buildPackageData, PackageSchema } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const packages = await prisma.package.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bookings: true } }, destinationRel: { select: { name: true } } },
  });

  return NextResponse.json(packages);
}

export async function POST(request: Request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const parsed = PackageSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  try {
    const pkg = await prisma.package.create({ data: buildPackageData(parsed.data) });
    return NextResponse.json(pkg, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create package";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
