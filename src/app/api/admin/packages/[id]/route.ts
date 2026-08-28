import { prisma } from "@/lib/prisma";
import { mapPackageBody } from "@/lib/package-helpers";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const pkg = await prisma.package.update({ where: { id }, data: mapPackageBody(body) });
  return NextResponse.json(pkg);
}
