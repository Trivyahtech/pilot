import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, ImageOff, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { flattenCatalogProducts, useCatalog, type CatalogProduct } from "@/hooks/useCatalog";
import { deleteProduct } from "./adminApi";
import { productNeedsDocument, productNeedsImage, syncCatalogCache } from "./adminUtils";

export default function ProductsManagement() {
  const { data: catalog, isError, isLoading, refetch } = useCatalog();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<CatalogProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const groups = useMemo(() => catalog?.groups ?? [], [catalog?.groups]);
  const products = useMemo(() => flattenCatalogProducts(groups), [groups]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query) ||
        product.groupName.toLowerCase().includes(query) ||
        (product.category || "").toLowerCase().includes(query);
      const matchesGroup = groupFilter === "all" || product.groupSlug === groupFilter;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && product.inStock !== false) ||
        (stockFilter === "out-of-stock" && product.inStock === false) ||
        (stockFilter === "missing-image" && productNeedsImage(product)) ||
        (stockFilter === "missing-document" && productNeedsDocument(product));
      return matchesQuery && matchesGroup && matchesStock;
    });
  }, [groupFilter, products, search, stockFilter]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setSaving(true);
    try {
      const nextCatalog = await deleteProduct(pendingDelete.slug);
      syncCatalogCache(queryClient, nextCatalog);
      toast.success("Product deleted.");
      setPendingDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete product.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <CatalogLoadingState label="Loading products..." />;
  if (isError) return <CatalogErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Product Management</h1>
          <p className="text-sm text-muted-foreground">Search, filter, edit, and publish catalog products.</p>
        </div>
        <Button asChild>
          <Link to="/secret/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-[1fr_220px_220px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, slug, group, or category"
              className="pl-9"
            />
          </div>
          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All groups</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.slug} value={group.slug}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="in-stock">In stock</SelectItem>
              <SelectItem value="out-of-stock">Out of stock</SelectItem>
              <SelectItem value="missing-image">Missing image</SelectItem>
              <SelectItem value="missing-document">Missing document</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSearch("");
              setGroupFilter("all");
              setStockFilter("all");
            }}
          >
            Clear
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Showing {filteredProducts.length} of {products.length} backend catalog products.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border border-border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-muted/60 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Product</th>
                    <th className="px-4 py-3 text-left font-semibold">Group</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Image</th>
                    <th className="px-4 py-3 text-left font-semibold">Documents</th>
                    <th className="px-4 py-3 text-left font-semibold">Order</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.slug} className="border-t border-border">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{product.groupName}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={product.inStock === false ? "destructive" : "secondary"}>
                          {product.inStock === false ? "Out of stock" : "In stock"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-12 w-12 rounded-md border object-contain" />
                        ) : (
                          <Badge variant="destructive">
                            <ImageOff className="mr-1 h-3 w-3" />
                            Missing
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={product.documents?.length ? "outline" : "secondary"}>
                          <FileText className="mr-1 h-3 w-3" />
                          {product.documents?.length || 0}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{product.order || ""}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/secret/products/${product.slug}/edit`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </Button>
                          <Button type="button" variant="destructive" size="sm" onClick={() => setPendingDelete(product)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td className="px-4 py-12 text-center text-muted-foreground" colSpan={7}>
                        No products match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete {pendingDelete?.name} and its uploaded image and documents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={saving}
              onClick={confirmDelete}
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
