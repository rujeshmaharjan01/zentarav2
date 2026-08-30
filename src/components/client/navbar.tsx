"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { Menu, X, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import LogoImage from "@/components/logo";

const destinations = [
  { name: "Nepal", href: "/destinations/nepal" },
  { name: "Bhutan", href: "/destinations/bhutan" },
  { name: "Tibet", href: "/destinations/tibet" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(pathname !== "/");

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const linkBase = "text-muted-foreground hover:text-foreground transition-colors";
  const linkActive = "text-foreground font-semibold";

  function linkClass(href: string) {
    const active = pathname === href || pathname.startsWith(href + "/");
    return `${active ? linkActive : linkBase} text-sm font-medium`;
  }

  return (
    <>
      {/* Sentinel for scroll detection — invisible 1px element at top */}
      <div className="h-px" aria-hidden />

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b shadow-sm"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <LogoImage
              className="h-8 w-8"
              width={32}
              height={32}
            />
            <span className="font-bold text-lg tracking-tight text-foreground">
              Zentara Travels
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <div className="relative group">
              <button className={`${linkClass("/destinations")} flex items-center gap-1 px-3 py-2 rounded-lg`}>
                <MapPin className="h-3.5 w-3.5" />
                Destinations
                <svg className="h-3 w-3 transition-transform group-hover:rotate-180 text-muted-foreground" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 4.5L6 7.5L9 4.5" />
                </svg>
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-background/95 backdrop-blur-xl border rounded-xl shadow-xl p-2 min-w-[180px]">
                  {destinations.map((d) => (
                    <Link
                      key={d.href}
                      href={d.href}
                      className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        pathname === d.href
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {d.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/packages" className={`${linkClass("/packages")} px-3 py-2 rounded-lg`}>
              Packages
            </Link>
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+9779851402018"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              +977-9851402018
            </a>

            <Link href="/packages" className={buttonVariants()}>
              Plan Your Trip
            </Link>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "relative h-9 w-9 rounded-full" })}>
                  <Avatar className="h-9 w-9">
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
                <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
                  Sign In
                </Link>
                <Link href="/sign-up" className={buttonVariants()}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isTransparent ? "text-white hover:bg-white/15" : "text-foreground hover:bg-muted"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-background/95 backdrop-blur-xl border-l shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Mobile header */}
              <div className="flex items-center justify-between px-5 h-16 border-b">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <LogoImage className="h-7 w-7" width={28} height={28} />
                  <span className="font-bold text-base">Zentara Travels</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile links */}
              <nav className="flex-1 overflow-y-auto py-4 px-5 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Destinations</p>
                {destinations.map((d, i) => (
                  <Link
                    key={d.href}
                    href={d.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      pathname === d.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {d.name}
                  </Link>
                ))}
                <div className="my-3 h-px bg-border" />
                <Link
                  href="/packages"
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === "/packages" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  All Packages
                </Link>
                {session && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      pathname === "/dashboard" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    My Bookings
                  </Link>
                )}
              </nav>

              {/* Mobile bottom */}
              <div className="border-t p-5 space-y-3">
                <a
                  href="tel:+9779851402018"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-muted text-sm font-medium"
                >
                  <Phone className="h-4 w-4" />
                  +977-9851402018
                </a>
                {session ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => { authClient.signOut(); setMobileOpen(false); }}
                  >
                    Sign Out
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/sign-in" className={buttonVariants({ variant: "outline", className: "flex-1" })} onClick={() => setMobileOpen(false)}>
                      Sign In
                    </Link>
                    <Link href="/sign-up" className={buttonVariants({ className: "flex-1" })} onClick={() => setMobileOpen(false)}>
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
