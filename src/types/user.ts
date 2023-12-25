import * as z from "zod";
import { Role, relatedRoleModel } from "@/types";

export const userModel = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  persistent: z.boolean().default(false),
});

export interface User extends z.infer<typeof userModel> {
  role?: Role;
}

/**
 * relatedProductModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserModel: z.ZodSchema<User> = z.lazy(() =>
  userModel.extend({
    role: relatedRoleModel.optional(),
  }),
);
