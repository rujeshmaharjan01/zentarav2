import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  const packages = await prisma.package.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bookings: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Packages</h1>
        <Link href="/admin/packages/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Package
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.title}</TableCell>
                  <TableCell>{pkg.destination}</TableCell>
                  <TableCell>${pkg.price}</TableCell>
                  <TableCell>{pkg.duration} days</TableCell>
                  <TableCell>{pkg._count.bookings}</TableCell>
                  <TableCell>
                    <Badge variant={pkg.available ? "default" : "secondary"}>
                      {pkg.available ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/packages/${pkg.id}/edit`} className="text-sm text-primary hover:underline">
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
