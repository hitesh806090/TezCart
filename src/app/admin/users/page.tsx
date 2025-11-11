"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default function AdminUsersPage() {
  // TODO: Create admin user management API endpoint
  // For now, show placeholder

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">
          Manage platform users and permissions
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 text-center py-12">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">User Management</h2>
          <p className="text-muted-foreground mb-4">
            User management interface coming soon
          </p>
          <Badge variant="secondary">In Development</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Planned Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• View all registered users</p>
          <p>• Search and filter users by role, status, date</p>
          <p>• Edit user roles (Customer, Seller, Admin)</p>
          <p>• Suspend or ban users</p>
          <p>• View user activity and order history</p>
          <p>• Reset user passwords</p>
          <p>• Export user data for compliance</p>
        </CardContent>
      </Card>
    </div>
  );
}
