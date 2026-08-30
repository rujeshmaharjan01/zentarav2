import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Package, CalendarDays, DollarSign, Users, Trophy } from "lucide-react";
import { RevenueChart, BookingsByPackage, RevenueByCategory } from "@/components/admin/charts";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

const statusProgress: Record<string, number> = {
  confirmed: 75,
  pending: 40,
  completed: 100,
  cancelled: 0,
};

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
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{b.user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{b.package.title}</p>
                  <Progress value={statusProgress[b.status] ?? 0} className="h-1.5 mt-2" />
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
  return <Skeleton className="h-[300px] w-full" />;
}

async function TopPackages() {
  const raw = await prisma.booking.groupBy({
    by: ["packageId"],
    _sum: { totalPrice: true },
    _count: true,
    where: { status: { not: "cancelled" } },
    orderBy: { _sum: { totalPrice: "desc" } },
    take: 5,
  });

  const packages = await prisma.package.findMany({
    where: { id: { in: raw.map((b) => b.packageId) } },
    select: { id: true, title: true, category: true },
  });
  const pkgMap = new Map(packages.map((p) => [p.id, p]));

  const data = raw.map((b, i) => {
    const pkg = pkgMap.get(b.packageId);
    return {
      rank: i + 1,
      title: pkg?.title || "Unknown",
      category: pkg?.category || "—",
      revenue: Number(b._sum.totalPrice || 0),
      bookings: b._count,
    };
  });

  const maxRevenue = data[0]?.revenue || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Top Packages by Revenue
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {data.map((d) => (
              <div key={d.rank} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-muted-foreground w-5">{d.rank}.</span>
                    <span className="font-medium truncate">{d.title}</span>
                    <span className="text-xs text-muted-foreground capitalize">({d.category})</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-medium">${d.revenue.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-1 text-xs">({d.bookings})</span>
                  </div>
                </div>
                <Progress value={(d.revenue / maxRevenue) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>

      <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[104px] w-full" />)}</div>}>
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
          <TopPackages />
        </Suspense>
      </div>

      <Suspense fallback={<ChartSkeleton />}>
        <RecentBookings />
      </Suspense>
    </div>
  );
}
