"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { CreditCard, Plus, Trash2, Check } from "lucide-react";

export default function PaymentMethodsPage() {
  const { status } = useSession();
  const router = useRouter();

  const { data: paymentMethods, isLoading, refetch } = api.payment.getMyPaymentMethods.useQuery(
    undefined,
    { enabled: status === "authenticated" }
  );

  const setDefaultMutation = api.payment.setDefault.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteMutation = api.payment.delete.useMutation({
    onSuccess: () => refetch(),
  });

  if (status === "loading" || isLoading) {
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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Payment Methods</h1>
            <p className="text-muted-foreground">Manage your saved payment methods</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </div>

        {!paymentMethods || paymentMethods.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No payment methods</h2>
              <p className="text-muted-foreground mb-6">
                Add a payment method for faster checkout
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Payment Method
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method: any) => (
              <Card key={method.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#00E0B0] flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">
                            {method.cardBrand || method.type} •••• {method.cardLast4}
                          </p>
                          {method.isDefault && (
                            <Badge variant="default">Default</Badge>
                          )}
                        </div>
                        {method.expiryMonth && method.expiryYear && (
                          <p className="text-sm text-muted-foreground">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setDefaultMutation.mutate({ paymentMethodId: method.id })
                          }
                          disabled={setDefaultMutation.isPending}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm("Delete this payment method?")) {
                            deleteMutation.mutate({ paymentMethodId: method.id });
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Payment Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Payment methods are securely stored and processed through Stripe.
              Your card details are never stored on our servers.
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Stripe Secure</Badge>
              <Badge variant="secondary">PCI Compliant</Badge>
              <Badge variant="secondary">256-bit Encryption</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
