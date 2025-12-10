import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '@/services/cart'
import { useState, useEffect } from 'react'

// Generate or get session ID for guest carts
const getSessionId = () => {
    if (typeof window === 'undefined') return null
    let sessionId = localStorage.getItem('cart_session_id')
    if (!sessionId) {
        sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('cart_session_id', sessionId)
    }
    return sessionId
}

// Get cart
export const useCart = () => {
    const [sessionId, setSessionId] = useState<string | null>(null)

    useEffect(() => {
        setSessionId(getSessionId())
    }, [])

    return useQuery({
        queryKey: ['cart', sessionId],
        queryFn: () => cartApi.getCart(sessionId || undefined),
        enabled: !!sessionId,
    })
}

// Add item to cart
export const useAddToCart = () => {
    const queryClient = useQueryClient()
    const sessionId = getSessionId()

    return useMutation({
        mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
            cartApi.addItem(productId, quantity, sessionId || undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

// Update cart item
export const useUpdateCartItem = () => {
    const queryClient = useQueryClient()
    const sessionId = getSessionId()

    return useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
            cartApi.updateItem(itemId, quantity, sessionId || undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

// Remove cart item
export const useRemoveCartItem = () => {
    const queryClient = useQueryClient()
    const sessionId = getSessionId()

    return useMutation({
        mutationFn: (itemId: string) =>
            cartApi.removeItem(itemId, sessionId || undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

// Apply coupon
export const useApplyCoupon = () => {
    const queryClient = useQueryClient()
    const sessionId = getSessionId()

    return useMutation({
        mutationFn: (couponCode: string) =>
            cartApi.applyCoupon(couponCode, sessionId || undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

// Remove coupon
export const useRemoveCoupon = () => {
    const queryClient = useQueryClient()
    const sessionId = getSessionId()

    return useMutation({
        mutationFn: () => cartApi.removeCoupon(sessionId || undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}

// Clear cart
export const useClearCart = () => {
    const queryClient = useQueryClient()
    const sessionId = getSessionId()

    return useMutation({
        mutationFn: () => cartApi.clearCart(sessionId || undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}
