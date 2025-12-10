'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Package, Heart, MapPin, Bell, Settings, LogOut, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const recentOrders = [
    {
        id: 'ORD-2024-001',
        date: '2024-12-08',
        status: 'delivered',
        total: 697,
        items: 3,
    },
    {
        id: 'ORD-2024-002',
        date: '2024-12-05',
        status: 'shipped',
        total: 299,
        items: 1,
    },
    {
        id: 'ORD-2024-003',
        date: '2024-12-01',
        status: 'processing',
        total: 149,
        items: 2,
    },
]

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('profile')

    const user = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 234 567 8900',
        avatar: null,
        memberSince: '2024-01-15',
    }

    const stats = [
        { label: 'Total Orders', value: '24', icon: Package },
        { label: 'Wishlist Items', value: '12', icon: Heart },
        { label: 'Saved Addresses', value: '3', icon: MapPin },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">My Account</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <Card className="p-6">
                            {/* User Info */}
                            <div className="text-center mb-6">
                                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-3xl font-bold mb-4">
                                    {user.name.charAt(0)}
                                </div>
                                <h2 className="font-bold text-xl">{user.name}</h2>
                                <p className="text-gray-600 text-sm">{user.email}</p>
                                <Badge variant="outline" className="mt-2">
                                    Member since {new Date(user.memberSince).getFullYear()}
                                </Badge>
                            </div>

                            <Separator className="my-6" />

                            {/* Navigation */}
                            <nav className="space-y-2">
                                {[
                                    { id: 'profile', label: 'Profile Details', icon: User },
                                    { id: 'orders', label: 'My Orders', icon: Package },
                                    { id: 'wishlist', label: 'Wishlist', icon: Heart },
                                    { id: 'addresses', label: 'Addresses', icon: MapPin },
                                    { id: 'notifications', label: 'Notifications', icon: Bell },
                                    { id: 'settings', label: 'Settings', icon: Settings },
                                ].map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                                    : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Icon className="h-5 w-5" />
                                                <span>{item.label}</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    )
                                })}
                                <button className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <LogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </div>
                                </button>
                            </nav>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <>
                                {/* Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {stats.map((stat) => {
                                        const Icon = stat.icon
                                        return (
                                            <Card key={stat.label} className="p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                                                        <p className="text-3xl font-bold">{stat.value}</p>
                                                    </div>
                                                    <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                                                        <Icon className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                </div>
                                            </Card>
                                        )
                                    })}
                                </div>

                                {/* Profile Form */}
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                                    <form className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Full Name</label>
                                                <Input defaultValue={user.name} />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Email Address</label>
                                                <Input defaultValue={user.email} type="email" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                                                <Input defaultValue={user.phone} type="tel" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Date of Birth</label>
                                                <Input type="date" />
                                            </div>
                                        </div>
                                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                            Save Changes
                                        </Button>
                                    </form>
                                </Card>

                                {/* Change Password */}
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-6">Change Password</h2>
                                    <form className="space-y-6">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Current Password</label>
                                            <Input type="password" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">New Password</label>
                                                <Input type="password" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Confirm Password</label>
                                                <Input type="password" />
                                            </div>
                                        </div>
                                        <Button variant="outline">Update Password</Button>
                                    </form>
                                </Card>
                            </>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <div key={order.id} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-semibold text-lg">{order.id}</h3>
                                                        <Badge className={`${order.status === 'delivered' ? 'bg-green-600' :
                                                                order.status === 'shipped' ? 'bg-blue-600' :
                                                                    'bg-orange-600'
                                                            }`}>
                                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span>Placed: {new Date(order.date).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span>{order.items} items</span>
                                                        <span>•</span>
                                                        <span className="font-semibold text-gray-900">${order.total}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm">View Details</Button>
                                                    {order.status === 'delivered' && (
                                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                                            Buy Again
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full mt-6">View All Orders</Button>
                            </Card>
                        )}

                        {/* Other tabs would have similar content */}
                        {activeTab === 'wishlist' && (
                            <Card className="p-12 text-center">
                                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-2">View Your Wishlist</h2>
                                <p className="text-gray-600 mb-6">12 items saved in your wishlist</p>
                                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    <Link href="/wishlist">Go to Wishlist</Link>
                                </Button>
                            </Card>
                        )}

                        {activeTab === 'addresses' && (
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>
                                <p className="text-gray-600">Manage your delivery addresses</p>
                                <Button className="mt-6">Add New Address</Button>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
