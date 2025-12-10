import api from '@/lib/api'

export const wishlistApi = {
    // Get wishlist
    getWishlist: async () => {
        const { data } = await api.get('/wishlists')
        return data
    },

    // Add item to wishlist
    addItem: async (productId: string, notifyOnPriceDrop: boolean = false) => {
        const { data } = await api.post('/wishlists/items', {
            productId,
            notifyOnPriceDrop
        })
        return data
    },

    // Remove item from wishlist
    removeItem: async (productId: string) => {
        await api.delete(`/wishlists/items/${productId}`)
    },

    // Move to cart
    moveToCart: async (productId: string) => {
        const { data } = await api.post(`/wishlists/items/${productId}/move-to-cart`)
        return data
    },

    // Move all to cart
    moveAllToCart: async () => {
        const { data } = await api.post('/wishlists/move-all-to-cart')
        return data
    },

    // Check if product is in wishlist
    checkInWishlist: async (productId: string) => {
        const { data } = await api.get<{ inWishlist: boolean }>(`/wishlists/check/${productId}`)
        return data
    },

    // Clear wishlist
    clearWishlist: async () => {
        await api.delete('/wishlists/clear')
    },
}
