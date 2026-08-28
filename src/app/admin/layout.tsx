import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "admin") redirect("/");

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminTopbar role={user.role} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
