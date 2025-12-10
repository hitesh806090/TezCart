import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, Truck, Download, Home } from 'lucide-react'
import Link from 'next/link'

export default function OrderSuccessPage() {
    const orderNumber = 'ORD-2024-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <Card className="p-12 text-center shadow-2xl">
                    {/* Success Icon */}
                    <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 animate-bounce">
                        <CheckCircle className="h-12 w-12 text-white" />
                    </div>

                    {/* Success Message */}
                    <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Thank you for your purchase. Your order has been confirmed.
                    </p>

                    {/* Order Number */}
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 rounded-full mb-8">
                        <span className="text-gray-600">Order Number:</span>
                        <span className="font-bold text-blue-600 text-lg">{orderNumber}</span>
                    </div>

                    {/* Estimated Delivery */}
                    <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <Truck className="h-6 w-6 text-blue-600" />
                            <h3 className="font-semibold text-lg">Estimated Delivery</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{estimatedDelivery}</p>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-14" asChild>
                            <Link href={`/orders/${orderNumber}`}>
                                <Package className="mr-2 h-5 w-5" />
                                Track Order
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-14">
                            <Download className="mr-2 h-5 w-5" />
                            Download Invoice
                        </Button>
                    </div>

                    <Button variant="ghost" size="lg" asChild>
                        <Link href="/">
                            <Home className="mr-2 h-5 w-5" />
                            Back to Home
                        </Link>
                    </Button>

                    {/* Info */}
                    <div className="mt-8 pt-8 border-t text-left space-y-4">
                        <h3 className="font-semibold mb-4">What's Next?</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    1
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Order Confirmation</p>
                                    <p>You will receive an email confirmation with order details</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    2
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Order Processing</p>
                                    <p>We'll prepare your items for shipment</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    3
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Track Delivery</p>
                                    <p>Real-time tracking updates will be sent to your email</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Help Link */}
                <p className="text-center mt-8 text-gray-600">
                    Need help with your order?{' '}
                    <Link href="/support" className="text-blue-600 hover:underline font-medium">
                        Contact Support
                    </Link>
                </p>
            </div>
        </div>
    )
}
