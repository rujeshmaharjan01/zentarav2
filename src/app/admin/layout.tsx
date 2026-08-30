import { getSessionUser } from "@/lib/admin-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser(await headers());
  if (!user) redirect("/sign-in");

  return (
    <AdminShell role={user.role}>
      {children}
    </AdminShell>
  );
}
