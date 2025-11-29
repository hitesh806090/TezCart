"use client";

import { useEffect, useState } from "react";
import { fetchClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast"; // Assuming a toast component exists

interface Seller {
  id: string;
  storeName: string;
  email: string;
  phone: string;
  gstin: string;
  pickupAddress: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function AdminSellersPage() {
  const [pendingSellers, setPendingSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPendingSellers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClient("/sellers/admin/pending");
      setPendingSellers(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch pending sellers.");
      toast({
        title: "Error",
        description: err.message || "Failed to fetch pending sellers.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const handleAction = async (sellerId: string, action: "approve" | "reject") => {
    try {
      await fetchClient(`/sellers/admin/${action}/${sellerId}`, {
        method: "POST",
      });
      toast({
        title: "Success",
        description: `Seller ${action}d successfully.`,
      });
      fetchPendingSellers(); // Refresh the list
    } catch (err: any) {
      setError(err.message || `Failed to ${action} seller.`);
      toast({
        title: "Error",
        description: err.message || `Failed to ${action} seller.`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading pending sellers...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Pending Seller Applications</h2>
      {pendingSellers.length === 0 ? (
        <p className="text-white/70">No pending seller applications found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingSellers.map((seller) => (
            <Card key={seller.id} className="bg-card/50 border-white/10 text-white">
              <CardHeader>
                <CardTitle>{seller.storeName}</CardTitle>
                <p className="text-sm text-muted-foreground">{seller.user.name} ({seller.user.email})</p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="font-semibold">Phone:</span> {seller.phone}</p>
                <p><span className="font-semibold">GSTIN:</span> {seller.gstin || "N/A"}</p>
                <p><span className="font-semibold">Pickup Address:</span> {seller.pickupAddress}</p>
                <Badge variant="secondary" className="mt-2 capitalize">{seller.status}</Badge>
              </CardContent>
              <div className="flex justify-end p-4 gap-2 border-t border-white/10">
                <Button variant="outline" onClick={() => handleAction(seller.id, "reject")}>Reject</Button>
                <Button onClick={() => handleAction(seller.id, "approve")}>Approve</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
