"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import Link from "next/link";

export default function SellerApplicationPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sellerType, setSellerType] = useState<"INDIVIDUAL" | "BUSINESS">("INDIVIDUAL");
  const [legalName, setLegalName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");
  const [error, setError] = useState("");

  const applyMutation = api.seller.applyToBecomeSeller.useMutation({
    onSuccess: () => {
      router.push("/seller/application-pending");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              You need to be signed in to apply as a seller
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (sellerType === "INDIVIDUAL" && !dateOfBirth) {
      setError("Date of birth is required for individual sellers");
      return;
    }

    if (sellerType === "BUSINESS" && !businessRegistrationNumber) {
      setError("Business registration number is required");
      return;
    }

    applyMutation.mutate({
      sellerType,
      legalName,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      businessRegistrationNumber: businessRegistrationNumber || undefined,
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Apply to Become a Seller</CardTitle>
          <CardDescription>
            Join our marketplace and start selling your products worldwide
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seller Type Selection */}
            <div className="space-y-3">
              <Label>Seller Type</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSellerType("INDIVIDUAL")}
                  className={`rounded-lg border-2 p-4 text-left transition-colors ${
                    sellerType === "INDIVIDUAL"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-semibold">Individual</div>
                  <div className="text-sm text-muted-foreground">
                    Selling as a person
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSellerType("BUSINESS")}
                  className={`rounded-lg border-2 p-4 text-left transition-colors ${
                    sellerType === "BUSINESS"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-semibold">Business</div>
                  <div className="text-sm text-muted-foreground">
                    Registered company
                  </div>
                </button>
              </div>
            </div>

            {/* Legal Name */}
            <div className="space-y-2">
              <Label htmlFor="legalName">
                {sellerType === "INDIVIDUAL" ? "Full Legal Name" : "Business Name"}
              </Label>
              <Input
                id="legalName"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder={
                  sellerType === "INDIVIDUAL"
                    ? "John Doe"
                    : "Acme Corporation"
                }
                required
                disabled={applyMutation.isPending}
              />
            </div>

            {/* Individual-specific fields */}
            {sellerType === "INDIVIDUAL" && (
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  disabled={applyMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  You must be 18 or older to sell on TezCart
                </p>
              </div>
            )}

            {/* Business-specific fields */}
            {sellerType === "BUSINESS" && (
              <div className="space-y-2">
                <Label htmlFor="businessRegistrationNumber">
                  Business Registration Number
                </Label>
                <Input
                  id="businessRegistrationNumber"
                  value={businessRegistrationNumber}
                  onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                  placeholder="123456789"
                  required
                  disabled={applyMutation.isPending}
                />
              </div>
            )}

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4 text-sm">
                <p className="font-semibold mb-2">Next Steps:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Your application will be reviewed by our team</li>
                  <li>We&apos;ll verify your identity and information</li>
                  <li>You&apos;ll be notified via email within 2-3 business days</li>
                  <li>Once approved, you can start listing products</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={applyMutation.isPending}
              >
                {applyMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
