"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { ShoppingBag, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = api.order.getAllOrders.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading orders...</div>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">All Orders</h1>
        <p className="text-muted-foreground">
          Monitor and manage platform orders
        </p>
      </div>

      {!orders || orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
            <p className="text-muted-foreground">
              Orders will appear here as customers make purchases
            </p>
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
                      Customer: {order.user?.name || order.user?.email}
                    </p>
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
                  {/* Order Summary */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Items</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items?.length || 0} product(s)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total</p>
                      <p className="text-sm text-muted-foreground">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Shipping</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingCity}, {order.shippingState}
                      </p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Order Items:</p>
                    <div className="space-y-2">
                      {order.items?.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{item.product?.title || "Product"}</span>
                          <span className="text-muted-foreground">× {item.quantity}</span>
                          <span className="ml-auto font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          +{order.items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/orders/${order.id}`}>View Full Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
