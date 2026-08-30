import Link from "next/link";
import { Mountain } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <Mountain className="h-16 w-16 text-muted-foreground/50 mb-6" />
      <Alert className="max-w-md">
        <AlertTitle className="text-4xl font-bold">404</AlertTitle>
        <AlertDescription className="text-xl text-muted-foreground mt-2">
          This page doesn&apos;t exist.
        </AlertDescription>
      </Alert>
      <Link href="/" className={`${buttonVariants({ size: "lg" })} mt-6`}>
        Back to Home
      </Link>
    </div>
  );
}
