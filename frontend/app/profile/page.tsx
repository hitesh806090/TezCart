'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Package, Heart, MapPin, Bell, Settings, LogOut, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useProfile, useLogout, useUpdateProfile, useChangePassword } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import { useWishlist } from '@/hooks/useWishlist'
import { useForm } from 'react-hook-form'

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('profile')

    // Hooks
    const { data: user, isLoading: isUserLoading } = useProfile()
    const { data: orders, isLoading: isOrdersLoading } = useOrders()
    const { data: wishlist, isLoading: isWishlistLoading } = useWishlist()
    const logout = useLogout()
    const updateProfile = useUpdateProfile()
    const changePassword = useChangePassword()

    // Forms
    const profileForm = useForm({
        values: {
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
        }
    })

    const passwordForm = useForm()

    const onUpdateProfile = (data: any) => {
        updateProfile.mutate(data)
    }

    const onChangePassword = (data: any) => {
        changePassword.mutate({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        })
    }

    if (isUserLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
                    <Button asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const stats = [
        { label: 'Total Orders', value: orders?.length || 0, icon: Package },
        { label: 'Wishlist Items', value: wishlist?.items?.length || 0, icon: Heart },
        // Placeholder for saved addresses count if API supported it
        { label: 'Saved Addresses', value: user?.role === 'seller' ? 'N/A' : '1', icon: MapPin },
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
                                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white text-3xl font-bold mb-4 overflow-hidden">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                    ) : (
                                        user.name?.charAt(0) || 'U'
                                    )}
                                </div>
                                <h2 className="font-bold text-xl">{user.name}</h2>
                                <p className="text-gray-600 text-sm">{user.email}</p>
                                <Badge variant="outline" className="mt-2">
                                    Member since {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
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
                                <button
                                    onClick={logout}
                                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
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
                                    <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Full Name</label>
                                                <Input {...profileForm.register('name')} />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Email Address</label>
                                                <Input {...profileForm.register('email')} type="email" disabled className="bg-gray-100" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                                                <Input {...profileForm.register('phone')} type="tel" />
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={updateProfile.isPending}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                        >
                                            {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save Changes
                                        </Button>
                                    </form>
                                </Card>

                                {/* Change Password */}
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold mb-6">Change Password</h2>
                                    <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-6">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Current Password</label>
                                            <Input {...passwordForm.register('currentPassword')} type="password" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">New Password</label>
                                                <Input {...passwordForm.register('newPassword')} type="password" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Confirm Password</label>
                                                <Input {...passwordForm.register('confirmPassword')} type="password" />
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            type="submit"
                                            disabled={changePassword.isPending}
                                        >
                                            {changePassword.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Update Password
                                        </Button>
                                    </form>
                                </Card>
                            </>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
                                {isOrdersLoading ? (
                                    <div className="flex justify-center p-8">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                    </div>
                                ) : !orders || orders.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No orders found.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order: any) => (
                                            <div key={order.id} className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-semibold text-lg">{order.orderNumber || order.id}</h3>
                                                            <Badge className={`${order.status === 'delivered' ? 'bg-green-600' :
                                                                order.status === 'shipped' ? 'bg-blue-600' :
                                                                    'bg-orange-600'
                                                                }`}>
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                                                            <span>•</span>
                                                            <span>{order.items?.length || 0} items</span>
                                                            <span>•</span>
                                                            <span className="font-semibold text-gray-900">${order.totalAmount}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={`/orders/${order.id}`}>View Details</Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <Button variant="outline" className="w-full mt-6">View All Orders</Button>
                            </Card>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                            <Card className="p-12 text-center">
                                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-2">View Your Wishlist</h2>
                                <p className="text-gray-600 mb-6">{wishlist?.items?.length || 0} items saved in your wishlist</p>
                                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    <Link href="/wishlist">Go to Wishlist</Link>
                                </Button>
                            </Card>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>
                                <p className="text-gray-600">Manage your delivery addresses</p>
                                <Button className="mt-6">Add New Address</Button>
                            </Card>
                        )}

                        {/* Notifications & Settings placeholders */}
                        {(activeTab === 'notifications' || activeTab === 'settings') && (
                            <Card className="p-12 text-center">
                                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
                                <p className="text-gray-600">This feature is under development.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
