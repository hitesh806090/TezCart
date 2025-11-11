"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";

export default function StoreSetupPage() {
  const router = useRouter();
  const { status } = useSession();
  const [storeName, setStoreName] = useState("");
  const [storeUrlSlug, setStoreUrlSlug] = useState("");
  const [bio, setBio] = useState("");
  const [publicContactEmail, setPublicContactEmail] = useState("");
  const [error, setError] = useState("");

  const updateStoreMutation = api.seller.updateStoreProfile.useMutation({
    onSuccess: () => {
      router.push("/seller/dashboard");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!storeName || !storeUrlSlug) {
      setError("Store name and URL are required");
      return;
    }

    updateStoreMutation.mutate({
      storeName,
      storeUrlSlug,
      bio: bio || undefined,
      publicContactEmail: publicContactEmail || undefined,
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleStoreNameChange = (value: string) => {
    setStoreName(value);
    if (!storeUrlSlug) {
      setStoreUrlSlug(generateSlug(value));
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-12">
      <div className="container max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Set Up Your Store</CardTitle>
            <CardDescription>
              Create your public store profile to start selling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name *</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => handleStoreNameChange(e.target.value)}
                  placeholder="My Awesome Store"
                  required
                  disabled={updateStoreMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  This will be displayed to customers
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeUrlSlug">Store URL *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    tezcart.com/store/
                  </span>
                  <Input
                    id="storeUrlSlug"
                    value={storeUrlSlug}
                    onChange={(e) => setStoreUrlSlug(generateSlug(e.target.value))}
                    placeholder="my-awesome-store"
                    required
                    disabled={updateStoreMutation.isPending}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Choose a unique URL for your store (letters, numbers, and hyphens only)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Store Description</Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell customers about your store..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={updateStoreMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publicContactEmail">Public Contact Email</Label>
                <Input
                  id="publicContactEmail"
                  type="email"
                  value={publicContactEmail}
                  onChange={(e) => setPublicContactEmail(e.target.value)}
                  placeholder="contact@mystore.com"
                  disabled={updateStoreMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Display a contact email for customers
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={updateStoreMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={updateStoreMutation.isPending}
                >
                  {updateStoreMutation.isPending ? "Saving..." : "Save & Continue"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
