import * as z from "zod";
import { storeSchema } from "./store";

export enum ProductStatus {
  PUBLISHED = "Published",
  DRAFT = "Draft",
}
export const productStatusSchema = z.nativeEnum(ProductStatus);

export const productImageSchema = z.object({
  id: z.string(),
  src: z.string().url(),
  alt: z.string().optional(),
});
export type ProductImage = z.infer<typeof productImageSchema>;

export const productVariantSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(3, "Variant name must be at least 3 characters long").max(255),
  stock: z.number().min(0, "Stock cannot be negative"),
  price: z.number().min(0, "Price cannot be negative"),
});
export type ProductVariant = z.infer<typeof productVariantSchema>;

export const productOptionValueSchema = z.object({
  id: z.string(),
  value: z.string().trim().min(3, "Option value must be at least 3 characters long").max(255),
});
export type ProductOptionValue = z.infer<typeof productOptionValueSchema>;

export const productOptionSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(3, "Option name must be at least 3 characters long").max(255),
  values: z.array(productOptionValueSchema).min(2, "Option must have at least two values")
});
export type ProductOption = z.infer<typeof productOptionSchema>;

export const productSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(3, "Product name must be at least 3 characters long").max(255),
  description: z.string().optional(),
  status: productStatusSchema,
  avgPrice: z.number().optional(),
  images: z.array(productImageSchema).default([]),
  options: z.array(productOptionSchema).default([]),
  variants: z.array(productVariantSchema).default([]),
  store: storeSchema.optional(),
});
export type Product = z.infer<typeof productSchema>;
