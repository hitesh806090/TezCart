"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/trpc/react";
import { Package } from "lucide-react";

export default function SellerOrdersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const { data: orderItems, isLoading, refetch } = api.order.getSellerOrders.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const updateStatusMutation = api.order.updateOrderStatus.useMutation({
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
    router.push("/auth/signin");
    return null;
  }

  const handleStatusUpdate = async (orderItemId: string, newStatus: string) => {
    setUpdatingItems((prev) => new Set(prev).add(orderItemId));
    try {
      await updateStatusMutation.mutateAsync({
        orderItemId,
        status: newStatus as any,
      });
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(orderItemId);
        return next;
      });
    }
  };

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
        <h1 className="text-3xl font-bold mb-8">Orders to Fulfill</h1>

        {!orderItems || orderItems.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
              <p className="text-muted-foreground">
                Orders will appear here when customers purchase your products
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orderItems.map((item: any) => {
              const isUpdating = updatingItems.has(item.id);
              const image = item.product.media?.find((m: any) => m.mediaType === "IMAGE");

              return (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{item.order.id.slice(0, 8).toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Customer: {item.order.user.name || item.order.user.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Product Info */}
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-md overflow-hidden bg-gradient-to-br from-[#4A00E0]/20 to-[#00E0B0]/20 flex items-center justify-center flex-shrink-0">
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
                        <div className="flex-1">
                          <p className="font-semibold">{item.product.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                          {item.variant.sku && (
                            <p className="text-xs text-muted-foreground">
                              SKU: {item.variant.sku}
                            </p>
                          )}
                          <p className="text-lg font-bold mt-2">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="flex items-center gap-4 pt-4 border-t">
                        <label className="text-sm font-medium">Update Status:</label>
                        <Select
                          value={item.status}
                          onValueChange={(value) => handleStatusUpdate(item.id, value)}
                          disabled={isUpdating || item.status === "DELIVERED" || item.status === "CANCELLED"}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PROCESSING">Processing</SelectItem>
                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        {isUpdating && (
                          <span className="text-sm text-muted-foreground">Updating...</span>
                        )}
                      </div>

                      {item.status === "DELIVERED" && (
                        <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                          ✓ Payment will be processed and transferred to your account
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
