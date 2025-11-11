"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { Package, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: orders, isLoading } = api.order.getMyOrders.useQuery(undefined, {
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
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {!orders || orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here!
              </p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item: any) => {
                        const image = item.product.media?.find(
                          (m: any) => m.mediaType === "IMAGE"
                        );
                        return (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 rounded-md overflow-hidden bg-gradient-to-br from-[#4A00E0]/20 to-[#00E0B0]/20 flex items-center justify-center flex-shrink-0">
                              {image ? (
                                <img
                                  src={image.url}
                                  alt={item.product.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium line-clamp-1">
                                {item.product.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Total */}
                    <div className="border-t pt-4 flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1">
                        <Link href={`/orders/${order.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
