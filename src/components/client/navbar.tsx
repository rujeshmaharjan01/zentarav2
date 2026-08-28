"use client";

import Link from "next/link";
import { useSession, authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import LogoImage from "@/components/logo";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = (
    <>
      <Link href="/packages" className="text-sm font-medium hover:text-primary transition-colors">Packages</Link>
      {session && <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">My Bookings</Link>}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <LogoImage className="h-8 w-8" width={32} height={32} />
          <span>Zentara Travels</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">{navLinks}</nav>

        <div className="hidden md:flex items-center gap-4">
          {session ? (
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
                <DropdownMenuItem render={<Link href="/dashboard" />}>My Bookings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => authClient.signOut()}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>Sign In</Link>
              <Link href="/sign-up" className={buttonVariants()}>Sign Up</Link>
            </div>
          )}
        </div>

        <Button variant="ghost" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t p-4 space-y-4">
          <nav className="flex flex-col gap-3" onClick={() => setMobileOpen(false)}>{navLinks}</nav>
          <div className="pt-4 border-t">
            {session ? (
              <Button variant="outline" className="w-full" onClick={() => { authClient.signOut(); setMobileOpen(false); }}>Sign Out</Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/sign-in" className={buttonVariants({ variant: "outline" })} onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link href="/sign-up" className={buttonVariants()} onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
