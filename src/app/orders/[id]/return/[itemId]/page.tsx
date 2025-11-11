"use client";

import { use, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/trpc/react";
import { ArrowLeft, Package } from "lucide-react";

export default function RequestReturnPage({
  params,
}: {
  params: Promise<{ id: string; itemId: string }>;
}) {
  const resolvedParams = use(params);
  const { status } = useSession();
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const createReturnMutation = api.return.create.useMutation({
    onSuccess: () => {
      router.push("/returns");
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
    router.push("/auth/signin");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason) {
      alert("Please select a reason");
      return;
    }

    if (description.length < 10) {
      alert("Description must be at least 10 characters");
      return;
    }

    createReturnMutation.mutate({
      orderItemId: resolvedParams.itemId,
      reason: reason as any,
      description,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8 max-w-2xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/orders/${resolvedParams.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Order
          </Link>
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Request Return</h1>
            <p className="text-muted-foreground">
              Please provide details about why you want to return this item
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Return Request Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Reason */}
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Return *</Label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEFECTIVE">Defective or Damaged</SelectItem>
                      <SelectItem value="WRONG_ITEM">Wrong Item Received</SelectItem>
                      <SelectItem value="NOT_AS_DESCRIBED">Not as Described</SelectItem>
                      <SelectItem value="CHANGED_MIND">Changed My Mind</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please provide details about the issue..."
                    rows={5}
                    maxLength={500}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {description.length}/500 characters (minimum 10)
                  </p>
                </div>

                {/* Info */}
                <div className="rounded-lg bg-muted p-4 text-sm">
                  <p className="font-medium mb-2">Return Policy:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Returns must be requested within 30 days of delivery</li>
                    <li>• Items must be unused and in original packaging</li>
                    <li>• Seller will review your request within 2-3 business days</li>
                    <li>• Refund will be processed after item is received and inspected</li>
                  </ul>
                </div>

                {/* Submit */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createReturnMutation.isPending}
                    className="flex-1"
                  >
                    {createReturnMutation.isPending ? "Submitting..." : "Submit Return Request"}
                  </Button>
                </div>

                {createReturnMutation.isError && (
                  <p className="text-sm text-red-600 text-center">
                    {createReturnMutation.error.message}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
