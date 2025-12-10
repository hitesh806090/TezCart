'use client'

import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Loader2, Package, Truck, CheckCircle, MapPin, CreditCard, ArrowLeft, Download } from 'lucide-react'
import { useOrder } from '@/hooks/useOrders'
import Link from 'next/link'

// Helper to format date
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Helper for status color
const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
        case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200'
        case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
        case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
        case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
        default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
}

export default function OrderDetailPage() {
    const params = useParams()
    const { data: order, isLoading, error } = useOrder(params.id as string)

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="h-8 w-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
                    <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
                    <Button asChild variant="outline">
                        <Link href="/profile">Back to Orders</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Link href="/profile" className="text-gray-500 hover:text-gray-700 transition-colors">
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                                <h1 className="text-2xl font-bold">Order #{order.orderNumber || order.id.slice(0, 8)}</h1>
                                <Badge variant="outline" className={getStatusColor(order.status)}>
                                    {order.status.toUpperCase()}
                                </Badge>
                            </div>
                            <p className="text-gray-500 pl-7">
                                Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <div className="flex gap-2 pl-7 md:pl-0">
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Invoice
                            </Button>
                            <Button variant="outline">Allow Return</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="overflow-hidden">
                            <div className="p-6 bg-gray-50/50 border-b">
                                <h2 className="font-semibold text-lg flex items-center">
                                    <Package className="mr-2 h-5 w-5 text-blue-600" />
                                    Order Items ({order.items.length})
                                </h2>
                            </div>
                            <div className="divide-y">
                                {order.items.map((item) => (
                                    <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4">
                                        <div className="h-20 w-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                            {item.productSnapshot.image && (
                                                <img
                                                    src={item.productSnapshot.image}
                                                    alt={item.productSnapshot.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-lg mb-1">{item.productSnapshot.name}</h3>
                                            <p className="text-sm text-gray-500 mb-2">SKU: {item.productSnapshot.sku}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="text-sm">
                                                    Quantity: <span className="font-medium">{item.quantity}</span>
                                                </div>
                                                <div className="font-bold text-lg">
                                                    ${item.price.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Order Timeline (Mock for now, could be real if backend provided history) */}
                        <Card className="p-6">
                            <h2 className="font-semibold text-lg mb-6 flex items-center">
                                <Truck className="mr-2 h-5 w-5 text-blue-600" />
                                Order Status
                            </h2>
                            <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                                <div className="relative">
                                    <div className="absolute -left-8 top-1 h-6 w-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Order Placed</p>
                                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                    </div>
                                </div>
                                {/* Pending/Processing states would go here based on current status */}
                                {['shipped', 'delivered'].includes(order.status) && (
                                    <div className="relative">
                                        <div className="absolute -left-8 top-1 h-6 w-6 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                                            <Truck className="h-3 w-3 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Shipped</p>
                                            <p className="text-sm text-gray-500">Carrier: FedEx</p>
                                        </div>
                                    </div>
                                )}
                                {order.status === 'delivered' && (
                                    <div className="relative">
                                        <div className="absolute -left-8 top-1 h-6 w-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                                            <Package className="h-3 w-3 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Delivered</p>
                                            <p className="text-sm text-gray-500">Your item has been delivered</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Order Summary */}
                        <Card className="p-6">
                            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                            <div className="space-y-3 mb-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${order.subtotal?.toFixed(2) || (order.totalAmount - (order.shippingCost || 0)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">${order.shippingCost?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">${order.tax?.toFixed(2) || '0.00'}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-${order.discount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                            <Separator className="my-4" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-blue-600">${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2 text-sm text-gray-600">
                                <CreditCard className="h-4 w-4" />
                                <span className="capitalize">Payment: {order.paymentMethod.replace('_', ' ')}</span>
                            </div>
                        </Card>

                        {/* Shipping Address */}
                        <Card className="p-6">
                            <h2 className="font-semibold text-lg mb-4 flex items-center">
                                <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                                Shipping Address
                            </h2>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.country}</p>
                                <p className="mt-2 text-gray-500">{order.shippingAddress.phone}</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
