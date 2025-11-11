import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Store, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#1A1A2E] to-[#2C2C4A] text-[#E0E0E0] px-4 py-20">
        <div className="container flex flex-col items-center justify-center gap-12">
          <div className="flex items-center gap-2">
            <Sparkles className="h-12 w-12 text-[#00E0B0]" />
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              <span className="text-[#4A00E0]">Tez</span>
              <span className="text-[#00E0B0]">Cart</span>
            </h1>
          </div>
          <div className="text-center max-w-3xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Next-Generation 3D eCommerce Marketplace
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Discover products with immersive 3D visualization and AR experiences.
              Shop with confidence, see products in your space before you buy.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/products">
                  Browse Products
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/signup">
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose TezCart?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Package className="h-12 w-12 mb-4 text-[#4A00E0]" />
                <CardTitle>3D Product Views</CardTitle>
                <CardDescription>
                  Explore products from every angle with interactive 3D models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get a complete understanding of products before purchasing with our
                  immersive 3D visualization technology.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Sparkles className="h-12 w-12 mb-4 text-[#00E0B0]" />
                <CardTitle>AR Quick View</CardTitle>
                <CardDescription>
                  See products in your space with augmented reality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Place virtual products in your home or office using AR to ensure
                  perfect fit and style.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Store className="h-12 w-12 mb-4 text-[#4A00E0]" />
                <CardTitle>Seller Platform</CardTitle>
                <CardDescription>
                  Full-featured tools for sellers to manage their stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Easy onboarding, powerful analytics, and seamless payment processing
                  for sellers of all sizes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#4A00E0]/10 to-[#00E0B0]/10">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our marketplace and reach customers worldwide with our powerful
            seller platform.
          </p>
          <Button asChild size="lg">
            <Link href="/seller/apply">
              Become a Seller
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
