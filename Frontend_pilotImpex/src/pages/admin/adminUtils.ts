import { type QueryClient } from "@tanstack/react-query";
import { type Catalog, flattenCatalogProducts } from "@/hooks/useCatalog";
import type { Product } from "@/data/productGroups";

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatFileSize(size?: number) {
  if (!size) return "0 KB";
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function syncCatalogCache(queryClient: QueryClient, catalog: Catalog) {
  queryClient.setQueryData(["admin", "catalog"], catalog);
  queryClient.setQueryData(["catalog"], catalog);
}

export function findProduct(catalog: Catalog | undefined, slug?: string) {
  if (!catalog || !slug) return undefined;
  return flattenCatalogProducts(catalog.groups).find((product) => product.slug === slug);
}

export function duplicateGroupSlug(catalog: Catalog, slug: string, currentSlug?: string) {
  return catalog.groups.some((group) => group.slug === slug && group.slug !== currentSlug);
}

export function duplicateProductSlug(catalog: Catalog, slug: string, currentSlug?: string) {
  return flattenCatalogProducts(catalog.groups).some((product) => product.slug === slug && product.slug !== currentSlug);
}

export function productNeedsImage(product: Product) {
  return !product.image;
}

export function productNeedsDocument(product: Product) {
  return !product.documents?.length;
}
