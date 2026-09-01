import Link from "next/link";
import LogoImage from "@/components/logo";
import { Mail, Phone, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";

const quickLinks = [
  { label: "Packages", href: "/packages" },
  { label: "Contact", href: "/contact" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
  { label: "My Bookings", href: "/dashboard" },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/zentaratravel/", icon: "instagram" as const },
  { label: "Facebook", href: "https://facebook.com/zentaratravels", icon: "facebook" as const },
  { label: "X", href: "https://x.com/zentaratravels", icon: "x" as const },
  { label: "YouTube", href: "https://youtube.com/@zentaratravels", icon: "youtube" as const },
  { label: "WhatsApp", href: "https://wa.me/9779761506543", icon: "whatsapp" as const },
];

function SocialIcon({ icon }: { icon: "instagram" | "facebook" | "x" | "youtube" | "whatsapp" }) {
  switch (icon) {
    case "instagram":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "x":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      );
  }
}

export async function Footer() {
  const destRecords = await prisma.destination.findMany({ orderBy: { order: "asc" }, select: { slug: true, name: true } });
  const destinations = destRecords.map((d) => ({ label: d.name, href: `/destinations/${d.slug}` }));

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
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 inline-block">
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
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 inline-block">
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
                Kirtipur-10, Kathmandu, Nepal
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                +977-9761506543
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                zentaratravel@gmail.com
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

            <div className="flex items-center gap-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg"
                  aria-label={s.label}
                >
                  <SocialIcon icon={s.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
