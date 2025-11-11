"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";
import { AlertTriangle, Shield } from "lucide-react";

export default function AdminFraudPage() {
  const [statusFilter, setStatusFilter] = useState<any>(undefined);

  const { data: alerts, isLoading } = api.fraud.getFraudAlerts.useQuery({
    status: statusFilter,
  });

  const updateMutation = api.fraud.updateAlertStatus.useMutation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fraud Detection</h1>
        <p className="text-muted-foreground">Monitor and manage fraud alerts</p>
      </div>

      <Tabs defaultValue="all" onValueChange={(v) => setStatusFilter(v === "all" ? undefined : v)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="REVIEWING">Reviewing</TabsTrigger>
          <TabsTrigger value="RESOLVED">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter || "all"} className="mt-6">
          {!alerts || alerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">No fraud alerts</h2>
                <p className="text-muted-foreground">All clear!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert: any) => (
                <Card key={alert.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                          <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={
                                alert.severity === "CRITICAL"
                                  ? "destructive"
                                  : alert.severity === "HIGH"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline">{alert.type}</Badge>
                            <Badge>{alert.status}</Badge>
                          </div>
                          <p className="font-semibold mb-1">User: {alert.user?.name}</p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {alert.description}
                          </p>
                          {alert.order && (
                            <p className="text-sm text-muted-foreground">
                              Order: {alert.order.id} - ${alert.order.total}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(alert.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {alert.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateMutation.mutate({
                                alertId: alert.id,
                                status: "REVIEWING",
                              })
                            }
                          >
                            Review
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              updateMutation.mutate({
                                alertId: alert.id,
                                status: "RESOLVED",
                              })
                            }
                          >
                            Resolve
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
