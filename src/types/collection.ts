import * as z from "zod";
import { Store, relatedStoreModel, Product, relatedProductModel } from "@/types";

export const collectionModel = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(255),
  description: z.string().optional(),
});

export interface Collection extends z.infer<typeof collectionModel> {
  store?: Store | null;
  products: Product[];
}

/**
 * relatedCollectionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCollectionModel: z.ZodSchema<Collection> = z.lazy(() =>
  collectionModel.extend({
    store: relatedStoreModel.nullish(),
    products: relatedProductModel.array(),
  }),
);
