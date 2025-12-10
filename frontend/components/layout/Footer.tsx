import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export function Footer() {
    return (
        <footer className="border-t bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                                <span className="text-xl font-bold text-white">T</span>
                            </div>
                            <span className="text-xl font-bold">TezCart</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Your trusted marketplace for quality products from verified sellers worldwide.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                <Youtube className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Shop</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/products" className="hover:text-blue-600 transition-colors">All Products</Link></li>
                            <li><Link href="/categories" className="hover:text-blue-600 transition-colors">Categories</Link></li>
                            <li><Link href="/deals" className="hover:text-blue-600 transition-colors">Deals</Link></li>
                            <li><Link href="/new-arrivals" className="hover:text-blue-600 transition-colors">New Arrivals</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/help" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
                            <li><Link href="/track-order" className="hover:text-blue-600 transition-colors">Track Order</Link></li>
                            <li><Link href="/returns" className="hover:text-blue-600 transition-colors">Returns</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Sell */}
                    <div>
                        <h3 className="font-semibold mb-4">Sell on TezCart</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/seller/register" className="hover:text-blue-600 transition-colors">Become a Seller</Link></li>
                            <li><Link href="/seller/dashboard" className="hover:text-blue-600 transition-colors">Seller Dashboard</Link></li>
                            <li><Link href="/seller/guide" className="hover:text-blue-600 transition-colors">Seller Guide</Link></li>
                            <li><Link href="/seller/support" className="hover:text-blue-600 transition-colors">Seller Support</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t pt-8 text-center text-sm text-gray-600">
                    <p>&copy; {new Date().getFullYear()} TezCart. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
