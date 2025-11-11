"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, CreditCard, Bell, User, Shield, Package } from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
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
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#00E0B0] flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">{session?.user.name}</p>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{session?.user.email}</p>
              </div>
              <Button variant="outline" className="w-full">Edit Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#00E0B0] flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Addresses</CardTitle>
                  <CardDescription>Manage shipping addresses</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/settings/addresses">Manage Addresses</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#00E0B0] flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage saved cards</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/settings/payment-methods">Manage Payment Methods</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#00E0B0] flex items-center justify-center">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage notification preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/notifications">View Notifications</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#00E0B0] flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>View order history</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/orders">View Orders</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#00E0B0] flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Password and security settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Change Password</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
