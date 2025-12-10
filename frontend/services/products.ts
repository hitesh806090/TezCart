import api from '@/lib/api'
import { Product, PaginatedResponse, ApiResponse } from '@/types'

export const productsApi = {
    // Get all products with filters
    getProducts: async (params?: {
        page?: number
        limit?: number
        categoryId?: string
        minPrice?: number
        maxPrice?: number
        search?: string
        sortBy?: string
    }) => {
        const { data } = await api.get<PaginatedResponse<Product>>('/products', { params })
        return data
    },

    // Get single product
    getProduct: async (id: string) => {
        const { data } = await api.get<Product>(`/products/${id}`)
        return data
    },

    // Get trending products
    getTrending: async (limit: number = 10) => {
        const { data } = await api.get<Product[]>('/search/trending', { params: { limit } })
        return data
    },

    // Track product view
    incrementView: async (id: string) => {
        await api.post(`/products/${id}/increment-view`)
    },
}
