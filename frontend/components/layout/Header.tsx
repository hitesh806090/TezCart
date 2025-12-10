'use client'

import Link from 'next/link'
import { ShoppingCart, Search, User, Heart, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'

export function Header() {
    const { isAuthenticated, user } = useAuthStore()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4">
                {/* Top bar */}
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                            <span className="text-xl font-bold text-white">T</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            TezCart
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search for products, brands, and more..."
                                className="w-full pl-10 pr-4 h-11 rounded-full border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                        {isAuthenticated ? (
                            <>
                                <Button variant="ghost" size="icon" className="relative" asChild>
                                    <Link href="/wishlist">
                                        <Heart className="h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button variant="ghost" size="icon" className="relative" asChild>
                                    <Link href="/cart">
                                        <ShoppingCart className="h-5 w-5" />
                                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                                            0
                                        </span>
                                    </Link>
                                </Button>
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href="/profile">
                                        <User className="h-5 w-5" />
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" asChild>
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    <Link href="/register">Sign Up</Link>
                                </Button>
                            </>
                        )}
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex h-12 items-center space-x-6 text-sm font-medium">
                    <Link href="/categories" className="transition-colors hover:text-blue-600">
                        Categories
                    </Link>
                    <Link href="/deals" className="transition-colors hover:text-blue-600">
                        Today's Deals
                    </Link>
                    <Link href="/sellers" className="transition-colors hover:text-blue-600">
                        Sellers
                    </Link>
                    <Link href="/new-arrivals" className="transition-colors hover:text-blue-600">
                        New Arrivals
                    </Link>
                    <Link href="/trending" className="transition-colors hover:text-blue-600">
                        Trending
                    </Link>
                </nav>
            </div>
        </header>
    )
}
