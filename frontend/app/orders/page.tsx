'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function OrdersPage() {
    const router = useRouter()

    useEffect(() => {
        router.push('/profile?tab=orders')
    }, [router])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
    )
}
