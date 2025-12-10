import { Truck, Shield, Headset, RotateCcw } from 'lucide-react'

const features = [
    {
        icon: Truck,
        title: 'Free Shipping',
        description: 'On orders over $50',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Shield,
        title: 'Secure Payment',
        description: '100% secure transactions',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: Headset,
        title: '24/7 Support',
        description: 'Dedicated customer service',
        color: 'from-green-500 to-emerald-500'
    },
    {
        icon: RotateCcw,
        title: 'Easy Returns',
        description: '30-day return policy',
        color: 'from-orange-500 to-red-500'
    },
]

export function FeaturesSection() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => {
                        const Icon = feature.icon
                        return (
                            <div key={feature.title} className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                                <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                                    <Icon className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
