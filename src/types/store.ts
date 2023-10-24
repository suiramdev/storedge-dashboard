import * as z from "zod";

export const storeCurrencyCodeSchema = z.enum([ "EUR" ]).default("EUR");
export type StoreCurrencyCode = z.infer<typeof storeCurrencyCodeSchema>;

export const storeSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(3, "Store name cannot be empty").max(255),
  description: z.string().optional(),
  currencyCode: storeCurrencyCodeSchema,
});
export type Store = z.infer<typeof storeSchema>;
