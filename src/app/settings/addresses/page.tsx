"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { MapPin, Plus, Pencil, Trash2, Check } from "lucide-react";

export default function AddressesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
  });

  const { data: addresses, isLoading, refetch } = api.address.getMyAddresses.useQuery(
    undefined,
    { enabled: status === "authenticated" }
  );

  const createMutation = api.address.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowDialog(false);
      resetForm();
    },
  });

  const updateMutation = api.address.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingAddress(null);
      setShowDialog(false);
      resetForm();
    },
  });

  const setDefaultMutation = api.address.setDefault.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteMutation = api.address.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "USA",
    });
  };

  const handleSubmit = () => {
    if (editingAddress) {
      updateMutation.mutate({ id: editingAddress.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEditDialog = (address: any) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    });
    setShowDialog(true);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Saved Addresses</h1>
            <p className="text-muted-foreground">Manage your shipping addresses</p>
          </div>
          <Button onClick={() => { setEditingAddress(null); resetForm(); setShowDialog(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Address
          </Button>
        </div>

        {!addresses || addresses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No addresses saved</h2>
              <p className="text-muted-foreground mb-6">Add an address for faster checkout</p>
              <Button onClick={() => setShowDialog(true)}>Add Your First Address</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {addresses.map((address: any) => (
              <Card key={address.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#00E0B0] flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{address.fullName}</p>
                          {address.isDefault && <Badge variant="default">Default</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{address.phone}</p>
                        <p className="text-sm mt-2">{address.addressLine1}</p>
                        {address.addressLine2 && (
                          <p className="text-sm">{address.addressLine2}</p>
                        )}
                        <p className="text-sm">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-sm">{address.country}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefaultMutation.mutate({ id: address.id })}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(address)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm("Delete this address?")) {
                            deleteMutation.mutate({ id: address.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAddress ? "Edit Address" : "Add Address"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address Line 1 *</Label>
                <Input
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Address Line 2</Label>
                <Input
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State *</Label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Postal Code *</Label>
                  <Input
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Country *</Label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full"
              >
                {editingAddress ? "Update Address" : "Add Address"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
