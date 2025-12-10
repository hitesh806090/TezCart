import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { wishlistApi } from '@/services/wishlist'

// Get wishlist
export const useWishlist = () => {
    return useQuery({
        queryKey: ['wishlist'],
        queryFn: wishlistApi.getWishlist,
    })
}

// Add to wishlist
export const useAddToWishlist = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ productId, notifyOnPriceDrop }: {
            productId: string
            notifyOnPriceDrop?: boolean
        }) => wishlistApi.addItem(productId, notifyOnPriceDrop),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] })
        },
    })
}

// Remove from wishlist
export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (productId: string) => wishlistApi.removeItem(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] })
        },
    })
}

// Move to cart
export const useMoveToCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (productId: string) => wishlistApi.moveToCart(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] })
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

// Check if in wishlist
export const useCheckWishlist = (productId: string) => {
    return useQuery({
        queryKey: ['wishlist-check', productId],
        queryFn: () => wishlistApi.checkInWishlist(productId),
        enabled: !!productId,
    })
}
