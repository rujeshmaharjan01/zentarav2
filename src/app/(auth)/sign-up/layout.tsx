import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Zentara Travels",
  description: "Create a Zentara Travels account to start booking your dream adventure.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
