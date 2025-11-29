"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-4">
      <Card className="bg-surface border border-white/10 max-w-lg w-full text-center p-8">
        <CardContent className="space-y-6 pt-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
              <CheckCircle className="w-10 h-10" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Order Placed Successfully!</h1>
            <p className="text-zinc-400">
              Thank you for your purchase. Your order <span className="text-gold font-mono">#ORD-77382</span> has been confirmed.
            </p>
          </div>

          <div className="bg-zinc-900/50 rounded-lg p-4 text-left space-y-3 border border-white/5">
             <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-zinc-500 mt-0.5" />
                <div>
                   <p className="text-sm font-medium text-white">Estimated Delivery</p>
                   <p className="text-xs text-zinc-400">Mon, Apr 12 - Wed, Apr 14</p>
                </div>
             </div>
             <div className="text-xs text-zinc-500 pt-2 border-t border-white/5">
                We&apos;ve sent a confirmation email to <span className="text-zinc-300">user@example.com</span> with your order details.
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/account/orders" className="flex-1">
              <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                View Order
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full bg-gold text-obsidian hover:bg-gold-dim">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
