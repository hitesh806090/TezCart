import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { SearchInput } from "@/components/search-input";
import { Suspense } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4">
      <div className="bg-background/70 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl flex items-center justify-between w-full max-w-5xl">
        
        {/* Mobile Menu (Left) */}
        <div className="md:hidden mr-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] rounded-r-3xl border-white/10 bg-black/90 backdrop-blur-xl pt-12">
              <SheetHeader className="mb-4 px-4">
                 <SheetTitle className="text-left text-2xl font-bold">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 px-2">
                <Link href="/" className="flex items-center px-4 py-3 text-lg font-medium hover:bg-white/10 rounded-xl transition-colors">
                  Home
                </Link>
                <Link href="/products" className="flex items-center px-4 py-3 text-lg font-medium hover:bg-white/10 rounded-xl transition-colors">
                  Products
                </Link>
                <Link href="/deals" className="flex items-center px-4 py-3 text-lg font-medium hover:bg-white/10 rounded-xl transition-colors">
                  Deals
                </Link>
                <Link href="/about" className="flex items-center px-4 py-3 text-lg font-medium hover:bg-white/10 rounded-xl transition-colors">
                  About
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-auto md:mr-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transform rotate-3 shadow-[0_0_15px_var(--color-primary)]">
            <span className="text-white font-bold text-lg -rotate-3">T</span>
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">TezCart</span>
        </Link>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <Link href="/deals" className="hover:text-primary transition-colors">Deals</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
        </nav>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex items-center relative mx-6 max-w-xs w-full">
           <Suspense fallback={<div className="w-full h-9 rounded-full bg-secondary/50" />}>
             <SearchInput />
           </Suspense>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary md:hidden">
                 <Search className="w-5 h-5" />
                 <span className="sr-only">Search</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="w-full p-4 pt-14 rounded-b-3xl border-white/10 bg-black/90 backdrop-blur-xl">
               <SheetTitle className="sr-only">Search</SheetTitle>
               <Suspense fallback={<div className="w-full h-12 rounded-full bg-secondary/50" />}>
                 <div className="relative w-full max-w-lg mx-auto">
                    <SearchInput />
                 </div>
               </Suspense>
            </SheetContent>
          </Sheet>

          <Link href="/cart">
             <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="sr-only">Cart</span>
             </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
              <User className="w-5 h-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
