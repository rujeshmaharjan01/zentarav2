import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CalendarDays, DollarSign, Users } from "lucide-react";
import { RevenueChart, BookingsByPackage, RevenueByCategory } from "@/components/admin/charts";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

async function StatsCards() {
  const [totalPackages, totalBookings, totalUsers, revenueResult] = await Promise.all([
    prisma.package.count(),
    prisma.booking.count(),
    prisma.user.count(),
    prisma.booking.aggregate({ _sum: { totalPrice: true }, where: { status: { not: "cancelled" } } }),
  ]);

  const revenue = revenueResult._sum.totalPrice || 0;
  const stats = [
    { title: "Total Packages", value: totalPackages, icon: Package },
    { title: "Total Bookings", value: totalBookings, icon: CalendarDays },
    { title: "Total Users", value: totalUsers, icon: Users },
    { title: "Revenue", value: `$${revenue.toLocaleString()}`, icon: DollarSign },
  ];

  return (
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
  );
}

// ponytail: raw SQL — single query replaces 12 aggregate calls
async function RevenueByMonth() {
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const rows = await prisma.$queryRaw<{ month: string; revenue: number }[]>`
    SELECT to_char("createdAt", 'YYYY-MM') as month, SUM("totalPrice") as revenue
    FROM "Booking"
    WHERE "status" != 'cancelled' AND "createdAt" >= ${twelveMonthsAgo}
    GROUP BY month
    ORDER BY month
  `;

  const revenueMap = new Map(rows.map((r) => [r.month, Number(r.revenue)]));
  const data = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { month: months[d.getMonth()], revenue: revenueMap.get(key) || 0 };
  });

  return <RevenueChart data={data} />;
}

async function BookingsByPackageChart() {
  const raw = await prisma.booking.groupBy({
    by: ["packageId"],
    _count: true,
    orderBy: { _count: { packageId: "desc" } },
    take: 6,
  });

  const packages = await prisma.package.findMany({
    where: { id: { in: raw.map((b) => b.packageId) } },
    select: { id: true, title: true },
  });
  const titleMap = new Map(packages.map((p) => [p.id, p.title]));
  const data = raw.map((b) => ({ name: titleMap.get(b.packageId) || "Unknown", count: b._count }));

  return <BookingsByPackage data={data} />;
}

// ponytail: groupBy + batch lookup replaces full-booking-scan
async function RevenueByCategoryChart() {
  const raw = await prisma.booking.groupBy({
    by: ["packageId"],
    _sum: { totalPrice: true },
    where: { status: { not: "cancelled" } },
  });

  const packages = await prisma.package.findMany({
    where: { id: { in: raw.map((b) => b.packageId) } },
    select: { id: true, category: true },
  });
  const catMap = new Map(packages.map((p) => [p.id, p.category]));

  const categoryRevenue: Record<string, number> = {};
  for (const b of raw) {
    const cat = catMap.get(b.packageId) || "unknown";
    categoryRevenue[cat] = (categoryRevenue[cat] || 0) + Number(b._sum.totalPrice || 0);
  }
  const data = Object.entries(categoryRevenue).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  return <RevenueByCategory data={data} />;
}

async function RecentBookings() {
  const bookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true, package: true },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="text-muted-foreground text-sm">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-medium truncate">{b.user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{b.package.title}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-medium">${b.totalPrice}</p>
                  <p className="text-sm text-muted-foreground">{b.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return <div className="h-[300px] rounded-lg bg-muted animate-pulse" />;
}

export default async function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>

      <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[104px] rounded-lg bg-muted animate-pulse" />)}</div>}>
        <StatsCards />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueByMonth />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <BookingsByPackageChart />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueByCategoryChart />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <RecentBookings />
        </Suspense>
      </div>
    </div>
  );
}
