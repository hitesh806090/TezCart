"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { Minus, Plus, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const { data: cart, isLoading, refetch } = api.cart.getCart.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const updateQuantityMutation = api.cart.updateItemQuantity.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const removeItemMutation = api.cart.removeItem.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  if (status === "loading" || isLoading) {
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
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You need to be signed in to view your cart
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      await updateQuantityMutation.mutateAsync({
        itemId,
        quantity: newQuantity,
      });
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (confirm("Remove this item from your cart?")) {
      await removeItemMutation.mutateAsync({ itemId });
    }
  };

  const cartItems = cart?.items || [];
  const subtotal = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some products to get started!
              </p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item: any) => {
                const isUpdating = updatingItems.has(item.id);
                const image = item.product.media?.find((m: any) => m.mediaType === "IMAGE");

                return (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="flex-shrink-0"
                        >
                          <div className="w-24 h-24 rounded-md overflow-hidden bg-gradient-to-br from-[#4A00E0]/20 to-[#00E0B0]/20 flex items-center justify-center">
                            {image ? (
                              <img
                                src={image.url}
                                alt={item.product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="font-semibold hover:text-primary transition-colors line-clamp-1"
                          >
                            {item.product.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            by {item.product.seller?.storeName || "Seller"}
                          </p>
                          {item.variant.sku && (
                            <p className="text-xs text-muted-foreground">
                              SKU: {item.variant.sku}
                            </p>
                          )}
                          <p className="text-lg font-bold mt-2">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isUpdating}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={isUpdating || item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (val > 0) {
                                  handleUpdateQuantity(item.id, val);
                                }
                              }}
                              className="w-16 text-center"
                              disabled={isUpdating}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={
                                isUpdating || item.quantity >= item.variant.quantity
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {item.variant.quantity} available
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">
                      Proceed to Checkout
                    </Link>
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Secure checkout powered by Stripe
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
