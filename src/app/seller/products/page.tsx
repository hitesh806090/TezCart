"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { Package, Plus } from "lucide-react";

export default function SellerProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
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

  const { data: products = [], isLoading } = api.product.getMyProducts.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Products</h1>
            <p className="text-muted-foreground">
              Manage your product listings
            </p>
          </div>
          <Button asChild>
            <Link href="/seller/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardHeader>
                  <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardHeader className="text-center py-12">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle>No Products Yet</CardTitle>
              <CardDescription>
                Start by creating your first product listing
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-12">
              <Button asChild size="lg">
                <Link href="/seller/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-[#4A00E0]/20 to-[#00E0B0]/20 flex items-center justify-center">
                  <Package className="h-16 w-16 text-muted-foreground" />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-1">{product.title}</CardTitle>
                    <Badge variant={product.status === "ACTIVE" ? "default" : "secondary"}>
                      {product.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      ${product.variants?.[0]?.price?.toFixed(2) || "0.00"}
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/products/${product.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Stock: {product.variants?.[0]?.quantity || 0} units
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
