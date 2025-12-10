'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Star, ShoppingCart, Heart, SlidersHorizontal, Grid3x3, List } from 'lucide-react'
import Link from 'next/link'

// Mock products
const products = Array.from({ length: 12 }, (_, i) => ({
    id: `${i + 1}`,
    name: `Premium Product ${i + 1}`,
    price: 99 + (i * 20),
    originalPrice: 149 + (i * 30),
    rating: 4.0 + (Math.random() * 0.9),
    reviews: Math.floor(Math.random() * 500) + 50,
    badge: ['Best Seller', 'New', 'Trending', 'Premium'][i % 4],
    inStock: i % 5 !== 0,
}))

const categories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books']
const priceRanges = ['All Prices', 'Under $100', '$100 - $200', '$200 - $500', 'Over $500']

export default function ProductsPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedPrice, setSelectedPrice] = useState('All Prices')

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold mb-2">All Products</h1>
                    <p className="text-gray-600">Discover amazing products from verified sellers</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-64 space-y-6">
                        <Card className="p-6">
                            <h3 className="font-semibold mb-4 flex items-center">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Filters
                            </h3>

                            <div className="space-y-6">
                                {/* Categories */}
                                <div>
                                    <h4 className="font-medium mb-3">Categories</h4>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategory(category)}
                                                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category
                                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                                        : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Price Range */}
                                <div>
                                    <h4 className="font-medium mb-3">Price Range</h4>
                                    <div className="space-y-2">
                                        {priceRanges.map((range) => (
                                            <button
                                                key={range}
                                                onClick={() => setSelectedPrice(range)}
                                                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedPrice === range
                                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                                        : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                {range}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Rating */}
                                <div>
                                    <h4 className="font-medium mb-3">Rating</h4>
                                    <div className="space-y-2">
                                        {[4, 3, 2, 1].map((rating) => (
                                            <button
                                                key={rating}
                                                className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex">
                                                    {Array.from({ length: rating }).map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                                <span className="text-sm">& Up</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold">1-12</span> of{' '}
                                <span className="font-semibold">120</span> products
                            </p>

                            <div className="flex items-center gap-2">
                                <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Sort by: Relevance</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest First</option>
                                    <option>Top Rated</option>
                                </select>

                                <div className="flex border rounded-lg">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="icon"
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid3x3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                        size="icon"
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                            {products.map((product) => (
                                <Card key={product.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                                    <div className={`flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'}`}>
                                        <div className={`relative ${viewMode === 'list' ? 'w-48' : 'w-full'}`}>
                                            <div className={`${viewMode === 'list' ? 'h-48' : 'aspect-square'} bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-105 transition-transform duration-300`} />
                                            <Badge className="absolute top-4 left-4 bg-blue-600">{product.badge}</Badge>
                                            {!product.inStock && (
                                                <Badge className="absolute top-4 right-4 bg-red-600">Out of Stock</Badge>
                                            )}
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
                                            >
                                                <Heart className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="p-4 space-y-3 flex-1">
                                            <Link href={`/products/${product.id}`}>
                                                <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-2">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            <div className="flex items-center space-x-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-medium">{product.rating.toFixed(1)}</span>
                                                <span className="text-gray-500 text-sm">({product.reviews})</span>
                                            </div>

                                            <div className="flex items-baseline space-x-2">
                                                <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                                                <span className="text-gray-400 line-through">${product.originalPrice}</span>
                                            </div>

                                            <Button
                                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                                disabled={!product.inStock}
                                            >
                                                <ShoppingCart className="mr-2 h-4 w-4" />
                                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center space-x-2 mt-12">
                            <Button variant="outline">Previous</Button>
                            {[1, 2, 3, 4, 5].map((page) => (
                                <Button
                                    key={page}
                                    variant={page === 1 ? 'default' : 'outline'}
                                    className={page === 1 ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                                >
                                    {page}
                                </Button>
                            ))}
                            <Button variant="outline">Next</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
