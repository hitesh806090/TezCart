"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Star, ShoppingCart, Check, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

// Simple Checkbox Component
function SimpleCheckbox({ label, checked, onChange }: { label: string, checked?: boolean, onChange?: () => void }) {
  return (
    <div className="flex items-center space-x-2 cursor-pointer" onClick={onChange}>
      <div className={cn(
        "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center transition-colors",
        checked ? "bg-primary text-primary-foreground" : "bg-transparent"
      )}>
        {checked && <Check className="h-3 w-3" />}
      </div>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
        {label}
      </label>
    </div>
  );
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "All Products";
  
  // Filter State
  const priceRange = searchParams.get("price") || "1000";
  const selectedBrands = searchParams.get("brands")?.split(",") || [];
  const minRating = searchParams.get("rating") || null;
  const sort = searchParams.get("sort") || "featured";

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const toggleBrand = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    updateFilters("brands", newBrands.length > 0 ? newBrands.join(",") : null);
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("price");
    params.delete("brands");
    params.delete("rating");
    params.delete("sort");
    router.push(`?${params.toString()}`);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4 uppercase tracking-wider text-muted-foreground">Price Range</h3>
        <div className="px-2">
          {/* Simple Range Input Mockup */}
          <input 
            type="range" 
            min="0" 
            max="1000" 
            value={priceRange}
            onChange={(e) => updateFilters("price", e.target.value)}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" 
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
             <span>$0</span>
             <span>${priceRange}+</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
         <h3 className="text-sm font-medium mb-4 uppercase tracking-wider text-muted-foreground">Brands</h3>
         <div className="space-y-3">
           {["Sony", "Apple", "Samsung", "Logitech", "Razer"].map((brand) => (
             <SimpleCheckbox 
                key={brand} 
                label={brand} 
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
             />
           ))}
         </div>
      </div>

      <Separator />

      <div>
         <h3 className="text-sm font-medium mb-4 uppercase tracking-wider text-muted-foreground">Rating</h3>
         <div className="space-y-3">
           {[4, 3, 2, 1].map((rating) => (
             <div 
                key={rating} 
                className={cn("flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity", minRating === rating.toString() && "opacity-100 font-medium")}
                onClick={() => updateFilters("rating", minRating === rating.toString() ? null : rating.toString())}
             >
                <div className="flex text-amber-400">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className={cn("w-4 h-4", i < rating ? "fill-current" : "text-muted stroke-muted-foreground/30")} />
                   ))}
                </div>
                <span className={cn("text-sm text-muted-foreground", minRating === rating.toString() && "text-primary")}>& Up</span>
                {minRating === rating.toString() && <Check className="w-3 h-3 text-primary ml-auto" />}
             </div>
           ))}
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden md:block w-64 shrink-0 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pr-4">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  <h2 className="font-bold text-lg">Filters</h2>
               </div>
               {(priceRange !== "1000" || selectedBrands.length > 0 || minRating || sort !== "featured") && (
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive">
                    Reset
                  </Button>
               )}
            </div>
            <FilterContent />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
             {/* Header Area */}
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                   <h1 className="text-2xl font-bold">Search Results</h1>
                   <p className="text-muted-foreground text-sm">
                      Showing results for &quot;{query}&quot;
                      {selectedBrands.length > 0 && <span className="ml-1 hidden sm:inline">• {selectedBrands.join(", ")}</span>}
                   </p>
                </div>
                
                <div className="flex items-center gap-2">
                   <Sheet>
                      <SheetTrigger asChild>
                         <Button variant="outline" size="sm" className="md:hidden gap-2">
                            <SlidersHorizontal className="w-4 h-4" />
                            Filter
                            {(priceRange !== "1000" || selectedBrands.length > 0 || minRating) && (
                               <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                                  !
                               </Badge>
                            )}
                         </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                         <SheetHeader>
                            <SheetTitle>Filter Products</SheetTitle>
                            <SheetDescription>Refine your search results</SheetDescription>
                         </SheetHeader>
                         <div className="mt-6">
                            <FilterContent />
                         </div>
                         <div className="mt-8 flex gap-2 sticky bottom-0 bg-background pt-4 pb-2 border-t border-border">
                            <SheetClose asChild>
                               <Button className="flex-1">View Results</Button>
                            </SheetClose>
                            <Button variant="outline" className="flex-1" onClick={resetFilters}>Reset</Button>
                         </div>
                      </SheetContent>
                   </Sheet>
                   
                   <Select value={sort} onValueChange={(value) => updateFilters("sort", value)}>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
             </div>

             {/* Product Grid */}
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                   <Card key={i} className="group overflow-hidden border-white/10 bg-card/40 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
                      <div className="aspect-square bg-secondary/50 relative p-4 flex items-center justify-center">
                         <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">New</Badge>
                         <div className="w-24 h-24 bg-zinc-700 rounded-lg animate-pulse" /> {/* Placeholder */}
                      </div>
                      <CardContent className="p-4 pt-4">
                         <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Electronics</div>
                         <h3 className="font-bold truncate mb-1 group-hover:text-primary transition-colors">Wireless Headphones</h3>
                         <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-foreground font-medium">4.8</span>
                            <span className="text-muted-foreground ml-1">(120)</span>
                         </div>
                         <div className="flex items-center justify-between mt-3">
                            <span className="font-bold text-lg">$299.99</span>
                            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full hover:bg-primary hover:text-white">
                               <ShoppingCart className="w-4 h-4" />
                            </Button>
                         </div>
                      </CardContent>
                   </Card>
                ))}
             </div>
          </main>

        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 pb-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <SearchResults />
    </Suspense>
  );
}
