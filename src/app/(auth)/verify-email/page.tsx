"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function VerifyEmailPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/sign-in";
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-2">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <CardTitle className="text-2xl">Email Verified!</CardTitle>
          <CardDescription>
            Your email has been verified. Redirecting to sign in...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/sign-in" className={`${buttonVariants({ className: "w-full" })}`}>
            Sign In Now
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
