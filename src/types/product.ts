import * as z from "zod";
import {
  Store,
  relatedStoreModel,
  ProductImage,
  relatedProductImageModel,
  ProductVariant,
  relatedProductVariantModel,
  Collection,
  relatedCollectionModel,
} from "@/types";

export enum ProductStatus {
  DRAFT = "Draft",
  PUBLISHED = "Published",
}

export const productModel = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(255),
  description: z.string().optional(),
  price: z.coerce.number().positive().default(0),
  minPrice: z.number().optional(),
  avgPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  status: z.nativeEnum(ProductStatus),
});

export interface Product extends z.infer<typeof productModel> {
  store?: Store;
  images: ProductImage[];
  variants: ProductVariant[];
  collections: Collection[];
}

/**
 * relatedProductModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductModel: z.ZodSchema<Product> = z.lazy(() =>
  productModel.extend({
    store: relatedStoreModel.optional(),
    images: z.array(relatedProductImageModel).default([]),
    variants: z.array(relatedProductVariantModel).default([]),
    collections: z.array(relatedCollectionModel).default([]),
  }),
);
