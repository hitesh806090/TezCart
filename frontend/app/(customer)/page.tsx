import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Star, Zap } from "lucide-react";

export default function HomePage() {
  // Mock products data
  const products = [
    { id: 1, name: "Neural Link Headset", price: 299.99, category: "Audio" },
    { id: 2, name: "Holographic Keyboard", price: 129.99, category: "Peripherals" },
    { id: 3, name: "Zero-G Mouse", price: 79.99, category: "Peripherals" },
    { id: 4, name: "Quantum Laptop Stand", price: 89.99, category: "Accessories" },
    { id: 5, name: "Chronos Smart Watch", price: 249.99, category: "Wearables" },
    { id: 6, name: "Nebula Speaker", price: 149.99, category: "Audio" },
    { id: 7, name: "Haptic Controller", price: 89.99, category: "Gaming" },
    { id: 8, name: "Void Phone Case", price: 39.99, category: "Accessories" },
  ];

  return (
    <div className="min-h-screen flex flex-col gap-12 pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center z-10 relative">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 border border-primary/30 rounded-full bg-primary/10 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary-foreground tracking-wide uppercase">Next Gen Tech Arrived</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
              Future of
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 animate-pulse">
              Retail
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Experience the bleeding edge of technology. Premium gear curated for the modern digital nomad.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/product/1">
              <Button size="lg" className="rounded-full px-8 h-14 text-lg font-semibold shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all">
                Shop Collection
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/seller-register">
               <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg border-primary/50 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all">
                Become a Seller
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features / Stats */}
      <section className="max-w-7xl mx-auto w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: "Active Users", value: "24k+" },
             { label: "Products", value: "10k+" },
             { label: "Countries", value: "50+" }
           ].map((stat, i) => (
             <div key={i} className="bg-card/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 text-center hover:bg-card/80 transition-colors">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-muted-foreground uppercase tracking-widest text-sm">{stat.label}</div>
             </div>
           ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto w-full px-4 py-12">
        <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Trending <span className="text-primary">Now</span>
            </h2>
            <Button variant="ghost" className="text-muted-foreground hover:text-white">
              View All
            </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group">
              <Card className="h-full bg-card/40 backdrop-blur-sm border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                <div className="aspect-square relative bg-gradient-to-br from-gray-800 to-black p-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                   {/* Placeholder Visual */}
                   <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary/20 to-transparent border border-white/10 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Zap className="w-12 h-12 text-white/50 group-hover:text-white transition-colors z-10" />
                   </div>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                       <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">{product.category}</p>
                       <CardTitle className="text-lg font-bold text-white group-hover:text-primary transition-colors">{product.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                   <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
                     <Star className="w-3 h-3 fill-current" />
                     <Star className="w-3 h-3 fill-current" />
                     <Star className="w-3 h-3 fill-current" />
                     <Star className="w-3 h-3 fill-current" />
                     <Star className="w-3 h-3 text-gray-600" />
                     <span className="text-muted-foreground ml-1">(4.2)</span>
                   </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center border-t border-white/5 pt-4 mt-auto">
                  <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
                  <Button size="sm" className="rounded-full w-10 h-10 p-0 bg-white/5 hover:bg-primary text-white border-0">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
