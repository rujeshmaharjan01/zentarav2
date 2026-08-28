import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { package: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">Manage your travel bookings</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No bookings yet. <a href="/packages" className="text-primary hover:underline">Browse packages</a> to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{booking.package.title}</CardTitle>
                  <Badge variant={booking.status === "confirmed" ? "default" : booking.status === "cancelled" ? "destructive" : "secondary"}>
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {booking.package.destination}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(booking.travelDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                </div>
                <div className="pt-2 border-t font-semibold">
                  Total: ${booking.totalPrice}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
