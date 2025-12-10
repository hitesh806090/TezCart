import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] opacity-20" />

            <div className="container relative mx-auto px-4 py-20 md:py-32">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    {/* Left Content */}
                    <div className="flex flex-col justify-center space-y-8">
                        <div className="inline-flex items-center rounded-full border border-blue-200 bg-white/50 px-4 py-2 backdrop-blur-sm w-fit">
                            <Sparkles className="mr-2 h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">New Arrivals Every Day</span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-5xl font-bold leading-tight tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
                                Shop{' '}
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Smarter
                                </span>
                                <br />
                                Live Better
                            </h1>
                            <p className="text-xl text-gray-600 md:text-2xl max-w-xl">
                                Discover amazing products from verified sellers. Quality guaranteed, prices unbeatable.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg h-14 px-8"
                                asChild
                            >
                                <Link href="/products">
                                    Start Shopping
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-lg h-14 px-8 border-2"
                                asChild
                            >
                                <Link href="/categories">
                                    Browse Categories
                                </Link>
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t">
                            <div>
                                <div className="text-3xl font-bold text-gray-900">10K+</div>
                                <div className="text-sm text-gray-600">Products</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">500+</div>
                                <div className="text-sm text-gray-600">Sellers</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">50K+</div>
                                <div className="text-sm text-gray-600">Happy Customers</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative hidden lg:block">
                        <div className="relative h-[600px] w-full">
                            {/* Floating Cards */}
                            <div className="absolute top-20 left-0 w-72 rounded-2xl bg-white p-6 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform">
                                <div className="h-48 w-full rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 mb-4" />
                                <h3 className="font-semibold mb-2">Premium Headphones</h3>
                                <p className="text-2xl font-bold text-blue-600">$299</p>
                            </div>

                            <div className="absolute top-40 right-0 w-64 rounded-2xl bg-white p-6 shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform">
                                <div className="h-40 w-full rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 mb-4" />
                                <h3 className="font-semibold mb-2">Smart Watch</h3>
                                <p className="text-2xl font-bold text-purple-600">$199</p>
                            </div>

                            <div className="absolute bottom-20 left-10 w-64 rounded-2xl bg-white p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
                                <div className="h-40 w-full rounded-lg bg-gradient-to-br from-pink-100 to-orange-100 mb-4" />
                                <h3 className="font-semibold mb-2">Wireless Earbuds</h3>
                                <p className="text-2xl font-bold text-pink-600">$99</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
