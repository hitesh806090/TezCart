"use client";

import { use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewForm } from "@/components/review-form";
import { api } from "@/trpc/react";
import { ArrowLeft, Package } from "lucide-react";

export default function ReviewOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { status } = useSession();
  const router = useRouter();

  const { data: order, isLoading } = api.order.getOrderById.useQuery(
    { orderId: resolvedParams.id },
    { enabled: status === "authenticated" }
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  if (!order) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <Button asChild>
              <Link href="/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/orders/${order.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Order
          </Link>
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Write Reviews</h1>
            <p className="text-muted-foreground">
              Share your experience with the products from Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          {/* Review Forms for Each Product */}
          <div className="space-y-6">
            {order.items.map((item: any) => (
              <div key={item.id} className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4 mb-4">
                      <div className="w-20 h-20 rounded-md overflow-hidden bg-gradient-to-br from-[#4A00E0]/20 to-[#00E0B0]/20 flex items-center justify-center flex-shrink-0">
                        {item.product.media?.find((m: any) => m.mediaType === "IMAGE") ? (
                          <img
                            src={item.product.media.find((m: any) => m.mediaType === "IMAGE").url}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.product.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <ReviewForm
                  productId={item.productId}
                  orderId={order.id}
                  onSuccess={() => {
                    router.push(`/orders/${order.id}`);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
