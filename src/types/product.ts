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

export const productOptionSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(3, "Option name cannot be empty").max(255),
});
export type ProductOption = z.infer<typeof productOptionSchema>;

export const productVariantSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(3, "Variant name cannot be empty").max(255),
  stock: z.number().min(0, "Stock cannot be negative"),
  price: z.number().min(0, "Price cannot be negative"),
  values: z.array(
    z.object({
      id: z.string().optional(),
      optionId: z.string(),
      value: z.string().trim().min(3, "Option value cannot be empty").max(255),
    }),
  ),
});
export type ProductVariant = z.infer<typeof productVariantSchema>;

export const productSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(3, "Product name cannot be empty").max(255),
  description: z.string(),
  status: productStatusSchema,
  avgPrice: z.number().optional(),
  images: z.array(productImageSchema),
  options: z.array(productOptionSchema),
  variants: z.array(productVariantSchema),
  store: storeSchema,
});
export type Product = z.infer<typeof productSchema>;
