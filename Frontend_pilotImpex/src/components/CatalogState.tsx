import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function CatalogLoadingState({ label = "Loading catalog..." }: { label?: string }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-56 rounded-lg" />
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function CatalogErrorState({
  onRetry,
  title = "Catalog unavailable",
  message = "Product data could not be loaded from the backend catalog.",
}: {
  onRetry?: () => void;
  title?: string;
  message?: string;
}) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="font-heading text-2xl font-semibold text-foreground">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <Button type="button" className="mt-5" variant="outline" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
