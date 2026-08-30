"use client";

import Link from "next/link";
import { useSession, authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { adminLinks } from "@/lib/admin-links";
import LogoImage from "@/components/logo";
import { usePathname } from "next/navigation";

function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <a href="/" className="flex items-center gap-2 px-2 py-1.5">
          <LogoImage className="h-7 w-7" width={28} height={28} />
          <span className="font-bold text-base">Admin</span>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {adminLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton isActive={isActive} render={<a href={link.href} />}>
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

function AdminTopbar({ role }: { role: string }) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <SidebarTrigger className="lg:hidden" />

      <div className="flex-1" />

      {session && (
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs capitalize">{role}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full">
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
              <DropdownMenuItem render={<a href="/" />}>Back to Site</DropdownMenuItem>
              <DropdownMenuItem render={<a href="/dashboard" />}>My Bookings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => authClient.signOut()}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
}

export default function AdminShell({ children, role }: { children: React.ReactNode; role: string }) {
  return (
    <SidebarProvider>
      <AdminSidebarNav />
      <SidebarInset>
        <AdminTopbar role={role} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
