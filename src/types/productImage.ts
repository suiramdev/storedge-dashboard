import * as z from "zod";
import { Product, relatedProductModel } from "@/types";

export const productImageModel = z.object({
  id: z.string().uuid(),
  src: z.string(),
  alt: z.string().optional(),
});

export interface ProductImage extends z.infer<typeof productImageModel> {
  product?: Product;
}

/**
 * relatedProductImageModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductImageModel: z.ZodSchema<ProductImage> = z.lazy(() =>
  productImageModel.extend({
    product: relatedProductModel.optional(),
  }),
);
