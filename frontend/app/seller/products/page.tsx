'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye
} from 'lucide-react'
import Link from 'next/link'

// Mock Products
const mockProducts = [
    {
        id: '1',
        name: 'Wireless Noise Cancelling Headphones',
        category: 'Electronics',
        price: 299.99,
        stock: 45,
        status: 'Active',
        sales: 120,
        image: '/api/placeholder/40'
    },
    {
        id: '2',
        name: 'Smart Watch Series 7',
        category: 'Electronics',
        price: 399.00,
        stock: 12,
        status: 'Low Stock',
        sales: 85,
        image: '/api/placeholder/40'
    },
    {
        id: '3',
        name: 'Cotton T-Shirt Basic',
        category: 'Fashion',
        price: 24.99,
        stock: 150,
        status: 'Active',
        sales: 450,
        image: '/api/placeholder/40'
    },
    {
        id: '4',
        name: 'Gaming Mouse Pro',
        category: 'Electronics',
        price: 89.99,
        stock: 0,
        status: 'Out of Stock',
        sales: 210,
        image: '/api/placeholder/40'
    }
]

export default function SellerProductsPage() {
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-gray-500">Manage your product inventory</p>
                </div>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Link href="/seller/products/add">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Link>
                </Button>
            </div>

            <Card className="p-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search products..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500">Product</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Category</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Price</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Stock</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Sales</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {mockProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <span className="text-xs text-gray-500">IMG</span>
                                            </div>
                                            <span className="font-medium">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4 font-medium">${product.price}</td>
                                    <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className={
                                            product.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                                                product.status === 'Low Stock' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    'bg-red-50 text-red-700 border-red-200'
                                        }>
                                            {product.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{product.sales}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
