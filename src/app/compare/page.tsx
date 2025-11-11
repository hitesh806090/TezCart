"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, X } from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("compareProducts");
    if (stored) {
      setProducts(JSON.parse(stored));
    }
  }, []);

  const removeProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    localStorage.setItem("compareProducts", JSON.stringify(updated));
  };

  const clearAll = () => {
    setProducts([]);
    localStorage.removeItem("compareProducts");
    router.push("/products");
  };

  if (products.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center py-12">
            <h2 className="text-2xl font-bold mb-2">No products to compare</h2>
            <p className="text-muted-foreground mb-6">
              Add products from the product listing page
            </p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const features = [
    { key: "price", label: "Price" },
    { key: "category", label: "Category" },
    { key: "description", label: "Description" },
    { key: "reviews", label: "Reviews" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Compare Products</h1>
          <Button variant="outline" onClick={clearAll}>
            Clear All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left bg-muted/50 border">Feature</th>
                {products.map((product) => {
                  const image = product.media?.find((m: any) => m.mediaType === "IMAGE");
                  return (
                    <th key={product.id} className="p-4 border bg-muted/50 min-w-[250px]">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => removeProduct(product.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="aspect-square rounded-md overflow-hidden bg-gradient-to-br from-[#4A00E0]/20 to-[#00E0B0]/20 mb-2">
                          {image ? (
                            <img
                              src={image.url}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-muted-foreground">No image</span>
                            </div>
                          )}
                        </div>
                        <p className="font-semibold mb-2">{product.title}</p>
                        <Button asChild className="w-full" size="sm">
                          <Link href={`/products/${product.id}`}>View Product</Link>
                        </Button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 font-semibold border bg-muted/30">Price</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 border text-center">
                    <p className="text-2xl font-bold">${product.price}</p>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold border bg-muted/30">Category</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 border text-center">
                    <Badge>{product.category || "Uncategorized"}</Badge>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold border bg-muted/30">Description</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 border">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {product.description}
                    </p>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold border bg-muted/30">Reviews</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 border text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">
                        {product._count?.reviews || 0} reviews
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold border bg-muted/30">3D Model</td>
                {products.map((product) => {
                  const has3D = product.media?.some((m: any) => m.mediaType === "MODEL_3D");
                  return (
                    <td key={product.id} className="p-4 border text-center">
                      <Badge variant={has3D ? "default" : "secondary"}>
                        {has3D ? "Available" : "Not Available"}
                      </Badge>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-4 font-semibold border bg-muted/30">Action</td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 border text-center">
                    <Button className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
