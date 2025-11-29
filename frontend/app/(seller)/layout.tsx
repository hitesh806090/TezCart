import "../globals.css";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 z-50 w-64 border-r border-zinc-800 bg-black hidden md:flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <h1 className="text-xl font-bold text-white">Seller Dashboard</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/seller" className="block py-2 px-4 rounded text-white hover:bg-surface bg-surface">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/seller/inventory" className="block py-2 px-4 rounded text-white hover:bg-surface">
                Inventory
              </Link>
            </li>
            <li>
              <Link href="/seller/orders" className="block py-2 px-4 rounded text-white hover:bg-surface">
                Orders
              </Link>
            </li>
            <li>
              <Link href="/seller/analytics" className="block py-2 px-4 rounded text-white hover:bg-surface">
                Analytics
              </Link>
            </li>
            <li>
              <Link href="/seller/payouts" className="block py-2 px-4 rounded text-white hover:bg-surface">
                Payouts
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-surface border border-border-dark flex items-center justify-center">
            <span className="text-white text-sm">S</span>
          </div>
          <p className="text-white text-sm mt-2">Seller Name</p>
        </div>
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
              <SheetTitle className="sr-only">Seller Menu</SheetTitle>
              <div className="flex-1 overflow-y-auto">
                <div className="pt-6">
                  <h1 className="text-xl font-bold text-white mb-4">Seller Dashboard</h1>
                  <nav className="flex-1">
                    <ul className="space-y-2">
                      <li>
                        <SheetClose asChild>
                          <Link href="/seller" className="block py-2 px-4 rounded text-white hover:bg-surface bg-surface">
                            Dashboard
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link href="/seller/inventory" className="block py-2 px-4 rounded text-white hover:bg-surface">
                            Inventory
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link href="/seller/orders" className="block py-2 px-4 rounded text-white hover:bg-surface">
                            Orders
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link href="/seller/analytics" className="block py-2 px-4 rounded text-white hover:bg-surface">
                            Analytics
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link href="/seller/payouts" className="block py-2 px-4 rounded text-white hover:bg-surface">
                            Payouts
                          </Link>
                        </SheetClose>
                      </li>
                    </ul>
                  </nav>
                  <div className="mt-4 pt-4 border-t border-border-dark">
                    <div className="w-8 h-8 rounded-full bg-surface border border-border-dark flex items-center justify-center">
                      <span className="text-white text-sm">S</span>
                    </div>
                    <p className="text-white text-sm mt-2">Seller Name</p>
                  </div>

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