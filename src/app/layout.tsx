import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Zentara Travels - Nepal Tours & Trekking",
    template: "%s | Zentara Travels",
  },
  description: "Discover Nepal's majestic Himalayas with expert-guided treks and tours. Everest Base Camp, Annapurna Circuit, Chitwan Safari, and more. Book your dream adventure today.",
  keywords: ["Nepal trekking", "Everest Base Camp", "Annapurna Circuit", "Nepal tours", "Himalayan adventure", "Kathmandu", "Pokhara", "Chitwan Safari"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Zentara Travels",
    title: "Zentara Travels - Nepal Tours & Trekking",
    description: "Discover Nepal's majestic Himalayas with expert-guided treks and tours.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zentara Travels - Nepal Tours & Trekking",
    description: "Discover Nepal's majestic Himalayas with expert-guided treks and tours.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased overflow-x-hidden`}>
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
