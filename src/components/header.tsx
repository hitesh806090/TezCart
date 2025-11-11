"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, LogOut, Store, Heart, Bell } from "lucide-react";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">
            <span className="text-[#4A00E0]">Tez</span>
            <span className="text-[#00E0B0]">Cart</span>
          </h1>
        </Link>

        <div className="flex-1 max-w-xl mx-8">
          <form action="/search" method="get" className="relative">
            <input
              type="text"
              name="q"
              placeholder="Search products, sellers..."
              className="w-full px-4 py-2 rounded-lg border bg-background"
            />
          </form>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost">Browse</Button>
          </Link>

          <Link href="/about">
            <Button variant="ghost">About</Button>
          </Link>

          <Link href="/help">
            <Button variant="ghost">Help</Button>
          </Link>

          {status === "authenticated" ? (
            <>
              {(session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin
                  </Button>
                </Link>
              )}

              {session.user.role === "SELLER" || session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN" ? (
                <Link href="/seller/dashboard">
                  <Button variant="ghost" size="icon">
                    <Store className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/seller/apply">
                  <Button variant="outline" size="sm">
                    Become a Seller
                  </Button>
                </Link>
              )}

              <Link href="/orders">
                <Button variant="ghost" size="sm">
                  Orders
                </Button>
              </Link>

              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  Settings
                </Button>
              </Link>

              <Link href="/returns">
                <Button variant="ghost" size="sm">
                  Returns
                </Button>
              </Link>

              <Link href="/messages">
                <Button variant="ghost" size="sm">
                  Messages
                </Button>
              </Link>

              <Link href="/notifications">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/cart">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : status === "loading" ? (
            <div className="h-10 w-20 animate-pulse rounded-md bg-muted" />
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
