import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">How do I view products in 3D?</h3>
                <p className="text-sm text-muted-foreground">
                  Products with 3D models will have a "View in 3D" button on the product page.
                  Click it to see an interactive 3D model that you can rotate, zoom, and explore.
                  Some products also support AR Quick View to see them in your space.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">How do I become a seller?</h3>
                <p className="text-sm text-muted-foreground">
                  Click on "Become a Seller" in the navigation menu. Fill out the application form
                  with your business details. Our team will review your application within 2-3 business
                  days. Once approved, you can start listing products.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards, debit cards, and PayPal. All payments are
                  securely processed through Stripe with 256-bit encryption.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">How do returns work?</h3>
                <p className="text-sm text-muted-foreground">
                  You can request a return within 30 days of delivery. Go to your order details
                  and click "Request Return". Select a reason and submit your request. The seller
                  will review and approve or reject within 2 business days.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">How can I track my order?</h3>
                <p className="text-sm text-muted-foreground">
                  Once your order ships, you'll receive a tracking number via email. You can also
                  view tracking information in your order details page. Click on "Orders" in the
                  navigation menu to see all your orders.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Can I message sellers directly?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! You can start a conversation with any seller from their product pages.
                  Click the "Message Seller" button to ask questions about products, shipping,
                  or anything else.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">How do I use coupon codes?</h3>
                <p className="text-sm text-muted-foreground">
                  During checkout, you'll see a field to enter a coupon code. Enter the code
                  and click "Apply". The discount will be reflected in your order total.
                  Coupon codes are provided by individual sellers.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Is my data secure?</h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely. We use industry-standard security measures including SSL encryption,
                  secure payment processing, and regular security audits. We never store your
                  credit card information on our servers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is here to assist you
            </p>
            <Button asChild>
              <Link href="/messages">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
