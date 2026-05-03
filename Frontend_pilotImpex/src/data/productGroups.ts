// Shared catalog types. Runtime catalog data must come from the backend /catalog API.

export interface ProductSpecification {
  srNo: number;
  characteristic: string;
  specification: string;
}

export interface ProductDocument {
  id: string;
  name: string;
  url: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  uploadedAt?: string;
}

export interface Product {
  name: string;
  slug: string;
  image?: string;
  imageOriginalName?: string;
  specifications: ProductSpecification[];
  caution?: string;
  applications: string[];
  documents?: ProductDocument[];
  order?: number;
  price?: string;
  unit?: string;
  moq?: string;
  description?: string;
  category?: string;
  inStock?: boolean;
  rating?: number;
  purity?: string;
  purityValue?: number;
}

export interface ProductGroup {
  name: string;
  slug: string;
  description: string;
  order?: number;
  products: Product[];
}
