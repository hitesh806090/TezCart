"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { DollarSign, Package, ShoppingBag, TrendingUp, Star } from "lucide-react";

export default function SellerAnalyticsPage() {
  const { data: stats, isLoading } = api.analytics.getSellerStats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sales Analytics</h1>
          <p className="text-muted-foreground">Track your store performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Net: ${stats.netRevenue.toFixed(2)} (after 10% fee)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {stats.deliveredOrders} delivered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Listed</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.productCount}</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                {stats.processingOrders} processing
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Breakdown */}
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending</span>
                  <Badge className="bg-yellow-500">{stats.pendingOrders}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Processing</span>
                  <Badge className="bg-blue-500">{stats.processingOrders}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Shipped</span>
                  <Badge className="bg-purple-500">{stats.shippedOrders}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Delivered</span>
                  <Badge className="bg-green-500">{stats.deliveredOrders}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gross Revenue</span>
                  <span className="font-semibold">${stats.totalRevenue.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Platform Fee (10%)</span>
                  <span className="text-red-600">-${stats.platformFee.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-sm font-semibold">Net Revenue</span>
                  <span className="font-bold text-green-600">
                    ${stats.netRevenue.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No sales data yet
              </p>
            ) : (
              <div className="space-y-4">
                {stats.topProducts.map((item: any, index: number) => {
                  const image = item.product?.media?.find((m: any) => m.mediaType === "IMAGE");
                  return (
                    <div key={item.productId} className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-gradient-to-br from-[#4A00E0]/20 to-[#00E0B0]/20 flex items-center justify-center flex-shrink-0">
                        {image ? (
                          <img
                            src={image.url}
                            alt={item.product?.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{item.product?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} units sold
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${item.revenue.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">revenue</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No orders yet
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.slice(0, 5).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">
                        Order #{order.order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        ${(order.price * order.quantity).toFixed(2)}
                      </p>
                      <Badge className="text-xs">{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
