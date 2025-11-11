"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ModelViewer } from "@/components/model-viewer";
import { ReviewList } from "@/components/review-list";
import { WishlistButton } from "@/components/wishlist-button";
import { api } from "@/trpc/react";
import { ArrowLeft, Package, ShoppingCart, Store, Maximize2, Smartphone, Check } from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { data: product, isLoading } = api.product.getById.useQuery({ 
    id: resolvedParams.id 
  });

  const addToCartMutation = api.cart.addItem.useMutation({
    onSuccess: () => {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    },
    onSettled: () => {
      setAddingToCart(false);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="container py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-10 bg-muted rounded" />
                <div className="h-6 bg-muted rounded w-2/3" />
                <div className="h-24 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mainVariant = product.variants?.[0];
  const price = mainVariant?.price || 0;
  const inStock = (mainVariant?.quantity || 0) > 0;
  
  const has3DModel = product.media?.some((m: any) => m.mediaType === "MODEL_3D");
  const model3D = product.media?.find((m: any) => m.mediaType === "MODEL_3D");
  const images = product.media?.filter((m: any) => m.mediaType === "IMAGE") || [];

  const handleAddToCart = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (!mainVariant) return;

    setAddingToCart(true);
    addToCartMutation.mutate({
      productId: product.id,
      variantId: mainVariant.id,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images / 3D Viewer */}
          <div className="space-y-4">
            {has3DModel ? (
              <Tabs defaultValue="3d" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="3d">
                    <Maximize2 className="mr-2 h-4 w-4" />
                    3D View
                  </TabsTrigger>
                  <TabsTrigger value="images">
                    <Package className="mr-2 h-4 w-4" />
                    Images
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="3d" className="mt-4">
                  <div className="aspect-square rounded-lg border overflow-hidden bg-gradient-to-br from-[#4A00E0]/5 to-[#00E0B0]/5">
                    {model3D && (
                      <ModelViewer
                        src={model3D.url}
                        iosSrc={model3D.iosUrl || undefined}
                        poster={images[0]?.url}
                        alt={product.title}
                        autoRotate={true}
                        cameraControls={true}
                        enableAR={true}
                        className="w-full h-full"
                      />
                    )}
                  </div>
                  <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-[#4A00E0]/10 to-[#00E0B0]/10 border border-primary/20">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-6 w-6 text-primary" />
                      <div>
                        <h4 className="font-semibold text-sm">View in AR</h4>
                        <p className="text-xs text-muted-foreground">
                          Click the AR icon to place this product in your space
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="images" className="mt-4">
                  <div className="aspect-square rounded-lg border overflow-hidden bg-gradient-to-br from-[#4A00E0]/20 to-[#00E0B0]/20 flex items-center justify-center">
                    {images.length > 0 ? (
                      <img
                        src={images[selectedImage]?.url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-24 w-24 text-muted-foreground" />
                    )}
                  </div>
                  
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {images.map((media: any, index: number) => (
                        <button
                          key={media.id}
                          onClick={() => setSelectedImage(index)}
                          className={`aspect-square rounded-md border overflow-hidden transition-colors ${
                            selectedImage === index
                              ? "border-primary ring-2 ring-primary"
                              : "hover:border-primary"
                          }`}
                        >
                          <img
                            src={media.url}
                            alt={`${product.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <>
                <div className="aspect-square rounded-lg border bg-gradient-to-br from-[#4A00E0]/20 to-[#00E0B0]/20 flex items-center justify-center overflow-hidden">
                  {images.length > 0 ? (
                    <img
                      src={images[selectedImage]?.url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-24 w-24 text-muted-foreground" />
                  )}
                </div>
                
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((media: any, index: number) => (
                      <button
                        key={media.id}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-md border overflow-hidden transition-colors ${
                          selectedImage === index
                            ? "border-primary ring-2 ring-primary"
                            : "hover:border-primary"
                        }`}
                      >
                        <img
                          src={media.url}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{product.title}</h1>
                {product.status === "ACTIVE" ? (
                  <Badge>Available</Badge>
                ) : (
                  <Badge variant="secondary">Unavailable</Badge>
                )}
              </div>
              
              {product.seller && (
                <Link
                  href={`/store/${product.seller.storeUrlSlug}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Store className="h-4 w-4" />
                  <span>{product.seller.storeName}</span>
                </Link>
              )}
            </div>

            <div className="flex items-baseline gap-4">
              <div className="text-4xl font-bold">${price.toFixed(2)}</div>
              {inStock ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-600 border-red-600">
                  Out of Stock
                </Badge>
              )}
            </div>

            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Store className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Sold by</p>
                    <p className="font-semibold">{product.seller?.storeName || "Seller"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Product Details</h3>
                <dl className="space-y-2 text-sm">
                  {mainVariant?.sku && (
                    <>
                      <dt className="text-muted-foreground inline">SKU:</dt>
                      <dd className="inline ml-2 font-medium">{mainVariant.sku}</dd>
                      <br />
                    </>
                  )}
                  <dt className="text-muted-foreground inline">Availability:</dt>
                  <dd className="inline ml-2 font-medium">
                    {mainVariant?.quantity || 0} units
                  </dd>
                </dl>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex gap-2">
                {addedToCart ? (
                  <Button size="lg" className="flex-1" variant="outline" disabled>
                    <Check className="mr-2 h-5 w-5" />
                    Added to Cart
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="flex-1"
                    disabled={!inStock || product.status !== "ACTIVE" || addingToCart}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {addingToCart ? "Adding..." : "Add to Cart"}
                  </Button>
                )}
                <WishlistButton productId={product.id} size="lg" />
              </div>
              
              {session && (
                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link href="/cart">
                    View Cart
                  </Link>
                </Button>
              )}
              
              {!session && (
                <p className="text-sm text-center text-muted-foreground">
                  <Link href="/auth/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>{" "}
                  to purchase this product
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <ReviewList productId={product.id} />
        </div>
      </div>
    </div>
  );
}
