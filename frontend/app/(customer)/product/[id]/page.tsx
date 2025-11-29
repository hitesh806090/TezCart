import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Check, Star, Shield, Truck } from "lucide-react";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params Promise as per Next.js 15
  const { id } = await params;
  
  // Mock data for the product
  const product = {
    id: parseInt(id),
    title: "Neural Link Headset Pro",
    price: 299.99,
    description: "Experience the next evolution in audio. Direct neural interface technology combined with audiophile-grade drivers. The Neural Link Headset Pro offers 99.9% noise isolation and a battery life that lasts for days, not hours.",
    images: [
      "/placeholder.jpg",
    ],
    rating: 4.9,
    reviews: 124,
    inStock: true,
    features: [
      "Direct Neural Interface (Beta)",
      "Quantum Noise Cancellation",
      "120-hour Battery Life",
      "Holographic Audio Projection",
      "Titanium-Alloy Construction"
    ]
  };

  return (
    <div className="min-h-screen pb-20 pt-24 md:pt-32 px-4">
      <div className="container max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Shop
          </Link>
          <span className="mx-3 opacity-20">|</span>
          <span className="text-foreground font-medium truncate">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column: Image Visuals */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-card/30 backdrop-blur-sm shadow-2xl group">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50" />
               
               {/* Placeholder for Product Image */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
                  <div className="w-48 h-48 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                     <span className="text-muted-foreground">Product Image</span>
                  </div>
               </div>
               
               <Badge className="absolute top-6 right-6 bg-primary text-primary-foreground hover:bg-primary">
                  New Arrival
               </Badge>
            </div>

            <div className="grid grid-cols-4 gap-4">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="aspect-square rounded-xl border border-white/10 bg-card/30 cursor-pointer hover:border-primary transition-colors flex items-center justify-center">
                    <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
                 </div>
               ))}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-2 flex items-center gap-2">
               <Badge variant="outline" className="border-primary/30 text-primary">
                  Premium Gear
               </Badge>
               {product.inStock && (
                <span className="text-green-400 text-xs font-medium flex items-center">
                  <Check className="w-3 h-3 mr-1" />
                  In Stock
                </span>
               )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
               {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
               <div className="flex items-center text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
               </div>
               <span className="text-muted-foreground text-sm">{product.reviews} verified reviews</span>
            </div>
            
            <div className="text-3xl font-bold text-primary mb-6">
               ${product.price.toFixed(2)}
            </div>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="mb-8 space-y-3 bg-white/5 p-6 rounded-2xl border border-white/5">
               <h3 className="font-semibold text-white mb-2">Specs & Features</h3>
               {product.features.map((feature, idx) => (
                 <div key={idx} className="flex items-center text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
                    {feature}
                 </div>
               ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="h-14 rounded-full px-8 text-lg font-semibold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all flex-1">
                Add to Cart - ${product.price}
              </Button>
              <Button variant="outline" size="lg" className="h-14 rounded-full px-6 border-white/10 hover:bg-white/5 hover:text-white">
                Save
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                     <Shield className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="font-medium text-white text-sm">2 Year Warranty</p>
                     <p className="text-xs text-muted-foreground">Full coverage included</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                     <Truck className="w-5 h-5" />
                  </div>
                  <div>
                     <p className="font-medium text-white text-sm">Express Shipping</p>
                     <p className="text-xs text-muted-foreground">Global delivery available</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}