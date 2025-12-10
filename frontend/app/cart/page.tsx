'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, X, ShoppingBag, Tag } from 'lucide-react'
import Link from 'next/link'

// Mock cart data
const initialCartItems = [
    {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 299,
        originalPrice: 399,
        quantity: 1,
        inStock: true,
        image: '/api/placeholder/200/200',
    },
    {
        id: '2',
        name: 'Smart Watch Pro',
        price: 199,
        originalPrice: 299,
        quantity: 2,
        inStock: true,
        image: '/api/placeholder/200/200',
    },
    {
        id: '3',
        name: 'Ultra HD 4K Camera',
        price: 599,
        originalPrice: 799,
        quantity: 1,
        inStock: false,
        image: '/api/placeholder/200/200',
    },
]

export default function CartPage() {
    const [cartItems, setCartItems] = useState(initialCartItems)
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

    const updateQuantity = (id: string, newQuantity: number) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
            )
        )
    }

    const removeItem = (id: string) => {
        setCartItems(items => items.filter(item => item.id !== id))
    }

    const applyCoupon = () => {
        if (couponCode.trim()) {
            setAppliedCoupon(couponCode)
            setCouponCode('')
        }
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const discount = appliedCoupon ? subtotal * 0.1 : 0 // 10% discount
    const shipping = subtotal > 50 ? 0 : 10
    const tax = (subtotal - discount) * 0.08 // 8% tax
    const total = subtotal - discount + shipping + tax

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-gray-100">
                        <ShoppingBag className="h-16 w-16 text-gray-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add some items to get started!</p>
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                            <Link href="/products">Start Shopping</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">Shopping Cart ({cartItems.length} items)</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <Card key={item.id} className="p-6">
                                <div className="flex gap-6">
                                    {/* Product Image */}
                                    <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0" />

                                    {/* Product Details */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link href={`/products/${item.id}`} className="font-semibold text-lg hover:text-blue-600 transition-colors">
                                                    {item.name}
                                                </Link>
                                                {!item.inStock && (
                                                    <Badge variant="destructive" className="ml-2">Out of Stock</Badge>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-600"
                                            >
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </div>

                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-2xl font-bold text-blue-600">${item.price}</span>
                                            <span className="text-gray-400 line-through">${item.originalPrice}</span>
                                            <Badge variant="outline" className="text-green-600 border-green-600">
                                                Save {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {/* Quantity Selector */}
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-600">Quantity:</span>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={!item.inStock}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Item Total */}
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Item Total</p>
                                                <p className="text-xl font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-24">
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                            {/* Coupon Code */}
                            <div className="mb-6">
                                <label className="text-sm font-medium mb-2 block">Have a coupon?</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Enter code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Button onClick={applyCoupon} variant="outline">
                                        Apply
                                    </Button>
                                </div>
                                {appliedCoupon && (
                                    <div className="mt-2 flex items-center justify-between text-sm">
                                        <span className="text-green-600 flex items-center">
                                            ✓ Code "{appliedCoupon}" applied
                                        </span>
                                        <button
                                            onClick={() => setAppliedCoupon(null)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-6" />

                            {/* Price Breakdown */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>

                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span className="font-medium">-${discount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping</span>
                                    <span className="font-medium">
                                        {shipping === 0 ? (
                                            <Badge variant="outline" className="text-green-600 border-green-600">FREE</Badge>
                                        ) : (
                                            `$${shipping.toFixed(2)}`
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between text-gray-700">
                                    <span>Tax (8%)</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Total */}
                            <div className="flex justify-between text-xl font-bold mb-6">
                                <span>Total</span>
                                <span className="text-blue-600">${total.toFixed(2)}</span>
                            </div>

                            {/* Checkout Button */}
                            <Button
                                size="lg"
                                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg"
                                asChild
                            >
                                <Link href="/checkout">
                                    Proceed to Checkout
                                </Link>
                            </Button>

                            {/* Continue Shopping */}
                            <Button
                                variant="ghost"
                                className="w-full mt-4"
                                asChild
                            >
                                <Link href="/products">
                                    Continue Shopping
                                </Link>
                            </Button>

                            {/* Free Shipping Notice */}
                            {shipping > 0 && (
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-900">
                                        Add <span className="font-semibold">${(50 - subtotal).toFixed(2)}</span> more to get <span className="font-semibold">FREE shipping</span>!
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
