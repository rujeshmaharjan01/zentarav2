import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Zentara Travels",
  description: "Sign in to your Zentara Travels account to manage your bookings.",
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
