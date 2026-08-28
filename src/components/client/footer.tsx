import Link from "next/link";
import LogoImage from "@/components/logo";
import { Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { label: "Packages", href: "/packages" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
  { label: "My Bookings", href: "/dashboard" },
];

const destinations = [
  { label: "Nepal", href: "/packages?destination=Nepal" },
  { label: "Bhutan", href: "/packages?destination=Bhutan" },
  { label: "Tibet", href: "/packages?destination=Tibet" },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com/zentaratravels" },
  { label: "Facebook", href: "https://facebook.com/zentaratravels" },
  { label: "X", href: "https://x.com/zentaratravels" },
  { label: "YouTube", href: "https://youtube.com/@zentaratravels" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <LogoImage className="h-7 w-7" width={28} height={28} />
              <span>Zentara Travels</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover amazing travel destinations across Nepal, Bhutan, and Tibet.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Destinations</h3>
            <ul className="space-y-2">
              {destinations.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                Kathmandu, Nepal
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                +977-9851402018
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                info@zentaratravels.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Zentara Travels. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-medium">Secured Payment</span>
              <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-bold">VISA</span>
              <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-bold">MC</span>
              <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-bold">AMEX</span>
            </div>

            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
