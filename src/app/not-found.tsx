import Link from "next/link";
import { Mountain } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <Mountain className="h-16 w-16 text-muted-foreground/50 mb-6" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl text-muted-foreground mb-6">This page doesn&apos;t exist.</p>
      <Link href="/" className={buttonVariants({ size: "lg" })}>
        Back to Home
      </Link>
    </div>
  );
}
