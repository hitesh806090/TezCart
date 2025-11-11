import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function ApplicationPendingPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#4A00E0]/10">
            <Clock className="h-8 w-8 text-[#4A00E0]" />
          </div>
          <CardTitle className="text-2xl">Application Submitted!</CardTitle>
          <CardDescription>
            Your seller application is under review
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Thank you for your interest in becoming a TezCart seller. Our team is
            reviewing your application and will get back to you within 2-3 business
            days.
          </p>
          <div className="rounded-md bg-muted p-4 text-left text-sm">
            <p className="font-semibold mb-2">What happens next?</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Identity verification</li>
              <li>Document review</li>
              <li>Email notification of decision</li>
              <li>Access to seller dashboard (if approved)</li>
            </ul>
          </div>
          <Button asChild className="w-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
