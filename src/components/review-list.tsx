"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp } from "lucide-react";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";

interface ReviewListProps {
  productId: string;
}

export function ReviewList({ productId }: ReviewListProps) {
  const { data: session } = useSession();
  const { data, isLoading, refetch } = api.review.getByProduct.useQuery({ productId });

  const markHelpfulMutation = api.review.markHelpful.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleMarkHelpful = (reviewId: string) => {
    if (!session) {
      alert("Please sign in to mark reviews as helpful");
      return;
    }
    markHelpfulMutation.mutate({ reviewId });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-20 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data || data.reviews.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-12">
          <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
          <p className="text-muted-foreground">
            Be the first to review this product!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold">
                {data.averageRating.toFixed(1)}
              </div>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(data.averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {data.totalReviews} {data.totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Based on {data.totalReviews} customer {data.totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      <div className="space-y-4">
        {data.reviews.map((review: any) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <Badge variant="secondary">{review.rating}/5</Badge>
                    </div>
                    <h4 className="font-semibold mt-2">{review.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      by {review.user?.name || "Anonymous"} on{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-sm">{review.comment}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkHelpful(review.id)}
                    disabled={markHelpfulMutation.isPending}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Helpful ({review.helpfulCount || 0})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
