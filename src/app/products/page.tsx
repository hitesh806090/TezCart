"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { Package, Search, SlidersHorizontal, X } from "lucide-react";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data, isLoading } = api.product.getAll.useQuery({
    limit: 20,
    search: searchQuery || undefined,
    categoryId: categoryFilter || undefined,
    sortBy: sortBy as any,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
  });

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setSortBy("newest");
    setMinPrice("");
    setMaxPrice("");
  };

  const hasActiveFilters = searchQuery || categoryFilter || minPrice || maxPrice || sortBy !== "newest";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Products</h1>
          <p className="text-muted-foreground">
            Discover amazing products with 3D visualization
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      !
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filter Products</DialogTitle>
                  <DialogDescription>
                    Narrow down your search with these filters
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="home-decor">Home Decor</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Price Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={clearFilters} variant="outline" className="flex-1">
                      Clear All
                    </Button>
                    <Button onClick={() => setFilterOpen(false)} className="flex-1">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                >
                  Search: {searchQuery}
                  <X className="ml-2 h-3 w-3" />
                </Button>
              )}
              {categoryFilter && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCategoryFilter("")}
                >
                  Category: {categoryFilter}
                  <X className="ml-2 h-3 w-3" />
                </Button>
              )}
              {(minPrice || maxPrice) && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                >
                  Price: ${minPrice || "0"} - ${maxPrice || "∞"}
                  <X className="ml-2 h-3 w-3" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardHeader>
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : data?.products && data.products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.products.map((product: any) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="h-48 bg-gradient-to-br from-[#4A00E0]/20 to-[#00E0B0]/20 flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {product.variants && product.variants.length > 0 && (
                      <div className="text-2xl font-bold">
                        ${product.variants[0].price.toFixed(2)}
                      </div>
                    )}
                    {product.seller && (
                      <div className="text-sm text-muted-foreground mt-2">
                        by {product.seller.storeName || "Seller"}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader className="text-center py-12">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle>No Products Yet</CardTitle>
              <CardDescription>
                Be the first to list a product on TezCart
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-12">
              <Button asChild>
                <Link href="/seller/apply">Become a Seller</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
