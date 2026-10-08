import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Zentara Travels",
  description: "Get in touch with Zentara Travels. Phone, email, WhatsApp, and contact form for booking inquiries and travel planning.",
  robots: "noindex",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
