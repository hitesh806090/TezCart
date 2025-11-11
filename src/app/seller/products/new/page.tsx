"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/trpc/react";
import { Upload, X, Image as ImageIcon, Box } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const { status } = useSession();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [model3D, setModel3D] = useState<File | null>(null);
  const [error, setError] = useState("");

  const createProductMutation = api.product.create.useMutation({
    onSuccess: (data) => {
      router.push("/seller/products");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handle3DUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExtensions = [".glb", ".gltf", ".usdz"];
      const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
      if (validExtensions.includes(extension)) {
        setModel3D(file);
      } else {
        setError("Please upload a valid 3D model file (.glb, .gltf, or .usdz)");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !price || !quantity) {
      setError("Please fill in all required fields");
      return;
    }

    const priceNum = parseFloat(price);
    const quantityNum = parseInt(quantity);

    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Please enter a valid price");
      return;
    }

    if (isNaN(quantityNum) || quantityNum < 0) {
      setError("Please enter a valid quantity");
      return;
    }

    // TODO: Upload images and 3D model to storage
    // For now, just create the product without media

    createProductMutation.mutate({
      title,
      description,
      categoryId: category || undefined,
      price: priceNum,
      quantity: quantityNum,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-8">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Product</h1>
          <p className="text-muted-foreground">
            Add a new product to your store with 3D visualization
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Essential details about your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Modern Office Chair"
                  required
                  disabled={createProductMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product in detail..."
                  rows={5}
                  required
                  disabled={createProductMutation.isPending}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="99.99"
                    required
                    disabled={createProductMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Stock Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="100"
                    required
                    disabled={createProductMutation.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="home-decor">Home Decor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Upload up to 5 images (JPG, PNG, WebP)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg border overflow-hidden group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={createProductMutation.isPending}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 3D Model Upload */}
          <Card>
            <CardHeader>
              <CardTitle>3D Model (Optional)</CardTitle>
              <CardDescription>
                Upload a 3D model for immersive product viewing (.glb, .gltf, .usdz)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {model3D ? (
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Box className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{model3D.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(model3D.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setModel3D(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-1">Upload 3D Model</p>
                  <p className="text-xs text-muted-foreground">
                    Supports .glb, .gltf, .usdz formats
                  </p>
                  <input
                    type="file"
                    accept=".glb,.gltf,.usdz"
                    onChange={handle3DUpload}
                    className="hidden"
                    disabled={createProductMutation.isPending}
                  />
                </label>
              )}
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={createProductMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createProductMutation.isPending}
            >
              {createProductMutation.isPending ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
