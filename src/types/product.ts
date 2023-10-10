import { Store } from "./store";

export enum ProductStatus {
  PUBLISHED = "Published",
  DRAFT = "Draft",
}

export type ProductImage = {
  id: string;
  src: string;
  alt?: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  status: ProductStatus;
  images: ProductImage[];
  avgPrice?: number;
  store: Store;
};
