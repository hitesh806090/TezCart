"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { fetchClient } from "@/lib/api";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await fetchClient("/auth/profile");
        if (user && user.role === "admin") {
          setIsAdmin(true);
        } else {
          router.push("/login"); // Not admin or not logged in, redirect to login
        }
      } catch (error) {
        console.error("Authentication failed", error);
        router.push("/login"); // Error fetching profile, redirect to login
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-black text-white">Loading admin panel...</div>;
  }

  if (!isAdmin) {
    // This state should ideally not be reached if redirects work, but as a fallback
    return <div className="flex min-h-screen items-center justify-center bg-black text-red-500">Access Denied: You do not have administrator privileges.</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 z-50 w-64 border-r border-zinc-800 bg-black hidden md:flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <h1 className="text-xl font-bold text-white">TEZCART Admin</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/admin" className="block py-2 px-4 rounded text-white hover:bg-surface">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/sellers" className="block py-2 px-4 rounded text-white hover:bg-surface">
                Sellers
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-2 px-4 rounded text-white hover:bg-surface">
                Products
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-2 px-4 rounded text-white hover:bg-surface">
                Orders
              </Link>
            </li>
            <li>
              <Link href="#" className="block py-2 px-4 rounded text-white hover:bg-surface">
                Users
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 w-full border-b border-zinc-800 bg-black">
        <div className="h-14 flex items-center px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-surface border-border-dark flex flex-col">
              <SheetTitle className="sr-only">Admin Menu</SheetTitle>
              <div className="flex-1 overflow-y-auto">
                <div className="pt-6">
                  <h1 className="text-xl font-bold text-white mb-4">TEZCART Admin</h1>
                  <nav className="flex-1">
                    <ul className="space-y-2">
                      <li>
                        <SheetClose asChild>
                          <Link href="/admin" className="block py-2 px-4 rounded text-white hover:bg-surface">
                            Dashboard
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link href="/admin/sellers" className="block py-2 px-4 rounded text-white hover:bg-surface">
                            Sellers
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link href="#" className="block py-2 px-4 rounded text-white hover:bg-surface">
                            Products
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link href="#" className="block py-2 px-4 rounded text-white hover:bg-surface">
                            Orders
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link href="#" className="block py-2 px-4 rounded text-white hover:bg-surface">
                            Users
                          </Link>
                        </SheetClose>
                      </li>
                    </ul>
                  </nav>

                  <div className="pt-4 mt-auto border-t border-zinc-700">
                    <SheetClose asChild>
                      <button className="w-full py-2 px-4 rounded text-white border border-zinc-700 hover:bg-zinc-800/50 text-center">
                        Close Menu
                      </button>
                    </SheetClose>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full pl-0 md:pl-64">
        <div className="w-full p-3 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}