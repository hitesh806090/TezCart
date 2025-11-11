"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Star } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  media: any[];
  _count?: {
    reviews: number;
  };
}

interface ProductComparisonProps {
  products: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
}

export function ProductComparison({ products, onRemove, onClear }: ProductComparisonProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-40">
      <div className="container py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Compare Products ({products.length}/4)
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClear}>
              Clear All
            </Button>
            <Button size="sm" asChild>
              <Link href="/compare">View Comparison</Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => {
            const image = product.media?.find((m: any) => m.mediaType === "IMAGE");
            return (
              <Card key={product.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={() => onRemove(product.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardContent className="p-4">
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
                  <p className="font-semibold text-sm line-clamp-1">{product.title}</p>
                  <p className="text-lg font-bold">${product.price}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
