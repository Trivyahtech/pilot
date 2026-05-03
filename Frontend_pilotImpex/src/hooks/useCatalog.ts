import { useQuery } from "@tanstack/react-query";
import type { Product, ProductDocument, ProductGroup } from "@/data/productGroups";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export interface Catalog {
  groups: ProductGroup[];
  updatedAt?: string;
}

export type CatalogProduct = Product & {
  groupName: string;
  groupSlug: string;
  detailPath: string;
};

function absoluteAssetUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  if (url.startsWith("/uploads/")) return `${API_BASE_URL}${url}`;
  return url;
}

function normalizeDocuments(documents?: ProductDocument[]) {
  if (!Array.isArray(documents)) return [];

  return documents
    .map((document) => ({
      ...document,
      name: document.name || document.originalName || "Product Document",
      url: absoluteAssetUrl(document.url),
    }))
    .filter((document) => document.url);
}

function normalizeProduct(product: Product): Product {
  const uploadedImage = absoluteAssetUrl(product.image);

  return {
    ...product,
    image: uploadedImage,
    documents: normalizeDocuments(product.documents),
    specifications: Array.isArray(product.specifications) ? product.specifications : [],
    applications: Array.isArray(product.applications) ? product.applications : [],
  };
}

export function normalizeCatalog(catalog: Catalog): Catalog {
  const groups = Array.isArray(catalog.groups) ? catalog.groups : [];

  return {
    ...catalog,
    groups: groups
      .map((group) => ({
        ...group,
        products: (Array.isArray(group.products) ? group.products.map(normalizeProduct) : []).sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)
        ),
      }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)),
  };
}

export const EMPTY_CATALOG: Catalog = { groups: [] };

export async function fetchCatalog(): Promise<Catalog> {
  const response = await fetch(`${API_BASE_URL}/catalog`);
  if (!response.ok) throw new Error("Unable to load product catalog.");
  return normalizeCatalog(await response.json());
}

export function useCatalog() {
  return useQuery({
    queryKey: ["catalog"],
    queryFn: fetchCatalog,
    retry: 1,
    staleTime: 30_000,
  });
}

export function flattenCatalogProducts(groups: ProductGroup[]): CatalogProduct[] {
  return groups.flatMap((group) =>
    group.products.map((product) => ({
      ...product,
      groupName: group.name,
      groupSlug: group.slug,
      detailPath: `/products/${group.slug}#${product.slug}`,
    }))
  );
}
