import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Zentara Travels",
  description: "Sign in to your Zentara Travels account to manage bookings, track trips, and access exclusive deals.",
  robots: "noindex",
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
