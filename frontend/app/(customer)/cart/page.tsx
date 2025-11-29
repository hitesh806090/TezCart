"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  // Mock Cart Data
  const [cartItems, setCartItems] = React.useState([
    {
      id: 1,
      name: "Neural Link Headset Pro",
      price: 299.99,
      image: "/placeholder.jpg",
      quantity: 1,
      category: "Electronics"
    },
    {
      id: 2,
      name: "Ergonomic Mechanical Keyboard",
      price: 149.50,
      image: "/placeholder.jpg",
      quantity: 2,
      category: "Accessories"
    }
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax mock
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6 text-zinc-500">
           <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Looks like you haven&apos;t added anything to your cart yet. Explore our products and find something you love.
        </p>
        <Link href="/">
           <Button size="lg" className="rounded-full px-8">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-obsidian">
      <div className="container max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-white">Shopping Cart ({cartItems.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="bg-surface border-white/10 overflow-hidden">
                <CardContent className="p-4 flex gap-4 sm:gap-6">
                  {/* Image Placeholder */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-zinc-800 rounded-md shrink-0 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-zinc-600" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">{item.category}</p>
                        <h3 className="font-bold text-white text-lg leading-tight">{item.name}</h3>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
                      <div className="flex items-center border border-white/10 rounded-md bg-zinc-900/50 w-fit">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 text-zinc-400 hover:text-white transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gold">${(item.price * item.quantity).toFixed(2)}</div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-zinc-500">${item.price.toFixed(2)} each</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
             <div className="sticky top-24">
                <Card className="bg-surface border-white/10">
                   <CardContent className="p-6 space-y-6">
                      <h2 className="text-xl font-bold text-white">Order Summary</h2>
                      
                      <div className="space-y-3">
                         <div className="flex justify-between text-zinc-300">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between text-zinc-300">
                            <span>Estimated Tax</span>
                            <span>${tax.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between text-zinc-300">
                            <span>Shipping</span>
                            <span className="text-green-400">Free</span>
                         </div>
                      </div>

                      <Separator className="bg-white/10" />

                      <div className="flex justify-between items-end">
                         <span className="text-lg font-bold text-white">Total</span>
                         <span className="text-2xl font-bold text-gold">${total.toFixed(2)}</span>
                      </div>

                      <div className="pt-4 space-y-3">
                         <Link href="/checkout">
                            <Button className="w-full h-12 text-lg font-bold bg-gold text-obsidian hover:bg-gold-dim">
                               Proceed to Checkout
                               <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                         </Link>
                         <div className="text-center">
                            <Link href="/" className="text-sm text-zinc-400 hover:text-white underline underline-offset-4">
                               Continue Shopping
                            </Link>
                         </div>
                      </div>
                   </CardContent>
                </Card>

                <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/5">
                   <div className="flex gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                         <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                         <h4 className="font-medium text-white text-sm">Secure Checkout</h4>
                         <p className="text-xs text-zinc-400 mt-1">Your transaction is protected with 256-bit SSL encryption.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
