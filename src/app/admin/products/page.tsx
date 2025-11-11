"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

export default function AdminProductsPage() {
  // TODO: Create admin product approval API endpoint
  // For now, show placeholder

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Product Moderation</h1>
        <p className="text-muted-foreground">
          Review and approve product listings
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 text-center py-12">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Product Approval Queue</h2>
          <p className="text-muted-foreground mb-4">
            Product moderation feature coming soon
          </p>
          <Badge variant="secondary">In Development</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Add product approval workflow to tRPC router</p>
          <p>• Create admin endpoints for approve/reject products</p>
          <p>• Add product status: PENDING_APPROVAL, APPROVED, REJECTED</p>
          <p>• Implement content moderation for product descriptions</p>
          <p>• Add image/3D model validation</p>
        </CardContent>
      </Card>
    </div>
  );
}
