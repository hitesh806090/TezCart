"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Package, MapPin, Wallet, HelpCircle } from "lucide-react";
import { fetchClient } from "@/lib/api";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchClient("/auth/profile");
        setUser(profile);
      } catch (error) {
        console.error("Failed to load profile", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [router]);

  // Mock Orders
  const orders = [
    {
      id: "ORD-2023-8859",
      date: "Nov 28, 2025",
      status: "Delivered",
      total: 299.99,
      items: [
        { name: "Neural Link Headset Pro", image: "/placeholder.jpg", price: 299.99 }
      ]
    },
    {
      id: "ORD-2023-7723",
      date: "Nov 15, 2025",
      status: "Processing",
      total: 129.99,
      items: [
        { name: "Holographic Keyboard", image: "/placeholder.jpg", price: 129.99 }
      ]
    },
    {
      id: "ORD-2023-6612",
      date: "Oct 30, 2025",
      status: "Cancelled",
      total: 79.99,
      items: [
        { name: "Zero-G Mouse", image: "/placeholder.jpg", price: 79.99 }
      ]
    }
  ];

  if (loading) {
    return <div className="container max-w-7xl mx-auto px-4 pt-24 pb-12 text-center">Loading profile...</div>;
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 pt-24 pb-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden md:flex flex-col w-64 gap-2 shrink-0">
          <div className="p-6 mb-4 rounded-xl bg-card border border-white/10">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "JD"}
              </div>
              <div>
                <p className="font-semibold">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
          
          <nav className="flex flex-col gap-1">
            <Button variant="secondary" className="justify-start h-11 font-medium bg-primary/10 text-primary hover:bg-primary/20">
              <Package className="mr-2 h-4 w-4" />
              My Orders
            </Button>
            <Button variant="ghost" className="justify-start h-11 font-medium hover:bg-white/5">
              <MapPin className="mr-2 h-4 w-4" />
              Saved Addresses
            </Button>
            <Button variant="ghost" className="justify-start h-11 font-medium hover:bg-white/5">
              <Wallet className="mr-2 h-4 w-4" />
              Wallet
            </Button>
            <Button variant="ghost" className="justify-start h-11 font-medium hover:bg-white/5">
              <HelpCircle className="mr-2 h-4 w-4" />
              Support
            </Button>
          </nav>
        </aside>

        {/* Mobile Navigation Menu - Visible only on Mobile */}
        <div className="md:hidden mb-6 space-y-2">
          <div className="flex items-center gap-3 p-4 bg-card border border-white/10 rounded-xl mb-4">
             <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
               {user?.name ? user.name.substring(0, 2).toUpperCase() : "JD"}
             </div>
             <div>
                <p className="font-semibold">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
             <Button variant="secondary" className="h-20 flex-col gap-2 bg-card border border-white/10 hover:border-primary/50">
                <Package className="h-5 w-5" />
                Orders
             </Button>
             <Button variant="ghost" className="h-20 flex-col gap-2 bg-card border border-white/10 hover:border-primary/50">
                <MapPin className="h-5 w-5" />
                Address
             </Button>
             <Button variant="ghost" className="h-20 flex-col gap-2 bg-card border border-white/10 hover:border-primary/50">
                <Wallet className="h-5 w-5" />
                Wallet
             </Button>
             <Button variant="ghost" className="h-20 flex-col gap-2 bg-card border border-white/10 hover:border-primary/50">
                <HelpCircle className="h-5 w-5" />
                Support
             </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
            <Badge variant="outline" className="md:hidden">3 Orders</Badge>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-muted-foreground font-medium border-b border-white/10">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-card/30">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{order.id}</td>
                    <td className="p-4 text-muted-foreground">{order.date}</td>
                    <td className="p-4">
                      <Badge 
                        variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}
                        className={order.status === 'Delivered' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : ''}
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold">${order.total}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8">View Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Stack View */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="bg-card/50 border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                   <span className="font-medium text-sm text-muted-foreground">{order.id}</span>
                   <Badge 
                      variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}
                      className={order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' : ''}
                   >
                      {order.status}
                   </Badge>
                </div>
                <CardContent className="p-4 flex gap-4 items-center">
                   <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center shrink-0 border border-white/10">
                      {/* Placeholder image */}
                      <div className="w-8 h-8 bg-zinc-700 rounded-md" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{order.items[0].name}</h3>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                      <p className="text-primary font-bold mt-1">${order.total}</p>
                   </div>
                </CardContent>
                <CardFooter className="p-0 border-t border-white/5">
                   <Button variant="ghost" className="w-full h-12 rounded-t-none hover:bg-primary/5 text-primary">
                      Track Order
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
