'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Upload, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AddProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<string[]>([])
    const [specs, setSpecs] = useState<{ key: string, value: string }[]>([{ key: '', value: '' }])

    const handleAddSpec = () => {
        setSpecs([...specs, { key: '', value: '' }])
    }

    const handleRemoveSpec = (index: number) => {
        setSpecs(specs.filter((_, i) => i !== index))
    }

    const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...specs]
        newSpecs[index][field] = value
        setSpecs(newSpecs)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // TODO: Implement API call
        setTimeout(() => {
            setLoading(false)
            router.push('/seller/products')
        }, 1500)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/seller/products">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
                    <p className="text-gray-500">Fill in the details to list your product</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Details */}
                <Card className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Basic Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Product Name</label>
                            <Input placeholder="e.g. Wireless Headphones" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Category</label>
                                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
                                    <option value="">Select Category</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="home">Home & Living</option>
                                    <option value="books">Books</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Brand</label>
                                <Input placeholder="e.g. Sony, Nike" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Description</label>
                            <textarea
                                className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Describe your product..."
                            />
                        </div>
                    </div>
                </Card>

                {/* Media */}
                <Card className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Product Images</h2>

                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                            <Upload className="h-12 w-12" />
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    </div>
                </Card>

                {/* Pricing & Inventory */}
                <Card className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Pricing & Inventory</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Regular Price ($)</label>
                            <Input type="number" placeholder="0.00" min="0" step="0.01" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Sale Price ($)</label>
                            <Input type="number" placeholder="0.00" min="0" step="0.01" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Stock Quantity</label>
                            <Input type="number" placeholder="0" min="0" />
                        </div>
                    </div>
                </Card>

                {/* Specifications */}
                <Card className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Specifications</h2>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddSpec}>
                            <Plus className="h-4 w-4 mr-2" /> Add Spec
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {specs.map((spec, index) => (
                            <div key={index} className="flex gap-4">
                                <Input
                                    placeholder="Key (e.g. Color)"
                                    value={spec.key}
                                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                                />
                                <Input
                                    placeholder="Value (e.g. Red)"
                                    value={spec.value}
                                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveSpec(index)}
                                    disabled={specs.length === 1}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/seller/products">Cancel</Link>
                    </Button>
                    <Button
                        type="submit"
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                        disabled={loading}
                    >
                        {loading ? 'Creating Product...' : 'Publish Product'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
