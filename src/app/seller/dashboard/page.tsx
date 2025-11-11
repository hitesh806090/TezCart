"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Package, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

export default function SellerDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const { data: profile, isLoading } = api.seller.getMyProfile.useQuery(undefined, {
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

  if (!profile) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not a Seller</CardTitle>
            <CardDescription>
              You need to apply to become a seller first
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/seller/apply">Apply Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile.storeName || profile.legalName || "Seller"}!
          </p>
        </div>

        {/* Application Status Banner */}
        {profile.applicationStatus === "UNDER_REVIEW" && (
          <Card className="mb-8 border-yellow-500 bg-yellow-500/10">
            <CardHeader>
              <CardTitle className="text-yellow-600">Application Under Review</CardTitle>
              <CardDescription>
                Your seller application is being reviewed. You&apos;ll be able to list
                products once approved.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {profile.applicationStatus === "APPROVED" && !profile.isPublic && (
          <Card className="mb-8 border-blue-500 bg-blue-500/10">
            <CardHeader>
              <CardTitle className="text-blue-600">Complete Your Store Profile</CardTitle>
              <CardDescription>
                Set up your public store profile to start listing products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/seller/store-setup">Set Up Store</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No products listed yet
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No orders received
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0.00</div>
              <p className="text-xs text-muted-foreground">
                Start selling to earn
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">
                vs. last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>List a Product</CardTitle>
              <CardDescription>
                Add new products to your store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" disabled={profile.applicationStatus !== "APPROVED"}>
                <Link href="/seller/products/new">
                  Add Product
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Products</CardTitle>
              <CardDescription>
                View and edit your product listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/seller/products">
                  View Products
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Orders</CardTitle>
              <CardDescription>
                View and fulfill customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/seller/orders">
                  View Orders
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Return Requests</CardTitle>
              <CardDescription>
                Manage customer return requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/seller/returns">
                  View Returns
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>
                View your store performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/seller/analytics">
                  View Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Coupons & Discounts</CardTitle>
              <CardDescription>
                Create and manage discount codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/seller/coupons">
                  Manage Coupons
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
              <CardDescription>
                Update your store profile and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/seller/settings">
                  Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
