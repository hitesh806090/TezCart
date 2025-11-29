"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  // Mock Wishlist Data
  const [wishlistItems, setWishlistItems] = React.useState([
    {
      id: 1,
      name: "Wireless Gaming Mouse Pro",
      price: 89.99,
      image: "/placeholder.jpg",
      inStock: true,
      category: "Electronics"
    },
    {
      id: 2,
      name: "Ultra-Wide Monitor 34\"",
      price: 499.00,
      image: "/placeholder.jpg",
      inStock: false,
      category: "Monitors"
    },
    {
      id: 3,
      name: "Mechanical Keycaps Set",
      price: 35.00,
      image: "/placeholder.jpg",
      inStock: true,
      category: "Accessories"
    }
  ]);

  const removeItem = (id: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center px-4 bg-obsidian">
        <div className="w-24 h-24 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6 text-zinc-500">
           <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-white">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Save items you want to buy later. Start exploring our catalog!
        </p>
        <Link href="/">
           <Button size="lg" className="rounded-full px-8 bg-gold text-obsidian hover:bg-gold-dim">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-obsidian">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-bold text-white">My Wishlist ({wishlistItems.length})</h1>
           <Link href="/cart">
              <Button variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/5">
                 View Cart <ArrowRight className="w-4 h-4" />
              </Button>
           </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
             <Card key={item.id} className="group bg-surface border-white/10 overflow-hidden hover:border-gold/50 transition-colors">
                <div className="aspect-video bg-zinc-800 relative flex items-center justify-center">
                   {/* Image Placeholder */}
                   <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center">
                      <span className="text-xs text-zinc-500">Img</span>
                   </div>
                   
                   <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from wishlist"
                   >
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>
                <CardContent className="p-5">
                   <div className="text-xs text-gold mb-2 font-medium uppercase tracking-wider">{item.category}</div>
                   <h3 className="font-bold text-white text-lg mb-1 truncate">{item.name}</h3>
                   <div className="flex items-center justify-between mt-4">
                      <div className="text-xl font-bold text-white">${item.price.toFixed(2)}</div>
                      {item.inStock ? (
                         <span className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> In Stock
                         </span>
                      ) : (
                         <span className="text-xs text-red-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Out of Stock
                         </span>
                      )}
                   </div>
                   
                   <Button 
                      className="w-full mt-6 gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/20"
                      disabled={!item.inStock}
                   >
                      <ShoppingCart className="w-4 h-4" />
                      Move to Cart
                   </Button>
                </CardContent>
             </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
