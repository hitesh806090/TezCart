"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    regularPrice: "",
    salePrice: "",
    SKU: "",
    stockQuantity: "",
    category: "",
    status: "draft"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // In a real app, you would send the data to your API here
  };

  return (
    <div className="p-6 bg-obsidian min-h-screen">
      {/* Header with title and action buttons */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
        <div className="flex space-x-3">
          <Button variant="ghost" className="text-white hover:text-gold hover:bg-zinc-800">
            Cancel
          </Button>
          <Button 
            className="bg-gold text-obsidian hover:bg-gold-dim"
            onClick={handleSubmit}
          >
            Publish Product
          </Button>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - General Info and Pricing */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info Card */}
          <Card className="bg-surface border border-border-dark">
            <CardHeader>
              <CardTitle className="text-white">General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Product Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter product title"
                  className="bg-black border border-border-dark text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  className="bg-black border border-border-dark text-white min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory Card */}
          <Card className="bg-surface border border-border-dark">
            <CardHeader>
              <CardTitle className="text-white">Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Regular Price ($)</label>
                  <Input
                    name="regularPrice"
                    type="number"
                    value={formData.regularPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="bg-black border border-border-dark text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Sale Price ($)</label>
                  <Input
                    name="salePrice"
                    type="number"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="bg-black border border-border-dark text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">SKU</label>
                  <Input
                    name="SKU"
                    value={formData.SKU}
                    onChange={handleInputChange}
                    placeholder="Enter Stock Keeping Unit"
                    className="bg-black border border-border-dark text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Stock Quantity</label>
                  <Input
                    name="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="bg-black border border-border-dark text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Media and Organization */}
        <div className="space-y-6">
          {/* Media Card */}
          <Card className="bg-surface border border-border-dark">
            <CardHeader>
              <CardTitle className="text-white">Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border-dark rounded-lg p-8 text-center cursor-pointer hover:bg-zinc-800/30 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-zinc-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-zinc-400 mb-1">Drag & drop images here</p>
                  <p className="text-sm text-zinc-500">or click to browse</p>
                  <p className="text-xs text-zinc-600 mt-2">Supports JPG, PNG, SVG. Max size: 10MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization Card */}
          <Card className="bg-surface border border-border-dark">
            <CardHeader>
              <CardTitle className="text-white">Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Category</label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger className="bg-black border border-border-dark text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border border-border-dark text-white">
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Status</label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger className="bg-black border border-border-dark text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border border-border-dark text-white">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}