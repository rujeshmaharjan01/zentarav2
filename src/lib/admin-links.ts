import { LayoutDashboard, Package, CalendarDays, Users } from "lucide-react";

export const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/users", label: "Users", icon: Users },
];
