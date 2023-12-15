import * as z from "zod";
import { Product, File, relatedProductModel, relatedFileModel } from "@/types";

export const productImageModel = z.object({
  id: z.string().uuid(),
  alt: z.string().optional(),
});

export interface ProductImage extends z.infer<typeof productImageModel> {
  product: Product;
  file: File;
}

/**
 * relatedProductImageModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductImageModel: z.ZodSchema<ProductImage> = z.lazy(() =>
  productImageModel.extend({
    product: relatedProductModel,
    file: relatedFileModel,
  }),
);
