import { useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CatalogErrorState, CatalogLoadingState } from "@/components/CatalogState";
import { useCatalog } from "@/hooks/useCatalog";
import type { ProductGroup } from "@/data/productGroups";
import { deleteGroup, saveGroup } from "./adminApi";
import { duplicateGroupSlug, slugify, syncCatalogCache } from "./adminUtils";

const groupSchema = z.object({
  name: z.string().trim().min(1, "Group name is required."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  description: z.string().trim().min(1, "Description is required."),
  order: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || Number.isFinite(Number(value)), "Order must be a number."),
});

type GroupForm = z.infer<typeof groupSchema>;

export default function ProductGroupsManagement() {
  const { data: catalog, isError, isLoading, refetch } = useCatalog();
  const queryClient = useQueryClient();
  const [editingSlug, setEditingSlug] = useState<string | undefined>();
  const [pendingDelete, setPendingDelete] = useState<ProductGroup | null>(null);
  const [saving, setSaving] = useState(false);
  const groups = useMemo(() => catalog?.groups ?? [], [catalog]);

  const form = useForm<GroupForm>({
    resolver: zodResolver(groupSchema),
    defaultValues: { name: "", slug: "", description: "", order: "" },
  });

  const onSubmit = async (values: GroupForm) => {
    if (!catalog) return;
    const nextSlug = slugify(values.slug);
    if (duplicateGroupSlug(catalog, nextSlug, editingSlug)) {
      form.setError("slug", { message: "Another product group already uses this slug." });
      return;
    }

    setSaving(true);
    try {
      const nextCatalog = await saveGroup(
        {
          name: values.name.trim(),
          slug: nextSlug,
          description: values.description.trim(),
          order: values.order || undefined,
        },
        editingSlug
      );
      syncCatalogCache(queryClient, nextCatalog);
      toast.success(editingSlug ? "Product group updated." : "Product group created.");
      setEditingSlug(undefined);
      form.reset({ name: "", slug: "", description: "", order: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save product group.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (group: ProductGroup) => {
    setEditingSlug(group.slug);
    form.reset({
      name: group.name,
      slug: group.slug,
      description: group.description,
      order: group.order ? String(group.order) : "",
    });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setSaving(true);
    try {
      const nextCatalog = await deleteGroup(pendingDelete.slug);
      syncCatalogCache(queryClient, nextCatalog);
      toast.success("Product group deleted.");
      setPendingDelete(null);
      if (editingSlug === pendingDelete.slug) {
        setEditingSlug(undefined);
        form.reset({ name: "", slug: "", description: "", order: "" });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete product group.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <CatalogLoadingState label="Loading product groups..." />;
  if (isError) return <CatalogErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Product Groups</h1>
          <p className="text-sm text-muted-foreground">Create, order, and describe public product groups.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setEditingSlug(undefined);
            form.reset({ name: "", slug: "", description: "", order: "" });
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Group
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingSlug ? "Edit Product Group" : "Create Product Group"}</CardTitle>
          <CardDescription>Slugs are used in public product URLs. Keep them stable after publishing.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 gap-4 lg:grid-cols-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="group-name">Name</Label>
              <Input
                id="group-name"
                {...form.register("name")}
                onChange={(event) => {
                  form.setValue("name", event.target.value);
                  if (!editingSlug) form.setValue("slug", slugify(event.target.value), { shouldValidate: true });
                }}
              />
              {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="group-slug">Slug</Label>
              <Input
                id="group-slug"
                {...form.register("slug")}
                onChange={(event) => form.setValue("slug", slugify(event.target.value), { shouldValidate: true })}
              />
              {form.formState.errors.slug && <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="group-order">Display Order</Label>
              <Input id="group-order" type="number" min="1" {...form.register("order")} />
              {form.formState.errors.order && <p className="text-xs text-destructive">{form.formState.errors.order.message}</p>}
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save"}
              </Button>
              {editingSlug && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingSlug(undefined);
                    form.reset({ name: "", slug: "", description: "", order: "" });
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
            <div className="space-y-2 lg:col-span-4">
              <Label htmlFor="group-description">Description</Label>
              <Textarea id="group-description" className="min-h-24" {...form.register("description")} />
              {form.formState.errors.description && (
                <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Groups</CardTitle>
          <CardDescription>{groups.length} groups in the backend catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Group</th>
                  <th className="px-4 py-3 text-left font-semibold">Slug</th>
                  <th className="px-4 py-3 text-left font-semibold">Products</th>
                  <th className="px-4 py-3 text-left font-semibold">Order</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.slug} className="border-t border-border">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{group.name}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{group.description}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{group.slug}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{group.products.length}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{group.order || ""}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => startEdit(group)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button type="button" variant="destructive" size="sm" onClick={() => setPendingDelete(group)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {groups.length === 0 && (
                  <tr>
                    <td className="px-4 py-10 text-center text-muted-foreground" colSpan={5}>
                      No product groups yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product group?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete {pendingDelete?.name} and every product inside it, including uploaded product files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={confirmDelete}>
              Delete Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
