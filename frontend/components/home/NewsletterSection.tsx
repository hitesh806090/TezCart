import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'

export function NewsletterSection() {
    return (
        <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center text-white space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold">Stay in the Loop</h2>
                        <p className="text-xl text-blue-100">
                            Subscribe to our newsletter and get exclusive deals, new arrivals, and insider news.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <div className="relative flex-1">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white"
                            />
                        </div>
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 h-12 px-8">
                            Subscribe
                        </Button>
                    </div>

                    <p className="text-sm text-blue-100">
                        Join 50,000+ subscribers. No spam, unsubscribe anytime.
                    </p>
                </div>
            </div>
        </section>
    )
}
