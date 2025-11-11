import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Store, Shield, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-16 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-[#4A00E0]">Tez</span>
            <span className="text-[#00E0B0]">Cart</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The future of online shopping with immersive 3D and AR product experiences
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <Card>
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#00E0B0] flex items-center justify-center mb-4">
                <Box className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">3D & AR First</h2>
              <p className="text-muted-foreground">
                Experience products like never before with interactive 3D models and augmented reality.
                See how products look in your space before you buy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#00E0B0] flex items-center justify-center mb-4">
                <Store className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Multi-Vendor Marketplace</h2>
              <p className="text-muted-foreground">
                Connect with verified sellers from around the world. Each seller brings unique
                products with detailed 3D visualizations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#00E0B0] flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Secure & Trusted</h2>
              <p className="text-muted-foreground">
                Shop with confidence. All sellers are verified, payments are secure,
                and our buyer protection ensures your satisfaction.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#00E0B0] flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Fast & Modern</h2>
              <p className="text-muted-foreground">
                Built with cutting-edge technology for lightning-fast performance.
                Enjoy seamless browsing, instant search, and smooth 3D interactions.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Platform Features</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="text-sm py-2 px-4">3D Product Viewer</Badge>
            <Badge className="text-sm py-2 px-4">AR Quick View</Badge>
            <Badge className="text-sm py-2 px-4">Advanced Search</Badge>
            <Badge className="text-sm py-2 px-4">Product Comparison</Badge>
            <Badge className="text-sm py-2 px-4">Wishlist</Badge>
            <Badge className="text-sm py-2 px-4">Reviews & Ratings</Badge>
            <Badge className="text-sm py-2 px-4">Order Tracking</Badge>
            <Badge className="text-sm py-2 px-4">Returns Management</Badge>
            <Badge className="text-sm py-2 px-4">Seller Analytics</Badge>
            <Badge className="text-sm py-2 px-4">Messaging System</Badge>
            <Badge className="text-sm py-2 px-4">Coupons & Discounts</Badge>
            <Badge className="text-sm py-2 px-4">Secure Payments</Badge>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-[#4A00E0]/10 to-[#00E0B0]/10">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              To revolutionize online shopping by making it more interactive, immersive, and trustworthy.
              We believe that seeing products in 3D and AR helps customers make better purchasing decisions
              and reduces returns, benefiting both buyers and sellers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
