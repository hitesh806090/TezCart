'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Star, ShoppingCart, Heart, Minus, Plus, Share2, Shield, Truck, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ProductDetailPage() {
    const params = useParams()
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)

    // Mock product data
    const product = {
        id: params.id as string,
        name: 'Premium Wireless Headphones Pro Max',
        price: 299,
        originalPrice: 399,
        rating: 4.7,
        reviews: 1247,
        inStock: true,
        stockCount: 47,
        brand: 'TechSound',
        sku: 'TS-WHP-001',
        description: 'Experience audio like never before with our Premium Wireless Headphones. Featuring active noise cancellation, 30-hour battery life, and premium sound quality.',
        features: [
            'Active Noise Cancellation (ANC)',
            '30-hour battery life',
            'Premium 40mm drivers',
            'Bluetooth 5.3',
            'Fast charging (5 min = 2 hours)',
            'Comfortable memory foam padding',
            'Foldable design with carry case',
            'Multi-device connectivity',
        ],
        specifications: {
            'Driver Size': '40mm',
            'Frequency Response': '20Hz - 20kHz',
            'Impedance': '32 Ohms',
            'Battery Life': '30 hours (ANC on)',
            'Charging Time': '2 hours',
            'Weight': '250g',
            'Bluetooth': 'Version 5.3',
            'Warranty': '2 years',
        },
        seller: {
            name: 'TechSound Official Store',
            rating: 4.8,
            products: 156,
        },
    }

    const images = Array.from({ length: 4 }, (_, i) => i)

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-blue-600">Products</Link>
                    <span>/</span>
                    <Link href="/category/electronics" className="hover:text-blue-600">Electronics</Link>
                    <span>/</span>
                    <span className="text-gray-900">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-300">
                                Product
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`aspect-square rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-blue-600 scale-105' : 'border-transparent hover:border-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <Badge className="mb-2">Best Seller</Badge>
                            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-lg">{product.rating}</span>
                                    <span className="text-gray-500">({product.reviews.toLocaleString()} reviews)</span>
                                </div>
                                <Separator orientation="vertical" className="h-6" />
                                <span className="text-gray-600">Brand: <Link href="#" className="text-blue-600 hover:underline">{product.brand}</Link></span>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <div className="flex items-baseline space-x-4 mb-2">
                                <span className="text-5xl font-bold text-blue-600">${product.price}</span>
                                <span className="text-2xl text-gray-400 line-through">${product.originalPrice}</span>
                                <Badge variant="outline" className="text-green-600 border-green-600 text-lg px-3 py-1">
                                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                </Badge>
                            </div>
                            <p className="text-sm text-gray-500">Inclusive of all taxes</p>
                        </div>

                        <Separator />

                        {/* Stock Status */}
                        <div>
                            {product.inStock ? (
                                <p className="text-green-600 font-medium flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-green-600 mr-2" />
                                    In Stock ({product.stockCount} available)
                                </p>
                            ) : (
                                <p className="text-red-600 font-medium">Out of Stock</p>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center space-x-4">
                            <span className="font-medium">Quantity:</span>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                                    disabled={quantity >= product.stockCount}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-14 text-lg">
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Add to Cart
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 border-2">
                                <Heart className="mr-2 h-5 w-5" />
                                Wishlist
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 border-2">
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Features */}
                        <Card className="p-6 bg-blue-50 border-blue-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-start space-x-3">
                                    <Truck className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">Free Delivery</p>
                                        <p className="text-sm text-gray-600">On orders over $50</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">2 Year Warranty</p>
                                        <p className="text-sm text-gray-600">Manufacturer guarantee</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <RotateCcw className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">Easy Returns</p>
                                        <p className="text-sm text-gray-600">30-day return policy</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Seller Info */}
                        <Card className="p-6">
                            <h3 className="font-semibold mb-4">Sold by</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Link href="#" className="text-blue-600 font-medium hover:underline text-lg">
                                        {product.seller.name}
                                    </Link>
                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                        <span className="flex items-center">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                            {product.seller.rating}
                                        </span>
                                        <span>{product.seller.products} products</span>
                                    </div>
                                </div>
                                <Button variant="outline">Visit Store</Button>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="space-y-8">
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold mb-6">Product Description</h2>
                        <p className="text-gray-700 leading-relaxed text-lg mb-8">{product.description}</p>

                        <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {product.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start space-x-3">
                                    <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">✓</span>
                                    <span className="text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <Card className="p-8">
                        <h2 className="text-2xl font-bold mb-6">Specifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(product.specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between py-3 border-b last:border-0">
                                    <span className="font-medium text-gray-700">{key}</span>
                                    <span className="text-gray-900">{value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
