import { prisma } from "@/lib/prisma";
import { mapPackageBody } from "@/lib/package-helpers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const pkg = await prisma.package.create({ data: mapPackageBody(body) });
  return NextResponse.json(pkg, { status: 201 });
}
