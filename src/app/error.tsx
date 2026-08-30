"use client";

import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-4xl font-bold mb-2">Something went wrong</h1>
      <p className="text-xl text-muted-foreground mb-6">An unexpected error occurred.</p>
      <div className="flex gap-4">
        <button onClick={reset} className={buttonVariants({ variant: "outline", size: "lg" })}>
          Try Again
        </button>
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
