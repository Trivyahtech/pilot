import { API_BASE_URL, normalizeCatalog, type Catalog } from "@/hooks/useCatalog";
import type { ProductDocument } from "@/data/productGroups";

export type AdminUser = {
  username: string;
};

export async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: isFormData
      ? options.headers
      : {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }
  return payload as T;
}

export function loginAdmin(username: string, password: string) {
  return adminRequest<AdminUser>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function logoutAdmin() {
  return adminRequest<{ ok: boolean }>("/admin/logout", { method: "POST" });
}

export function getAdminMe() {
  return adminRequest<AdminUser>("/admin/me");
}

export async function getAdminCatalog() {
  const catalog = await adminRequest<Catalog>("/admin/catalog");
  return normalizeCatalog(catalog);
}

export async function saveGroup(payload: Record<string, unknown>, currentSlug?: string) {
  const catalog = await adminRequest<Catalog>(currentSlug ? `/admin/groups/${currentSlug}` : "/admin/groups", {
    method: currentSlug ? "PUT" : "POST",
    body: JSON.stringify(payload),
  });
  return normalizeCatalog(catalog);
}

export async function deleteGroup(slug: string) {
  const catalog = await adminRequest<Catalog>(`/admin/groups/${slug}`, { method: "DELETE" });
  return normalizeCatalog(catalog);
}

export async function saveProduct(payload: Record<string, unknown>, currentSlug?: string) {
  const catalog = await adminRequest<Catalog>(currentSlug ? `/admin/products/${currentSlug}` : "/admin/products", {
    method: currentSlug ? "PUT" : "POST",
    body: JSON.stringify(payload),
  });
  return normalizeCatalog(catalog);
}

export async function deleteProduct(slug: string) {
  const catalog = await adminRequest<Catalog>(`/admin/products/${slug}`, { method: "DELETE" });
  return normalizeCatalog(catalog);
}

export async function uploadProductImage(slug: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);
  const catalog = await adminRequest<Catalog>(`/admin/products/${slug}/image`, {
    method: "POST",
    body: formData,
  });
  return normalizeCatalog(catalog);
}

export async function uploadProductDocument(slug: string, file: File, name?: string) {
  const formData = new FormData();
  formData.append("document", file);
  if (name?.trim()) formData.append("name", name.trim());
  const catalog = await adminRequest<Catalog>(`/admin/products/${slug}/documents`, {
    method: "POST",
    body: formData,
  });
  return normalizeCatalog(catalog);
}

export async function renameProductDocument(slug: string, document: ProductDocument, name: string) {
  const catalog = await adminRequest<Catalog>(`/admin/products/${slug}/documents/${document.id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
  return normalizeCatalog(catalog);
}

export async function deleteProductDocument(slug: string, document: ProductDocument) {
  const catalog = await adminRequest<Catalog>(`/admin/products/${slug}/documents/${document.id}`, {
    method: "DELETE",
  });
  return normalizeCatalog(catalog);
}
