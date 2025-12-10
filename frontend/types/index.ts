export interface User {
    id: string
    email: string
    name: string
    phone?: string
    avatar?: string
    role: 'customer' | 'seller' | 'admin'
    isEmailVerified: boolean
    createdAt: string
}

export interface Product {
    id: string
    name: string
    slug: string
    description: string
    price: number
    compareAtPrice?: number
    images: string[]
    brand?: string
    sku: string
    stockQuantity: number
    status: 'draft' | 'active' | 'inactive' | 'out_of_stock'
    categoryId: string
    sellerId: string
    averageRating: number
    totalReviews: number
    totalSales: number
    createdAt: string
}

export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    image?: string
    parentId?: string
    isActive: boolean
}

export interface Cart {
    id: string
    items: CartItem[]
    subtotal: number
    tax: number
    shipping: number
    discount: number
    total: number
    couponCode?: string
}

export interface CartItem {
    id: string
    productId: string
    quantity: number
    price: number
    productSnapshot: {
        name: string
        image: string
        sku: string
    }
}

export interface Order {
    id: string
    orderNumber: string
    userId: string
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
    paymentMethod: string
    shippingAddress: Address
    billingAddress: Address
    subtotal: number
    tax: number
    shippingCost: number
    discount: number
    totalAmount: number
    items: OrderItem[]
    trackingNumber?: string
    createdAt: string
}

export interface OrderItem {
    id: string
    productId: string
    quantity: number
    price: number
    subtotal: number
    productSnapshot: {
        name: string
        image: string
        sku: string
    }
}

export interface Address {
    id?: string
    type?: 'home' | 'work' | 'other'
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    country: string
    isDefault?: boolean
    deliveryInstructions?: string
}

export interface Review {
    id: string
    productId: string
    userId: string
    rating: number
    title: string
    comment: string
    images?: string[]
    isVerifiedPurchase: boolean
    helpfulCount: number
    createdAt: string
    user: {
        name: string
        avatar?: string
    }
}

export interface Seller {
    id: string
    userId: string
    shopName: string
    shopSlug: string
    description?: string
    logo?: string
    banner?: string
    rating: number
    totalReviews: number
    totalProducts: number
    totalSales: number
    tier: 'bronze' | 'silver' | 'gold' | 'platinum'
    status: 'pending' | 'approved' | 'rejected' | 'suspended'
}

export interface ApiResponse<T> {
    data: T
    message?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
}
