"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";

export default function AdminSellersPage() {
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const { data: pendingApplications, isLoading, refetch } = api.seller.getPendingApplications.useQuery();

  const approveMutation = api.seller.approveApplication.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedSeller(null);
    },
  });

  const rejectMutation = api.seller.rejectApplication.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedSeller(null);
      setShowRejectDialog(false);
      setRejectReason("");
    },
  });

  const handleApprove = (sellerId: string) => {
    if (confirm("Approve this seller application?")) {
      approveMutation.mutate({ profileId: sellerId });
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    rejectMutation.mutate({
      profileId: selectedSeller.id,
      reason: rejectReason,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Seller Applications</h1>
        <p className="text-muted-foreground">
          Review and approve seller applications
        </p>
      </div>

      {!pendingApplications || pendingApplications.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No Pending Applications</h2>
            <p className="text-muted-foreground">
              All seller applications have been reviewed
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingApplications.map((seller: any) => (
            <Card key={seller.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{seller.legalName}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Applied on {new Date(seller.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {seller.sellerType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Application Details */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium">Legal Name</p>
                      <p className="text-sm text-muted-foreground">{seller.legalName}</p>
                    </div>
                    {seller.sellerType === "INDIVIDUAL" && seller.dateOfBirth && (
                      <div>
                        <p className="text-sm font-medium">Date of Birth</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(seller.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {seller.sellerType === "BUSINESS" && seller.businessRegistrationNumber && (
                      <div>
                        <p className="text-sm font-medium">Registration Number</p>
                        <p className="text-sm text-muted-foreground">
                          {seller.businessRegistrationNumber}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">User Email</p>
                      <p className="text-sm text-muted-foreground">{seller.user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <Badge className="bg-yellow-500">
                        {seller.applicationStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => handleApprove(seller.id)}
                      disabled={approveMutation.isPending}
                      className="flex-1"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {approveMutation.isPending ? "Approving..." : "Approve"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedSeller(seller);
                        setShowRejectDialog(true);
                      }}
                      disabled={rejectMutation.isPending}
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSeller(seller)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application. The seller will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason *</Label>
              <Textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Invalid documents, incomplete information..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectReason("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={rejectMutation.isPending}
                className="flex-1"
              >
                {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail View Dialog */}
      {selectedSeller && !showRejectDialog && (
        <Dialog open={!!selectedSeller} onOpenChange={() => setSelectedSeller(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Seller Application Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedSeller.legalName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Seller Type</p>
                  <p className="text-sm text-muted-foreground">{selectedSeller.sellerType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Legal Name</p>
                  <p className="text-sm text-muted-foreground">{selectedSeller.legalName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{selectedSeller.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Application Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedSeller.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => setSelectedSeller(null)} variant="outline" className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
