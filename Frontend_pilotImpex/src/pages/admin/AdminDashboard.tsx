import { FileText, FolderTree, ImageOff, Package, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CatalogErrorState, CatalogLoadingState } from "@/components/CatalogState";
import { flattenCatalogProducts, useCatalog } from "@/hooks/useCatalog";
import { productNeedsDocument, productNeedsImage } from "./adminUtils";

function StatCard({ title, value, icon: Icon }: { title: string; value: number; icon: typeof Package }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-bold text-primary">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: catalog, isError, isLoading, refetch } = useCatalog();
  const groups = catalog?.groups ?? [];
  const products = flattenCatalogProducts(groups);
  const documentCount = products.reduce((sum, product) => sum + (product.documents?.length || 0), 0);
  const missingImages = products.filter(productNeedsImage);
  const missingDocuments = products.filter(productNeedsDocument);
  const outOfStock = products.filter((product) => product.inStock === false);

  if (isLoading) return <CatalogLoadingState label="Loading admin dashboard..." />;
  if (isError) return <CatalogErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Catalog health and quick actions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/secret/products/new">Add Product</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/secret/documents">Upload Document</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Groups" value={groups.length} icon={FolderTree} />
        <StatCard title="Products" value={products.length} icon={Package} />
        <StatCard title="Documents" value={documentCount} icon={FileText} />
        <StatCard title="Missing Images" value={missingImages.length} icon={ImageOff} />
        <StatCard title="Out of Stock" value={outOfStock.length} icon={ShoppingBag} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Needs Attention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <span className="text-sm text-muted-foreground">Products without images</span>
              <Badge variant={missingImages.length ? "destructive" : "secondary"}>{missingImages.length}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <span className="text-sm text-muted-foreground">Products without PDFs</span>
              <Badge variant={missingDocuments.length ? "outline" : "secondary"}>{missingDocuments.length}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <span className="text-sm text-muted-foreground">Out-of-stock products</span>
              <Badge variant={outOfStock.length ? "outline" : "secondary"}>{outOfStock.length}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Product Groups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {groups.slice(0, 6).map((group) => (
              <div key={group.slug} className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="font-medium text-foreground">{group.name}</p>
                  <p className="text-xs text-muted-foreground">{group.slug}</p>
                </div>
                <Badge variant="outline">{group.products.length} products</Badge>
              </div>
            ))}
            {groups.length === 0 && (
              <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No product groups yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
