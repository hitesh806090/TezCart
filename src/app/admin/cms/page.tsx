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
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminCMSPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [type, setType] = useState("HERO");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("0");

  const { data: sections, isLoading, refetch } = api.cms.getHomepageSections.useQuery();
  const { data: featuredProducts } = api.cms.getFeaturedProducts.useQuery();

  const createMutation = api.cms.createSection.useMutation({
    onSuccess: () => {
      refetch();
      setShowDialog(false);
      resetForm();
    },
  });

  const deleteMutation = api.cms.deleteSection.useMutation({
    onSuccess: () => refetch(),
  });

  const updateMutation = api.cms.updateSection.useMutation({
    onSuccess: () => refetch(),
  });

  const resetForm = () => {
    setTitle("");
    setType("HERO");
    setOrder("0");
  };

  const handleCreate = () => {
    createMutation.mutate({
      type: type as any,
      title,
      order: parseInt(order),
      content: {},
      isActive: true,
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Homepage CMS</h1>
          <p className="text-muted-foreground">Manage homepage sections and content</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Featured Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {featuredProducts?.length || 0} products currently featured
            </p>
            <Button variant="outline" size="sm">
              Manage Featured Products
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {sections?.filter((s: any) => s.isActive).length || 0} active sections
            </p>
            <Button variant="outline" size="sm">
              Preview Homepage
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Homepage Sections</h2>
        {!sections || sections.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">No sections created yet</p>
            </CardContent>
          </Card>
        ) : (
          sections.map((section: any) => (
            <Card key={section.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{section.title}</h3>
                      <Badge variant="outline">{section.type}</Badge>
                      {section.isActive ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Order: {section.order}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        updateMutation.mutate({
                          id: section.id,
                          isActive: !section.isActive,
                        })
                      }
                    >
                      {section.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Delete this section?")) {
                          deleteMutation.mutate({ id: section.id });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Homepage Section</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Section Type *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HERO">Hero Banner</SelectItem>
                  <SelectItem value="FEATURED_PRODUCTS">Featured Products</SelectItem>
                  <SelectItem value="CATEGORIES">Categories Grid</SelectItem>
                  <SelectItem value="BANNER">Promotional Banner</SelectItem>
                  <SelectItem value="TESTIMONIALS">Customer Testimonials</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Display Order *</Label>
              <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
            </div>
            <Button
              onClick={handleCreate}
              disabled={createMutation.isPending || !title}
              className="w-full"
            >
              {createMutation.isPending ? "Creating..." : "Create Section"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
