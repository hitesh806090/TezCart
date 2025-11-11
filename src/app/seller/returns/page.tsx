"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { Package, RotateCcw } from "lucide-react";

export default function SellerReturnsPage() {
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [sellerNotes, setSellerNotes] = useState("");

  const { data: returns, isLoading, refetch } = api.return.getSellerReturns.useQuery();

  const updateStatusMutation = api.return.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedReturn(null);
      setSellerNotes("");
    },
  });

  const handleApprove = () => {
    updateStatusMutation.mutate({
      returnId: selectedReturn.id,
      status: "APPROVED",
      sellerNotes,
    });
  };

  const handleReject = () => {
    if (!sellerNotes.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    updateStatusMutation.mutate({
      returnId: selectedReturn.id,
      status: "REJECTED",
      sellerNotes,
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500";
      case "APPROVED": return "bg-green-500";
      case "REJECTED": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Return Requests</h1>

        {!returns || returns.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <RotateCcw className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No return requests</h2>
              <p className="text-muted-foreground">Return requests will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {returns.map((returnRequest: any) => (
              <Card key={returnRequest.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Return #{returnRequest.id.slice(0, 8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Customer: {returnRequest.orderItem.order.user.name}
                      </p>
                    </div>
                    <Badge className={getStatusColor(returnRequest.status)}>
                      {returnRequest.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Product</p>
                      <p className="text-sm text-muted-foreground">
                        {returnRequest.orderItem.product.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Reason</p>
                      <p className="text-sm text-muted-foreground">
                        {returnRequest.reason.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Description</p>
                      <p className="text-sm text-muted-foreground">{returnRequest.description}</p>
                    </div>
                    {returnRequest.status === "PENDING" && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button onClick={() => setSelectedReturn(returnRequest)} className="flex-1">
                          Review Request
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!selectedReturn} onOpenChange={() => setSelectedReturn(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Return Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Response Notes (Optional for approval, required for rejection)</Label>
                <Textarea
                  value={sellerNotes}
                  onChange={(e) => setSellerNotes(e.target.value)}
                  placeholder="Add notes for the customer..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleApprove} disabled={updateStatusMutation.isPending} className="flex-1">
                  Approve
                </Button>
                <Button onClick={handleReject} disabled={updateStatusMutation.isPending} variant="destructive" className="flex-1">
                  Reject
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
