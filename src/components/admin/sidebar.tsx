"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminLinks } from "@/lib/admin-links";
import LogoImage from "@/components/logo";

function AdminNavLink({
  link,
  onClick,
}: {
  link: (typeof adminLinks)[number];
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === link.href ||
    (link.href !== "/admin" && pathname.startsWith(link.href));

  return (
    <Link
      href={link.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <link.icon className="h-4 w-4" />
      {link.label}
    </Link>
  );
}

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
