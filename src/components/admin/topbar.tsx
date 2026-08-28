"use client";

import Link from "next/link";
import { useSession, authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { adminLinks } from "@/lib/admin-links";
import { AdminNavLink } from "./admin-nav-link";

export function AdminTopbar({ role }: { role: string }) {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Button variant="ghost" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <div className="flex-1" />

      {session && (
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs capitalize">{role}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "relative h-8 w-8 rounded-full" })}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium">{session.user?.name}</p>
                <p className="text-xs text-muted-foreground">{session.user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/" />}>Back to Site</DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/dashboard" />}>My Bookings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => authClient.signOut()}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 z-50 border-b bg-background p-4 lg:hidden">
          <nav className="space-y-1">
            {adminLinks.map((link) => (
              <AdminNavLink key={link.href} link={link} onClick={() => setMobileOpen(false)} />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
