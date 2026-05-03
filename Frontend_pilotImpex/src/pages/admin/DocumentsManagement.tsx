import { FormEvent, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { ProductDocument } from "@/data/productGroups";
import { deleteProductDocument, renameProductDocument, uploadProductDocument } from "./adminApi";
import { formatFileSize, syncCatalogCache } from "./adminUtils";

type PendingDocumentDelete = {
  product: CatalogProduct;
  document: ProductDocument;
};

const maxPdfSize = 10 * 1024 * 1024;

export default function DocumentsManagement() {
  const { data: catalog, isError, isLoading, refetch } = useCatalog();
  const queryClient = useQueryClient();
  const products = useMemo(() => flattenCatalogProducts(catalog?.groups ?? []), [catalog]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [documentNames, setDocumentNames] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDocumentDelete | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedProduct = products.find((product) => product.slug === selectedSlug) || products[0];
  const productSlug = selectedProduct?.slug || "";

  const uploadDocument = async (event: FormEvent) => {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!productSlug) {
      toast.error("Choose a product first.");
      return;
    }
    if (!file) {
      toast.error("Choose a PDF document.");
      return;
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF documents can be uploaded.");
      return;
    }
    if (file.size > maxPdfSize) {
      toast.error("PDF document must be 10 MB or smaller.");
      return;
    }

    setSaving(true);
    try {
      const nextCatalog = await uploadProductDocument(productSlug, file, documentName);
      syncCatalogCache(queryClient, nextCatalog);
      toast.success("Document uploaded.");
      setDocumentName("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload document.");
    } finally {
      setSaving(false);
    }
  };

  const renameDocument = async (document: ProductDocument) => {
    if (!selectedProduct) return;
    const name = (documentNames[document.id] ?? document.name ?? document.originalName ?? "").trim();
    if (!name) {
      toast.error("Document name is required.");
      return;
    }
    setSaving(true);
    try {
      const nextCatalog = await renameProductDocument(selectedProduct.slug, document, name);
      syncCatalogCache(queryClient, nextCatalog);
      toast.success("Document renamed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to rename document.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setSaving(true);
    try {
      const nextCatalog = await deleteProductDocument(pendingDelete.product.slug, pendingDelete.document);
      syncCatalogCache(queryClient, nextCatalog);
      toast.success("Document deleted.");
      setPendingDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete document.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <CatalogLoadingState label="Loading documents..." />;
  if (isError) return <CatalogErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Document Management</h1>
        <p className="text-sm text-muted-foreground">Upload, rename, and remove public product PDF documents.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Product PDF</CardTitle>
          <CardDescription>Documents appear on the public product card after upload.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]" onSubmit={uploadDocument}>
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={productSlug} onValueChange={setSelectedSlug}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.slug} value={product.slug}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-name">Display Name</Label>
              <Input
                id="document-name"
                value={documentName}
                onChange={(event) => setDocumentName(event.target.value)}
                placeholder="Defaults to original filename"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-file">PDF Document</Label>
              <Input id="document-file" ref={fileRef} type="file" accept="application/pdf,.pdf" />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={saving || !productSlug}>
                <Plus className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{selectedProduct ? selectedProduct.name : "Product Documents"}</CardTitle>
          <CardDescription>Rename labels or delete PDFs from the selected product.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(selectedProduct?.documents || []).map((document) => (
            <div key={document.id} className="grid grid-cols-1 gap-3 rounded-md border border-border p-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
              <div className="space-y-2">
                <Input
                  value={documentNames[document.id] ?? document.name}
                  onChange={(event) => setDocumentNames((current) => ({ ...current, [document.id]: event.target.value }))}
                />
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{document.originalName || document.name}</span>
                  <span>{formatFileSize(document.size)}</span>
                  {document.uploadedAt && <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>}
                </div>
              </div>
              <Badge variant="outline" className="w-fit">
                <FileText className="mr-1 h-3 w-3" />
                PDF
              </Badge>
              <Button type="button" variant="outline" onClick={() => renameDocument(document)} disabled={saving}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </Button>
              <Button type="button" variant="destructive" onClick={() => selectedProduct && setPendingDelete({ product: selectedProduct, document })}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          ))}
          {(!selectedProduct || (selectedProduct.documents || []).length === 0) && (
            <div className="rounded-md border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No uploaded documents for this product.
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {pendingDelete?.document.name} from {pendingDelete?.product.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={saving}
              onClick={confirmDelete}
            >
              Delete Document
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
