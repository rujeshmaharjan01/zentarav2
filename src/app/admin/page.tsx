import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CalendarDays, DollarSign, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalPackages, totalBookings, totalUsers, revenueResult] = await Promise.all([
    prisma.package.count(),
    prisma.booking.count(),
    prisma.user.count(),
    prisma.booking.aggregate({ _sum: { totalPrice: true }, where: { status: { not: "cancelled" } } }),
  ]);

  const revenue = revenueResult._sum.totalPrice || 0;

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true, package: true },
  });

  const stats = [
    { title: "Total Packages", value: totalPackages, icon: Package },
    { title: "Total Bookings", value: totalBookings, icon: CalendarDays },
    { title: "Total Users", value: totalUsers, icon: Users },
    { title: "Revenue", value: `$${revenue.toLocaleString()}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-sm">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{b.user.name}</p>
                    <p className="text-sm text-muted-foreground">{b.package.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${b.totalPrice}</p>
                    <p className="text-sm text-muted-foreground">{b.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
