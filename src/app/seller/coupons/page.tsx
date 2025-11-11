"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/trpc/react";
import { Ticket, Plus } from "lucide-react";

export default function SellerCouponsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const { data: coupons, isLoading, refetch } = api.coupon.getMyCoupons.useQuery();

  const createMutation = api.coupon.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowCreateDialog(false);
      resetForm();
    },
  });

  const updateStatusMutation = api.coupon.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteMutation = api.coupon.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const resetForm = () => {
    setCode("");
    setDiscountType("PERCENTAGE");
    setDiscountValue("");
    setMinPurchase("");
    setUsageLimit("");
  };

  const handleCreate = () => {
    createMutation.mutate({
      code: code.toUpperCase(),
      discountType: discountType as any,
      discountValue: parseFloat(discountValue),
      minPurchase: minPurchase ? parseFloat(minPurchase) : undefined,
      usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Coupons & Discounts</h1>
            <p className="text-muted-foreground">Create and manage discount codes</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Coupon
          </Button>
        </div>

        {!coupons || coupons.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Ticket className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No coupons yet</h2>
              <p className="text-muted-foreground mb-6">Create discount codes to attract customers</p>
              <Button onClick={() => setShowCreateDialog(true)}>Create Your First Coupon</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coupons.map((coupon: any) => (
              <Card key={coupon.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-mono">{coupon.code}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}% off`
                          : `$${coupon.discountValue} off`}
                      </p>
                    </div>
                    <Badge variant={coupon.isActive ? "default" : "secondary"}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {coupon.minPurchase && (
                      <p className="text-muted-foreground">Min: ${coupon.minPurchase}</p>
                    )}
                    {coupon.usageLimit && (
                      <p className="text-muted-foreground">
                        Used: {coupon.usageCount}/{coupon.usageLimit}
                      </p>
                    )}
                    {coupon.expiresAt && (
                      <p className="text-muted-foreground">
                        Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateStatusMutation.mutate({
                          couponId: coupon.id,
                          isActive: !coupon.isActive,
                        })
                      }
                      className="flex-1"
                    >
                      {coupon.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Delete this coupon?")) {
                          deleteMutation.mutate({ couponId: coupon.id });
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Coupon Code *</Label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="SAVE20"
                  maxLength={20}
                />
              </div>
              <div className="space-y-2">
                <Label>Discount Type *</Label>
                <Select value={discountType} onValueChange={setDiscountType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discount Value *</Label>
                <Input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === "PERCENTAGE" ? "20" : "10.00"}
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Purchase (Optional)</Label>
                <Input
                  type="number"
                  value={minPurchase}
                  onChange={(e) => setMinPurchase(e.target.value)}
                  placeholder="50.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Usage Limit (Optional)</Label>
                <Input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  placeholder="100"
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending || !code || !discountValue}
                className="w-full"
              >
                {createMutation.isPending ? "Creating..." : "Create Coupon"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
