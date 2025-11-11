"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";
import { Search, Package, Store } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchType, setSearchType] = useState<any>("ALL");

  const { data: results, isLoading } = api.search.globalSearch.useQuery(
    { query, type: searchType },
    { enabled: !!query }
  );

  if (!query) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center py-12">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Search TezCart</h2>
            <p className="text-muted-foreground">Enter a search term to find products and sellers</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-lg">Searching...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-muted-foreground">
            Found {results?.total || 0} results for "{query}"
          </p>
        </div>

        <Tabs defaultValue="all" onValueChange={(v) => setSearchType(v.toUpperCase())}>
          <TabsList>
            <TabsTrigger value="all">All ({results?.total || 0})</TabsTrigger>
            <TabsTrigger value="products">
              Products ({results?.products?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="sellers">
              Sellers ({results?.sellers?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {results?.products && results.products.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Products</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {results.products.map((product: any) => {
                    const image = product.media?.find((m: any) => m.mediaType === "IMAGE");
                    return (
                      <Link key={product.id} href={`/products/${product.id}`}>
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="aspect-square rounded-md overflow-hidden bg-gradient-to-br from-[#4A00E0]/20 to-[#00E0B0]/20 mb-3">
                              {image ? (
                                <img
                                  src={image.url}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {product.description}
                            </p>
                            <p className="text-lg font-bold">${product.price}</p>
                            <p className="text-xs text-muted-foreground">
                              by {product.seller?.storeName}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {results?.sellers && results.sellers.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Sellers</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.sellers.map((seller: any) => (
                    <Card key={seller.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#00E0B0] flex items-center justify-center flex-shrink-0">
                            <Store className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{seller.storeName}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {seller.storeDescription}
                            </p>
                            <Badge variant="secondary">
                              {seller._count?.products || 0} products
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {results?.total === 0 && (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-bold mb-2">No results found</h2>
                  <p className="text-muted-foreground">
                    Try different keywords or browse our categories
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/products">Browse All Products</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            {results?.products && results.products.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {results.products.map((product: any) => {
                  const image = product.media?.find((m: any) => m.mediaType === "IMAGE");
                  return (
                    <Link key={product.id} href={`/products/${product.id}`}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="aspect-square rounded-md overflow-hidden bg-gradient-to-br from-[#4A00E0]/20 to-[#00E0B0]/20 mb-3">
                            {image ? (
                              <img
                                src={image.url}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                          <p className="text-lg font-bold">${product.price}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">No products found</p>
            )}
          </TabsContent>

          <TabsContent value="sellers" className="mt-6">
            {results?.sellers && results.sellers.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {results.sellers.map((seller: any) => (
                  <Card key={seller.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#00E0B0] flex items-center justify-center flex-shrink-0">
                          <Store className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{seller.storeName}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {seller.storeDescription}
                          </p>
                          <Badge variant="secondary">
                            {seller._count?.products || 0} products
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">No sellers found</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
