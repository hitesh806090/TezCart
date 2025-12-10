'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Wallet, Building2, DollarSign, Check, MapPin, Loader2, ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useCheckout } from '@/hooks/useOrders'
import { useForm } from 'react-hook-form'
import { Address } from '@/types'
import Link from 'next/link'

export default function CheckoutPage() {
    const router = useRouter()
    const { data: cart, isLoading: isCartLoading } = useCart()
    const checkoutMutation = useCheckout()

    const [step, setStep] = useState<'address' | 'payment' | 'review'>('address')
    const [paymentMethod, setPaymentMethod] = useState<string>('cod')

    // Address Form
    const addressForm = useForm<Address>({
        defaultValues: {
            type: 'home',
            fullName: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'USA',
        }
    })

    const paymentMethods = [
        { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
        { id: 'upi', name: 'UPI', icon: Wallet, description: 'Google Pay, PhonePe, Paytm' },
        { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'All major banks' },
        { id: 'cod', name: 'Cash on Delivery', icon: DollarSign, description: 'Pay when you receive' },
    ]

    const handlePlaceOrder = async () => {
        const addressData = addressForm.getValues()
        // Ensure required fields are present if form validation didn't catch them (though handleSubmit usually does)

        checkoutMutation.mutate({
            shippingAddress: addressData,
            billingAddress: addressData, // Use same for billing for simplicity
            paymentMethod: paymentMethod,
            couponCode: cart?.couponCode
        }, {
            onSuccess: (data) => {
                // Determine order ID to redirect if returned, otherwise generic success
                // API response might be the order object
                const orderId = data?.id
                if (orderId) {
                    // Optionally redirect to order details
                }
                router.push('/order-success')
            },
            onError: (error) => {
                console.error("Checkout failed", error)
                // In a real app, show toast notification
            }
        })
    }

    if (isCartLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="p-8 text-center max-w-md w-full">
                    <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Wallet className="h-10 w-10 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                    <p className="text-gray-600 mb-8">Add some items to your cart to proceed with checkout.</p>
                    <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                        <Link href="/products">Browse Products</Link>
                    </Button>
                </Card>
            </div>
        )
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
                                <div className={`flex items-center justify-center h-10 w-10 rounded-full font-semibold transition-colors ${step === s ? 'bg-blue-600 text-white' :
                                    ['address', 'payment', 'review'].indexOf(step) > idx ? 'bg-green-600 text-white' :
                                        'bg-gray-200 text-gray-600'
                                    }`}>
                                    {['address', 'payment', 'review'].indexOf(step) > idx ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        idx + 1
                                    )}
                                </div>
                                <span className={`ml-2 font-medium capitalize hidden sm:inline ${step === s ? 'text-blue-600' : 'text-gray-500'}`}>{s}</span>
                                {idx < 2 && <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${['address', 'payment', 'review'].indexOf(step) > idx ? 'bg-green-600' : 'bg-gray-200'}`} />}
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
                                <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                                <form id="address-form" onSubmit={addressForm.handleSubmit(() => setStep('payment'))}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Full Name</label>
                                            <Input {...addressForm.register('fullName', { required: true })} placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Phone</label>
                                            <Input {...addressForm.register('phone', { required: true })} placeholder="+1 234 567 890" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <label className="text-sm font-medium">Address Line 1</label>
                                        <Input {...addressForm.register('addressLine1', { required: true })} placeholder="123 Main St" />
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <label className="text-sm font-medium">Address Line 2 (Optional)</label>
                                        <Input {...addressForm.register('addressLine2')} placeholder="Apt 4B" />
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                        <div className="space-y-2 col-span-2 sm:col-span-1">
                                            <label className="text-sm font-medium">City</label>
                                            <Input {...addressForm.register('city', { required: true })} placeholder="New York" />
                                        </div>
                                        <div className="space-y-2 col-span-2 sm:col-span-1">
                                            <label className="text-sm font-medium">State</label>
                                            <Input {...addressForm.register('state', { required: true })} placeholder="NY" />
                                        </div>
                                        <div className="space-y-2 col-span-2 sm:col-span-1">
                                            <label className="text-sm font-medium">ZIP</label>
                                            <Input {...addressForm.register('postalCode', { required: true })} placeholder="10001" />
                                        </div>
                                        <div className="space-y-2 col-span-2 sm:col-span-1">
                                            <label className="text-sm font-medium">Country</label>
                                            <Input {...addressForm.register('country', { required: true })} placeholder="USA" />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        Continue to Payment
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </form>
                            </Card>
                        )}

                        {/* Payment Method */}
                        {step === 'payment' && (
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

                                <div className="space-y-4 mb-8">
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
                                    <div className="mb-6 space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
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

                                <div className="flex gap-4">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setStep('address')}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button
                                        size="lg"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        onClick={() => setStep('review')}
                                        disabled={!paymentMethod}
                                    >
                                        Review Order
                                        <ArrowRight className="ml-2 h-4 w-4" />
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
                                    {cart.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="font-semibold">{item.productSnapshot.name}</h3>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            </div>
                                            <span className="font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Delivery Address Preview */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">Delivery Address</h3>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="font-medium">{addressForm.getValues('fullName')}</p>
                                        <p className="text-gray-700">
                                            {addressForm.getValues('addressLine1')}
                                            {addressForm.getValues('addressLine2') && `, ${addressForm.getValues('addressLine2')}`}, {' '}
                                            {addressForm.getValues('city')}, {addressForm.getValues('state')} {addressForm.getValues('postalCode')}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">{addressForm.getValues('phone')}</p>
                                    </div>
                                </div>

                                {/* Payment Method Preview */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">Payment Method</h3>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            {paymentMethods.find(p => p.id === paymentMethod)?.icon({ className: "h-5 w-5" })}
                                        </div>
                                        <div>
                                            <p className="font-medium">{paymentMethods.find(p => p.id === paymentMethod)?.name}</p>
                                            <p className="text-xs text-gray-500">{paymentMethods.find(p => p.id === paymentMethod)?.description}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setStep('payment')}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button
                                        size="lg"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        onClick={handlePlaceOrder}
                                        disabled={checkoutMutation.isPending}
                                    >
                                        {checkoutMutation.isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            `Place Order - $${cart.total.toFixed(2)}`
                                        )}
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
                                    <span>Subtotal ({cart.items.length} items)</span>
                                    <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping</span>
                                    <span className="font-medium">
                                        {cart.shipping === 0 ? (
                                            <Badge variant="outline" className="text-green-600 border-green-600">FREE</Badge>
                                        ) : (
                                            `$${cart.shipping.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Tax</span>
                                    <span className="font-medium">${cart.tax.toFixed(2)}</span>
                                </div>
                                {cart.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span className="font-medium">-${cart.discount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-4" />

                            <div className="flex justify-between text-xl font-bold mb-6">
                                <span>Total</span>
                                <span className="text-blue-600">${cart.total.toFixed(2)}</span>
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
