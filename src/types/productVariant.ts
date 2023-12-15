import * as z from "zod";
import { Product, relatedProductModel } from "@/types";

export const productVariantModel = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1, "Name must be at least 3 characters").max(255, "Name must not exceed 255 characters"),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().min(0).int(),
  newlyAdded: z.boolean().default(false),
});

export interface ProductVariant extends z.infer<typeof productVariantModel> {
  product: Product;
}

/**
 * relatedProductVariantModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductVariantModel: z.ZodSchema<ProductVariant> = z.lazy(() =>
  productVariantModel.extend({
    product: relatedProductModel,
  }),
);
