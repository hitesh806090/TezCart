"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { Package, RotateCcw } from "lucide-react";

export default function ReturnsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: returns, isLoading } = api.return.getMyReturns.useQuery(
    undefined,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "APPROVED":
        return "bg-green-500";
      case "REJECTED":
        return "bg-red-500";
      case "COMPLETED":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Returns</h1>

        {!returns || returns.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <RotateCcw className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No return requests</h2>
              <p className="text-muted-foreground mb-6">
                You haven't requested any returns yet
              </p>
              <Button asChild>
                <Link href="/orders">View Orders</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {returns.map((returnRequest: any) => {
              const image = returnRequest.orderItem.product.media?.find(
                (m: any) => m.mediaType === "IMAGE"
              );

              return (
                <Card key={returnRequest.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Return Request #{returnRequest.id.slice(0, 8).toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Requested on {new Date(returnRequest.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(returnRequest.status)}>
                        {returnRequest.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Product Info */}
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-md overflow-hidden bg-gradient-to-br from-[#4A00E0]/20 to-[#00E0B0]/20 flex items-center justify-center flex-shrink-0">
                          {image ? (
                            <img
                              src={image.url}
                              alt={returnRequest.orderItem.product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">
                            {returnRequest.orderItem.product.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Order #{returnRequest.orderItem.order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {returnRequest.orderItem.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Return Details */}
                      <div className="border-t pt-4 space-y-2">
                        <div>
                          <p className="text-sm font-medium">Reason</p>
                          <p className="text-sm text-muted-foreground">
                            {returnRequest.reason.replace(/_/g, " ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Description</p>
                          <p className="text-sm text-muted-foreground">
                            {returnRequest.description}
                          </p>
                        </div>
                        {returnRequest.sellerNotes && (
                          <div>
                            <p className="text-sm font-medium">Seller Response</p>
                            <p className="text-sm text-muted-foreground">
                              {returnRequest.sellerNotes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/orders/${returnRequest.orderItem.order.id}`}>
                            View Order
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
