import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, package: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bookings</h1>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">No bookings yet.</TableCell>
                </TableRow>
              ) : (
                bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{b.user.name}</p>
                        <p className="text-xs text-muted-foreground">{b.user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{b.package.title}</TableCell>
                    <TableCell>{new Date(b.travelDate).toLocaleDateString()}</TableCell>
                    <TableCell>{b.guests}</TableCell>
                    <TableCell>${b.totalPrice}</TableCell>
                    <TableCell>
                      <Badge variant={b.status === "confirmed" ? "default" : b.status === "cancelled" ? "destructive" : "secondary"}>
                        {b.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
