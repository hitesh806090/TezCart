'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart, Trash2 } from 'lucide-react'
import Link from 'next/link'

// Mock wishlist data
const wishlistItems = [
    {
        id: '1',
        name: 'Premium Wireless Headphones Pro Max',
        price: 299,
        originalPrice: 399,
        rating: 4.7,
        reviews: 1247,
        inStock: true,
        priceDropped: true,
    },
    {
        id: '2',
        name: 'Smart Watch Ultra Edition',
        price: 249,
        originalPrice: 349,
        rating: 4.8,
        reviews: 856,
        inStock: true,
        priceDropped: false,
    },
    {
        id: '3',
        name: 'Professional 4K Camera',
        price: 899,
        originalPrice: 1199,
        rating: 4.9,
        reviews: 432,
        inStock: false,
        priceDropped: false,
    },
]

export default function WishlistPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
                        <p className="text-gray-600">{wishlistItems.length} items saved</p>
                    </div>
                    <Button variant="outline" className="hidden sm:flex">
                        Share Wishlist
                    </Button>
                </div>

                {wishlistItems.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 mb-4">
                            <Star className="h-12 w-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-6">Save items you love to buy them later!</p>
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                            <Link href="/products">Browse Products</Link>
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => (
                            <Card key={item.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                                <div className="relative">
                                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-105 transition-transform duration-300" />
                                    {item.priceDropped && (
                                        <Badge className="absolute top-4 left-4 bg-red-600">Price Drop!</Badge>
                                    )}
                                    {!item.inStock && (
                                        <Badge className="absolute top-4 right-4 bg-gray-600">Out of Stock</Badge>
                                    )}
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white text-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="p-4 space-y-3">
                                    <Link href={`/products/${item.id}`}>
                                        <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                                            {item.name}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center space-x-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium">{item.rating}</span>
                                        <span className="text-gray-500 text-sm">({item.reviews})</span>
                                    </div>

                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-2xl font-bold text-blue-600">${item.price}</span>
                                        <span className="text-gray-400 line-through">${item.originalPrice}</span>
                                    </div>

                                    {item.priceDropped && (
                                        <div className="p-2 bg-red-50 rounded text-sm text-red-700 font-medium">
                                            Price dropped by ${item.originalPrice - item.price}!
                                        </div>
                                    )}

                                    <Button
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        disabled={!item.inStock}
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {wishlistItems.length > 0 && (
                    <div className="mt-12 text-center">
                        <Button size="lg" variant="outline" className="border-2" asChild>
                            <Link href="/products">Continue Shopping</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
