"use client";

import { use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { status } = useSession();
  const router = useRouter();

  const { data: order, isLoading } = api.order.getOrderById.useQuery(
    { orderId: resolvedParams.id },
    { enabled: status === "authenticated" }
  );

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

  if (!order) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The order you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "PROCESSING":
        return "bg-blue-500";
      case "SHIPPED":
        return "bg-purple-500";
      case "DELIVERED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>

        <div className="space-y-6">
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any) => {
                  const image = item.product.media?.find(
                    (m: any) => m.mediaType === "IMAGE"
                  );
                  return (
                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="flex-shrink-0"
                      >
                        <div className="w-20 h-20 rounded-md overflow-hidden bg-gradient-to-br from-[#4A00E0]/20 to-[#00E0B0]/20 flex items-center justify-center">
                          {image ? (
                            <img
                              src={image.url}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-muted-foreground" />
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
                        <p className="text-sm text-muted-foreground mt-1">
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                        {item.variant.sku && (
                          <p className="text-xs text-muted-foreground">
                            SKU: {item.variant.sku}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p>{order.shippingAddress}</p>
                  <p>
                    {order.shippingCity}, {order.shippingState}{" "}
                    {order.shippingZipCode}
                  </p>
                  <p>{order.shippingCountry}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      ${order.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      ${order.shippingCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
                {order.status === "DELIVERED" && (
                  <>
                    <Button asChild className="flex-1">
                      <Link href={`/orders/${order.id}/review`}>
                        Write Reviews
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/orders/${order.id}/return/${order.items[0]?.id}`}>
                        Request Return
                      </Link>
                    </Button>
                  </>
                )}
                <Button variant="outline" className="flex-1" disabled>
                  Track Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
