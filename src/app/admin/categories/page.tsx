"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { FolderTree, Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const { data: categories, isLoading, refetch } = api.category.getAll.useQuery();

  const createMutation = api.category.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowCreateDialog(false);
      resetForm();
    },
  });

  const updateMutation = api.category.update.useMutation({
    onSuccess: () => {
      refetch();
      setEditingCategory(null);
      resetForm();
    },
  });

  const deleteMutation = api.category.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
  };

  const handleCreate = () => {
    createMutation.mutate({ name, slug, description });
  };

  const handleUpdate = () => {
    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        name,
        slug,
        description,
      });
    }
  };

  const openEditDialog = (category: any) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || "");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {!categories || categories.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <FolderTree className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No categories yet</h2>
            <p className="text-muted-foreground mb-6">Create categories to organize products</p>
            <Button onClick={() => setShowCreateDialog(true)}>Create First Category</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category: any) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <p className="text-sm text-muted-foreground">/{category.slug}</p>
              </CardHeader>
              <CardContent>
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(category)}
                    className="flex-1"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Delete this category?")) {
                        deleteMutation.mutate({ id: category.id });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
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
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Electronics" />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="electronics" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
            <Button onClick={handleCreate} disabled={createMutation.isPending || !name || !slug} className="w-full">
              {createMutation.isPending ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending} className="w-full">
              {updateMutation.isPending ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
