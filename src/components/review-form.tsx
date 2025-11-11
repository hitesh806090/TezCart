"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { api } from "@/trpc/react";

interface ReviewFormProps {
  productId: string;
  orderId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, orderId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const createReviewMutation = api.review.create.useMutation({
    onSuccess: () => {
      setRating(0);
      setTitle("");
      setComment("");
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (title.length < 3) {
      alert("Title must be at least 3 characters");
      return;
    }

    if (comment.length < 10) {
      alert("Review must be at least 10 characters");
      return;
    }

    createReviewMutation.mutate({
      productId,
      orderId,
      rating,
      title,
      comment,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating} out of 5 stars
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience"
              maxLength={100}
              required
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/100 characters
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={5}
              maxLength={1000}
              required
            />
            <p className="text-xs text-muted-foreground">
              {comment.length}/1000 characters (minimum 10)
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={createReviewMutation.isPending}
            className="w-full"
          >
            {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </Button>

          {createReviewMutation.isSuccess && (
            <p className="text-sm text-green-600 text-center">
              Review submitted! It will appear after moderation.
            </p>
          )}

          {createReviewMutation.isError && (
            <p className="text-sm text-red-600 text-center">
              {createReviewMutation.error.message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
