"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/trpc/react";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  // Shipping form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("US");

  const { data: cart, isLoading } = api.cart.getCart.useQuery(undefined, {
    enabled: status === "authenticated",
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

  const cartItems = cart?.items || [];
  
  if (cartItems.length === 0) {
    router.push("/cart");
    return null;
  }

  const subtotal = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
  const shipping = 9.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const createOrderMutation = api.order.createOrder.useMutation({
    onSuccess: (order) => {
      router.push(`/orders/${order.id}`);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
      setProcessing(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !address || !city || !state || !zipCode) {
      alert("Please fill in all shipping fields");
      return;
    }

    setProcessing(true);

    // Create order
    createOrderMutation.mutate({
      shippingAddress: `${fullName}, ${address}`,
      shippingCity: city,
      shippingState: state,
      shippingZipCode: zipCode,
      shippingCountry: country,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8 max-w-6xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/cart">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Shipping & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        disabled={processing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={processing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      disabled={processing}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        disabled={processing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        disabled={processing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        required
                        disabled={processing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
                    <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">Stripe Payment Integration</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Secure payment processing will be integrated here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      For demo purposes, click "Place Order" to simulate checkout
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cartItems.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.product.title} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={processing}
                  >
                    {processing ? "Processing..." : "Place Order"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By placing your order, you agree to our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
