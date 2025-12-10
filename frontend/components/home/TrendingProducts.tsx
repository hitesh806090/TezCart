import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import Link from 'next/link'

// Mock data - will be replaced with API call
const products = [
    {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 299,
        originalPrice: 399,
        image: '/api/placeholder/400/400',
        rating: 4.5,
        reviews: 128,
        badge: 'Best Seller'
    },
    {
        id: '2',
        name: 'Smart Watch Pro',
        price: 199,
        originalPrice: 299,
        image: '/api/placeholder/400/400',
        rating: 4.8,
        reviews: 256,
        badge: 'New'
    },
    {
        id: '3',
        name: 'Ultra HD 4K Camera',
        price: 599,
        originalPrice: 799,
        image: '/api/placeholder/400/400',
        rating: 4.7,
        reviews: 89,
        badge: 'Trending'
    },
    {
        id: '4',
        name: 'Gaming Laptop Pro',
        price: 1299,
        originalPrice: 1599,
        image: '/api/placeholder/400/400',
        rating: 4.9,
        reviews: 342,
        badge: 'Premium'
    },
]

export function TrendingProducts() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Trending Products</h2>
                    <p className="text-gray-600 text-lg">Hot deals you don't want to miss!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                            <div className="relative">
                                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-105 transition-transform duration-300" />
                                <Badge className="absolute top-4 left-4 bg-blue-600">{product.badge}</Badge>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
                                >
                                    <Heart className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="p-4 space-y-3">
                                <Link href={`/products/${product.id}`}>
                                    <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-2">
                                        {product.name}
                                    </h3>
                                </Link>

                                <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{product.rating}</span>
                                    <span className="text-gray-500 text-sm">({product.reviews})</span>
                                </div>

                                <div className="flex items-baseline space-x-2">
                                    <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                                    <span className="text-gray-400 line-through">${product.originalPrice}</span>
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                        Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                    </Badge>
                                </div>

                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Add to Cart
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button size="lg" variant="outline" className="border-2" asChild>
                        <Link href="/products">View All Products</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
