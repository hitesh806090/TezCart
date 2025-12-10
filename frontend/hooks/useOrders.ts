
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '@/services/orders'
import { Address } from '@/types'

export const useOrders = () => {
    return useQuery({
        queryKey: ['orders', 'my-orders'],
        queryFn: () => ordersApi.getMyOrders(),
    })
}

export const useOrder = (id: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ['orders', id],
        queryFn: () => ordersApi.getOrder(id),
        enabled: options?.enabled,
    })
}

export const useOrderByNumber = (orderNumber: string, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ['orders', 'number', orderNumber],
        queryFn: () => ordersApi.getOrderByNumber(orderNumber),
        enabled: options?.enabled,
    })
}

export const useCheckout = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: {
            shippingAddress: Address
            billingAddress?: Address
            paymentMethod: string
            couponCode?: string
        }) => ordersApi.checkout(data),
        onSuccess: () => {
            // Invalidate cart and orders
            queryClient.invalidateQueries({ queryKey: ['cart'] })
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
    })
}

export const useCancelOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (variables: { id: string; reason: string }) =>
            ordersApi.cancelOrder(variables.id, variables.reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
    })
}
