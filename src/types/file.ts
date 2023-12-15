import * as z from "zod";
import { relatedProductImageModel } from "@/types";

export const fileModel = z.object({
  id: z.string().uuid(),
  bucket: z.string(),
  key: z.string(),
  contentType: z.string(),
  url: z.string().url(),
});

export type File = z.infer<typeof fileModel>;

/**
 * relatedFileModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedFileModel: z.ZodSchema<File> = z.lazy(() =>
  fileModel.extend({
    images: z.array(relatedProductImageModel).default([]),
  }),
);
