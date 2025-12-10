'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    DollarSign,
    ShoppingBag,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal
} from 'lucide-react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

// Mock Data
const stats = [
    {
        label: 'Total Revenue',
        value: '$45,231.89',
        change: '+20.1%',
        trend: 'up',
        icon: DollarSign,
        color: 'text-green-600',
        bg: 'bg-green-50'
    },
    {
        label: 'Orders',
        value: '+2350',
        change: '+180.1%',
        trend: 'up',
        icon: ShoppingBag,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
    },
    {
        label: 'Sales',
        value: '+12,234',
        change: '+19%',
        trend: 'up',
        icon: TrendingUp,
        color: 'text-purple-600',
        bg: 'bg-purple-50'
    },
    {
        label: 'Active Customers',
        value: '+573',
        change: '-4%',
        trend: 'down',
        icon: Users,
        color: 'text-orange-600',
        bg: 'bg-orange-50'
    }
]

const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
]

const recentOrders = [
    { id: 'ORD-001', product: 'Wireless Headphones', customer: 'Alice Smith', amount: '$299.00', status: 'Pending' },
    { id: 'ORD-002', product: 'Smart Watch', customer: 'Bob Johnson', amount: '$199.00', status: 'Shipped' },
    { id: 'ORD-003', product: 'Gaming Laptop', customer: 'Charlie Brown', amount: '$1299.00', status: 'Delivered' },
    { id: 'ORD-004', product: 'Bluetooth Speaker', customer: 'Diana Ross', amount: '$89.00', status: 'Processing' },
]

export default function SellerDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-gray-500">Overview of your store's performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.label} className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <div className={`flex items-center text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stat.change}
                                    {stat.trend === 'up' ? (
                                        <ArrowUpRight className="h-3 w-3 ml-1" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 ml-1" />
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Chart */}
                <Card className="col-span-4 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-lg">Revenue Overview</h3>
                        <Button variant="outline" size="sm">Download Report</Button>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280' }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#2563EB"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Recent Orders */}
                <Card className="col-span-3 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-lg">Recent Orders</h3>
                        <Button variant="ghost" size="sm">View All</Button>
                    </div>
                    <div className="space-y-6">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">{order.product}</p>
                                    <p className="text-xs text-gray-500">{order.customer}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">{order.amount}</p>
                                    <p className={`text-xs font-medium ${order.status === 'Delivered' ? 'text-green-600' :
                                            order.status === 'Processing' ? 'text-blue-600' :
                                                'text-gray-600'
                                        }`}>
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}
