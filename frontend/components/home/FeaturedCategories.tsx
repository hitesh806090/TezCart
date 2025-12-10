import Link from 'next/link'
import { Smartphone, Laptop, Shirt, Home, Dumbbell, Book } from 'lucide-react'

const categories = [
    { name: 'Electronics', icon: Smartphone, color: 'from-blue-500 to-cyan-500', href: '/category/electronics' },
    { name: 'Computers', icon: Laptop, color: 'from-purple-500 to-pink-500', href: '/category/computers' },
    { name: 'Fashion', icon: Shirt, color: 'from-pink-500 to-rose-500', href: '/category/fashion' },
    { name: 'Home & Living', icon: Home, color: 'from-green-500 to-emerald-500', href: '/category/home' },
    { name: 'Sports & Fitness', icon: Dumbbell, color: 'from-orange-500 to-red-500', href: '/category/sports' },
    { name: 'Books & Media', icon: Book, color: 'from-indigo-500 to-purple-500', href: '/category/books' },
]

export function FeaturedCategories() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
                    <p className="text-gray-600 text-lg">Explore our wide range of products</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((category) => {
                        const Icon = category.icon
                        return (
                            <Link
                                key={category.name}
                                href={category.href}
                                className="group"
                            >
                                <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                    <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>
                                    <span className="font-medium text-center text-sm">{category.name}</span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
