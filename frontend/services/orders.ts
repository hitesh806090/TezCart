import api from '@/lib/api'
import { Order, Address } from '@/types'

export const ordersApi = {
    // Create order (checkout)
    checkout: async (data: {
        shippingAddress: Address
        billingAddress?: Address
        paymentMethod: string
        couponCode?: string
    }) => {
        const { data: order } = await api.post<Order>('/orders/checkout', data)
        return order
    },

    // Get my orders
    getMyOrders: async (params?: {
        page?: number
        limit?: number
        status?: string
    }) => {
        const { data } = await api.get<Order[]>('/orders/my-orders', { params })
        return data
    },

    // Get order by ID
    getOrder: async (id: string) => {
        const { data } = await api.get<Order>(`/orders/${id}`)
        return data
    },

    // Get order by number
    getOrderByNumber: async (orderNumber: string) => {
        const { data } = await api.get<Order>(`/orders/number/${orderNumber}`)
        return data
    },

    // Cancel order
    cancelOrder: async (id: string, reason: string) => {
        const { data } = await api.post(`/orders/${id}/cancel`, { reason })
        return data
    },
}
