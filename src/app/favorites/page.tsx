"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { Store, X } from "lucide-react";

export default function FavoritesPage() {
  const { status } = useSession();
  const router = useRouter();

  const { data: favorites, isLoading, refetch } = api.favorite.getMyFavoriteSellers.useQuery(
    undefined,
    { enabled: status === "authenticated" }
  );

  const removeMutation = api.favorite.removeFavoriteSeller.useMutation({
    onSuccess: () => refetch(),
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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Favorite Sellers</h1>

        {!favorites || favorites.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No favorite sellers yet</h2>
              <p className="text-muted-foreground mb-6">
                Save your favorite sellers to quickly find their products
              </p>
              <Button asChild>
                <a href="/products">Browse Products</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {favorites.map((favorite: any) => (
              <Card key={favorite.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#00E0B0] flex items-center justify-center flex-shrink-0">
                        <Store className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{favorite.seller.storeName}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {favorite.seller.storeDescription}
                        </p>
                        <Badge variant="secondary">
                          {favorite.seller._count?.products || 0} products
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMutation.mutate({ sellerId: favorite.sellerId })}
                      disabled={removeMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
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
