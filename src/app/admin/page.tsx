"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = api.seller.getPendingApplications.useQuery();
  
  // Mock stats - in production, create a dedicated stats endpoint
  const platformStats = {
    totalUsers: 1234,
    totalSellers: 89,
    totalProducts: 456,
    totalOrders: 789,
    revenue: 45678.90,
    pendingApplications: stats?.length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Platform overview and key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Registered accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.totalSellers}</div>
            <p className="text-xs text-muted-foreground">
              Approved sellers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Listed products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              All time orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${platformStats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total GMV
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              vs. last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {platformStats.pendingApplications > 0 && (
        <Card className="border-yellow-500 bg-yellow-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              You have <strong>{platformStats.pendingApplications}</strong> seller application(s) 
              waiting for review.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>• New seller application from John Doe</p>
                <p>• Product "Modern Chair" submitted for approval</p>
                <p>• Order #12345 marked as delivered</p>
                <p>• New user registration: jane@example.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Status</span>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <span className="text-sm font-medium text-green-600">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">CDN</span>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment Gateway</span>
                <span className="text-sm font-medium text-yellow-600">Pending Setup</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
