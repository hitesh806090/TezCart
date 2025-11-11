"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { Heart, Package, ShoppingCart, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: wishlistItems, isLoading, refetch } = api.wishlist.getMyWishlist.useQuery(
    undefined,
    { enabled: status === "authenticated" }
  );

  const removeItemMutation = api.wishlist.removeItem.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const addToCartMutation = api.cart.addItem.useMutation({
    onSuccess: () => {
      alert("Added to cart!");
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
              You need to be signed in to view your wishlist
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRemove = (productId: string) => {
    if (confirm("Remove from wishlist?")) {
      removeItemMutation.mutate({ productId });
    }
  };

  const handleAddToCart = (productId: string, variantId: string) => {
    addToCartMutation.mutate({
      productId,
      variantId,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {!wishlistItems || wishlistItems.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Save your favorite products to buy them later!
              </p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((item: any) => {
              const image = item.product.media?.find((m: any) => m.mediaType === "IMAGE");
              const mainVariant = item.product.variants?.[0];
              const inStock = (mainVariant?.quantity || 0) > 0;

              return (
                <Card key={item.id} className="overflow-hidden">
                  <Link href={`/products/${item.product.id}`}>
                    <div className="aspect-square bg-gradient-to-br from-[#4A00E0]/20 to-[#00E0B0]/20 flex items-center justify-center overflow-hidden">
                      {image ? (
                        <img
                          src={image.url}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                        {item.product.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      by {item.product.seller?.storeName || "Seller"}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold">
                        ${mainVariant?.price.toFixed(2) || "0.00"}
                      </span>
                      {inStock ? (
                        <Badge variant="secondary">In Stock</Badge>
                      ) : (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAddToCart(item.product.id, mainVariant?.id)}
                        disabled={!inStock || addToCartMutation.isPending}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemove(item.product.id)}
                        disabled={removeItemMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
