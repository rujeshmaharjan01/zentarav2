import { prisma } from "@/lib/prisma";
import { requireAdmin, buildPackageData, PackageSchema } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const parsed = PackageSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  try {
    const { id } = await params;
    const pkg = await prisma.package.update({ where: { id }, data: buildPackageData(parsed.data) });
    return NextResponse.json(pkg);
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2025") {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    const msg = e instanceof Error ? e.message : "Failed to update package";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
