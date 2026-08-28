"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminLinks } from "@/lib/admin-links";

export function AdminNavLink({
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
