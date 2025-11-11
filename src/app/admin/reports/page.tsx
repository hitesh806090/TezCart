"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { AlertTriangle } from "lucide-react";

export default function AdminReportsPage() {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState<any>(undefined);

  const { data: reports, isLoading, refetch } = api.report.getAllReports.useQuery({ status: statusFilter });

  const updateStatusMutation = api.report.updateReportStatus.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedReport(null);
      setAdminNotes("");
    },
  });

  const handleUpdateStatus = (status: any) => {
    if (selectedReport) {
      updateStatusMutation.mutate({
        reportId: selectedReport.id,
        status,
        adminNotes,
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Moderation</h1>
        <p className="text-muted-foreground">Review user reports</p>
      </div>

      <Tabs defaultValue="all" onValueChange={(v) => setStatusFilter(v === "all" ? undefined : v)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="REVIEWING">Reviewing</TabsTrigger>
          <TabsTrigger value="RESOLVED">Resolved</TabsTrigger>
          <TabsTrigger value="DISMISSED">Dismissed</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter || "all"} className="mt-6">
          {!reports || reports.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">No reports</h2>
                <p className="text-muted-foreground">No reports to review</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reports.map((report: any) => (
                <Card key={report.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={
                            report.status === "PENDING" ? "destructive" :
                            report.status === "REVIEWING" ? "default" :
                            report.status === "RESOLVED" ? "secondary" : "outline"
                          }>
                            {report.status}
                          </Badge>
                          <Badge variant="outline">{report.reason}</Badge>
                        </div>
                        <p className="font-semibold mb-1">
                          {report.productId ? `Product: ${report.product?.title}` : 
                           report.sellerId ? `Seller: ${report.seller?.storeName}` : "Unknown"}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          Reported by: {report.user?.name} ({report.user?.email})
                        </p>
                        <p className="text-sm">{report.description}</p>
                        {report.adminNotes && (
                          <div className="mt-2 p-2 bg-muted rounded">
                            <p className="text-xs font-semibold">Admin Notes:</p>
                            <p className="text-xs">{report.adminNotes}</p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(report.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report);
                          setAdminNotes(report.adminNotes || "");
                        }}
                      >
                        Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold">Reason:</p>
              <p className="text-sm">{selectedReport?.reason}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Description:</p>
              <p className="text-sm">{selectedReport?.description}</p>
            </div>
            <div className="space-y-2">
              <Label>Admin Notes</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleUpdateStatus("REVIEWING")}
                disabled={updateStatusMutation.isPending}
                className="flex-1"
              >
                Mark Reviewing
              </Button>
              <Button
                variant="default"
                onClick={() => handleUpdateStatus("RESOLVED")}
                disabled={updateStatusMutation.isPending}
                className="flex-1"
              >
                Resolve
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleUpdateStatus("DISMISSED")}
                disabled={updateStatusMutation.isPending}
                className="flex-1"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
