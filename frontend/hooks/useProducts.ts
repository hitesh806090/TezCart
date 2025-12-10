import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@/services/products'

// Get products with filters
export const useProducts = (params?: {
    page?: number
    limit?: number
    categoryId?: string
    minPrice?: number
    maxPrice?: number
    search?: string
    sortBy?: string
}) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productsApi.getProducts(params),
    })
}

// Get single product
export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productsApi.getProduct(id),
        enabled: !!id,
    })
}

// Get trending products
export const useTrendingProducts = (limit: number = 10) => {
    return useQuery({
        queryKey: ['trending-products', limit],
        queryFn: () => productsApi.getTrending(limit),
    })
}

// Track product view
export const useTrackView = () => {
    return useMutation({
        mutationFn: (productId: string) => productsApi.incrementView(productId),
    })
}
