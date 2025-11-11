"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "You do not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      default:
        return "An error occurred during authentication.";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1A1A2E] to-[#2C2C4A] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-red-500">
            Authentication Error
          </CardTitle>
          <CardDescription className="text-center">
            {getErrorMessage(error)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            Please try signing in again. If the problem persists, contact support.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/signin">
              Back to Sign In
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
