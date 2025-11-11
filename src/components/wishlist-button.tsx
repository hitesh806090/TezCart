"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { api } from "@/trpc/react";

interface WishlistButtonProps {
  productId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function WishlistButton({
  productId,
  variant = "outline",
  size = "icon",
}: WishlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOptimistic, setIsOptimistic] = useState(false);

  const { data: isInWishlist, refetch } = api.wishlist.isInWishlist.useQuery(
    { productId },
    { enabled: !!session }
  );

  const addMutation = api.wishlist.addItem.useMutation({
    onSuccess: () => {
      refetch();
      setIsOptimistic(false);
    },
    onError: () => {
      setIsOptimistic(false);
    },
  });

  const removeMutation = api.wishlist.removeItem.useMutation({
    onSuccess: () => {
      refetch();
      setIsOptimistic(false);
    },
    onError: () => {
      setIsOptimistic(false);
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setIsOptimistic(true);

    if (isInWishlist) {
      removeMutation.mutate({ productId });
    } else {
      addMutation.mutate({ productId });
    }
  };

  const isFilled = isOptimistic ? !isInWishlist : isInWishlist;
  const isLoading = addMutation.isPending || removeMutation.isPending;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className="relative"
    >
      <Heart
        className={`h-5 w-5 transition-all ${
          isFilled ? "fill-red-500 text-red-500" : ""
        }`}
      />
    </Button>
  );
}
