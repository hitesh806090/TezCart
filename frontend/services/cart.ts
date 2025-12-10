import api from '@/lib/api'
import { Cart } from '@/types'

export const cartApi = {
    // Get cart
    getCart: async (sessionId?: string) => {
        const headers = sessionId ? { 'X-Session-ID': sessionId } : {}
        const { data } = await api.get<Cart>('/cart', { headers })
        return data
    },

    // Add item to cart
    addItem: async (productId: string, quantity: number, sessionId?: string) => {
        const headers = sessionId ? { 'X-Session-ID': sessionId } : {}
        const { data } = await api.post('/cart/items', { productId, quantity }, { headers })
        return data
    },

    // Update item quantity
    updateItem: async (itemId: string, quantity: number, sessionId?: string) => {
        const headers = sessionId ? { 'X-Session-ID': sessionId } : {}
        const { data } = await api.patch(`/cart/items/${itemId}`, { quantity }, { headers })
        return data
    },

    // Remove item
    removeItem: async (itemId: string, sessionId?: string) => {
        const headers = sessionId ? { 'X-Session-ID': sessionId } : {}
        await api.delete(`/cart/items/${itemId}`, { headers })
    },

    // Apply coupon
    applyCoupon: async (couponCode: string, sessionId?: string) => {
        const headers = sessionId ? { 'X-Session-ID': sessionId } : {}
        const { data } = await api.post('/cart/coupon', { couponCode }, { headers })
        return data
    },

    // Remove coupon
    removeCoupon: async (sessionId?: string) => {
        const headers = sessionId ? { 'X-Session-ID': sessionId } : {}
        await api.delete('/cart/coupon', { headers })
    },

    // Clear cart
    clearCart: async (sessionId?: string) => {
        const headers = sessionId ? { 'X-Session-ID': sessionId } : {}
        await api.delete('/cart/clear', { headers })
    },

    // Merge guest cart
    mergeCart: async (sessionId: string) => {
        const { data } = await api.post('/cart/merge', { sessionId })
        return data
    },
}
