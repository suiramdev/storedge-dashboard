import * as z from "zod";
import { User, relatedUserModel } from "@/types";

export const roleModel = z.object({
  id: z.string().uuid(),
  name: z.string(),
  scopes: z.array(z.string()).default([]),
});

export interface Role extends z.infer<typeof roleModel> {
  users: User[];
}

/**
 * relatedProductModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedRoleModel: z.ZodSchema<Role> = z.lazy(() =>
  roleModel.extend({
    users: z.array(relatedUserModel).default([]),
  }),
);
