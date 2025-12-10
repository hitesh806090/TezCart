'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Wallet, Building2, DollarSign, Check, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

const cartItems = [
    { id: '1', name: 'Premium Wireless Headphones', price: 299, quantity: 1 },
    { id: '2', name: 'Smart Watch Pro', price: 199, quantity: 2 },
]

export default function CheckoutPage() {
    const router = useRouter()
    const [step, setStep] = useState<'address' | 'payment' | 'review'>('address')
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const addresses = [
        { id: '1', type: 'Home', name: 'John Doe', address: '123 Main St, New York, NY 10001', phone: '+1 234 567 8900' },
        { id: '2', type: 'Work', name: 'John Doe', address: '456 Office Blvd, New York, NY 10002', phone: '+1 234 567 8900' },
    ]

    const paymentMethods = [
        { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
        { id: 'upi', name: 'UPI', icon: Wallet, description: 'Google Pay, PhonePe, Paytm' },
        { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'All major banks' },
        { id: 'cod', name: 'Cash on Delivery', icon: DollarSign, description: 'Pay when you receive' },
    ]

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = 0
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    const handlePlaceOrder = async () => {
        setLoading(true)
        // TODO: Implement actual order placement
        setTimeout(() => {
            setLoading(false)
            router.push('/order-success')
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">Checkout</h1>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-4">
                        {['address', 'payment', 'review'].map((s, idx) => (
                            <div key={s} className="flex items-center">
                                <div className={`flex items-center justify-center h-10 w-10 rounded-full font-semibold ${step === s ? 'bg-blue-600 text-white' :
                                        ['address', 'payment', 'review'].indexOf(step) > idx ? 'bg-green-600 text-white' :
                                            'bg-gray-200 text-gray-600'
                                    }`}>
                                    {['address', 'payment', 'review'].indexOf(step) > idx ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        idx + 1
                                    )}
                                </div>
                                <span className="ml-2 font-medium capitalize hidden sm:inline">{s}</span>
                                {idx < 2 && <div className="w-16 h-0.5 bg-gray-300 mx-4" />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Address Selection */}
                        {step === 'address' && (
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>

                                <div className="space-y-4">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => setSelectedAddress(addr.id)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAddress === addr.id
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="outline">{addr.type}</Badge>
                                                        <h3 className="font-semibold">{addr.name}</h3>
                                                    </div>
                                                    <p className="text-gray-700 mb-2">{addr.address}</p>
                                                    <p className="text-gray-600 text-sm">{addr.phone}</p>
                                                </div>
                                                {selectedAddress === addr.id && (
                                                    <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                                                        <Check className="h-4 w-4 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <Button variant="outline" className="w-full h-12">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        Add New Address
                                    </Button>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    onClick={() => setStep('payment')}
                                    disabled={!selectedAddress}
                                >
                                    Continue to Payment
                                </Button>
                            </Card>
                        )}

                        {/* Payment Method */}
                        {step === 'payment' && (
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

                                <div className="space-y-4">
                                    {paymentMethods.map((method) => {
                                        const Icon = method.icon
                                        return (
                                            <div
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === method.id
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${paymentMethod === method.id ? 'bg-blue-600' : 'bg-gray-100'
                                                            }`}>
                                                            <Icon className={`h-6 w-6 ${paymentMethod === method.id ? 'text-white' : 'text-gray-600'}`} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold">{method.name}</h3>
                                                            <p className="text-sm text-gray-600">{method.description}</p>
                                                        </div>
                                                    </div>
                                                    {paymentMethod === method.id && (
                                                        <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                                                            <Check className="h-4 w-4 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="mt-6 space-y-4 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Card Number</label>
                                            <Input placeholder="1234 5678 9012 3456" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Expiry</label>
                                                <Input placeholder="MM/YY" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">CVV</label>
                                                <Input placeholder="123" type="password" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 mt-6">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setStep('address')}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        size="lg"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        onClick={() => setStep('review')}
                                        disabled={!paymentMethod}
                                    >
                                        Review Order
                                    </Button>
                                </div>
                            </Card>
                        )}

                        {/* Order Review */}
                        {step === 'review' && (
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>

                                {/* Items */}
                                <div className="space-y-4 mb-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="font-semibold">{item.name}</h3>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            </div>
                                            <span className="font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Delivery Address */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">Delivery Address</h3>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="font-medium">{addresses.find(a => a.id === selectedAddress)?.name}</p>
                                        <p className="text-gray-700">{addresses.find(a => a.id === selectedAddress)?.address}</p>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">Payment Method</h3>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="font-medium">{paymentMethods.find(p => p.id === paymentMethod)?.name}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setStep('payment')}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        size="lg"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                    >
                                        {loading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping</span>
                                    <span className="font-medium">
                                        <Badge variant="outline" className="text-green-600 border-green-600">FREE</Badge>
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Tax</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="flex justify-between text-xl font-bold mb-6">
                                <span>Total</span>
                                <span className="text-blue-600">${total.toFixed(2)}</span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-start space-x-2">
                                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>Free delivery on orders over $50</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>30-day easy returns</span>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>Secure payment</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
