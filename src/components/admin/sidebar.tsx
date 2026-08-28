"use client";

import { adminLinks } from "@/lib/admin-links";
import LogoImage from "@/components/logo";
import { AdminNavLink } from "./admin-nav-link";

export function AdminSidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r bg-muted/30">
      <div className="flex items-center gap-2 h-16 px-6 border-b font-bold text-lg">
        <LogoImage className="h-7 w-7" width={28} height={28} />
        <span>Admin</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {adminLinks.map((link) => (
          <AdminNavLink key={link.href} link={link} />
        ))}
      </nav>
    </aside>
  );
}
