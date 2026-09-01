"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Menu, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import LogoImage from "@/components/logo";
import { SearchDialog } from "@/components/search-dialog";

const destinations = [
  { name: "Nepal", href: "/destinations/nepal", description: "Himalayan treks, cultural tours & wildlife safaris" },
  { name: "Bhutan", href: "/destinations/bhutan", description: "Land of the Thunder Dragon — monasteries & mountain passes" },
  { name: "Tibet", href: "/destinations/tibet", description: "Roof of the World — ancient cities & sacred lakes" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(pathname !== "/");
  const [navDestinations, setNavDestinations] = useState(destinations);

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    fetch("/api/destinations")
      .then((r) => r.json())
      .then((data: { slug: string; name: string; description: string }[]) => {
        if (data.length) setNavDestinations(data.map((d) => ({ name: d.name, href: `/destinations/${d.slug}`, description: d.description })));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const linkBase = "text-muted-foreground hover:text-foreground transition-colors";
  const linkActive = "text-foreground font-semibold";

  function linkClass(href: string) {
    const active = pathname === href || pathname.startsWith(href + "/");
    return `${active ? linkActive : linkBase} text-sm font-medium`;
  }

  function closeMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <div className="h-px" aria-hidden />

      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-background backdrop-blur-xl border-b shadow-sm" : "bg-transparent border-transparent"}`}>
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <LogoImage className="h-8 w-8" width={32} height={32} />
            <span className="font-bold text-lg tracking-tight text-foreground">Zentara Travels</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    Destinations
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-3 gap-3 p-4 w-100">
                      {navDestinations.map((d) => (
                        <NavigationMenuLink key={d.href} href={d.href} className="block select-none rounded-lg p-3 hover:bg-muted transition-colors">
                          <p className="text-sm font-medium">{d.name}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{d.description}</p>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Link href="/packages" className={`${linkClass("/packages")} px-3 py-2 rounded-lg`}>
              Packages
            </Link>
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-3">
            <SearchDialog />
            <a href="tel:+9779761506543" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="h-3.5 w-3.5" />
              +977-9761506543
            </a>
            <a href="https://wa.me/9779761506543" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" aria-label="WhatsApp">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
            <Link href="/packages" className={buttonVariants()}>Plan Your Trip</Link>
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
                <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>Sign In</Link>
                <Link href="/sign-up" className={buttonVariants()}>Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className={`lg:hidden p-2.5 min-h-11 min-w-11 rounded-lg transition-colors ${isTransparent ? "text-black hover:bg-white/15" : "text-foreground hover:bg-muted"}`} onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" showCloseButton={false} className="w-full max-w-sm p-0">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <div className="flex items-center justify-between px-5 h-16 border-b">
            <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
              <LogoImage className="h-7 w-7" width={28} height={28} />
              <span className="font-bold text-base">Zentara Travels</span>
            </Link>
          </div>

          <nav className="flex-1 opacity-0 overflow-y-auto py-4 px-5 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Destinations</p>
            {navDestinations.map((d) => (
              <Link key={d.href} href={d.href} onClick={closeMenu} className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === d.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}>
                {d.name}
              </Link>
            ))}
            <div className="my-3 h-px bg-border" />
            <Link href="/packages" onClick={closeMenu} className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === "/packages" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}>
              All Packages
            </Link>
            {session && (
              <Link href="/dashboard" onClick={closeMenu} className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === "/dashboard" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}>
                My Bookings
              </Link>
            )}
          </nav>

          <div className="border-t p-5 space-y-3">
            <a href="tel:+9779851402018" className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-muted text-sm font-medium">
              <Phone className="h-4 w-4" />
              +977-9851402018
            </a>
            {session ? (
              <Button variant="outline" className="w-full" onClick={() => { authClient.signOut(); closeMenu(); }}>Sign Out</Button>
            ) : (
              <div className="flex gap-2">
                <Link href="/sign-in" className={buttonVariants({ variant: "outline", className: "flex-1" })} onClick={closeMenu}>Sign In</Link>
                <Link href="/sign-up" className={buttonVariants({ className: "flex-1" })} onClick={closeMenu}>Sign Up</Link>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
