import * as z from "zod";
import { Collection, relatedCollectionModel, Product, relatedProductModel } from "@/types";

export enum CurrencyCode {
  EUR = "EUR",
}

export const storeModel = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(255),
  description: z.string().optional(),
  currencyCode: z.nativeEnum(CurrencyCode),
});

export interface Store extends z.infer<typeof storeModel> {
  collections: Collection[];
  products: Product[];
}

/**
 * relatedStoreModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedStoreModel: z.ZodSchema<Store> = z.lazy(() =>
  storeModel.extend({
    collections: z.array(relatedCollectionModel).default([]),
    products: z.array(relatedProductModel).default([]),
  }),
);
