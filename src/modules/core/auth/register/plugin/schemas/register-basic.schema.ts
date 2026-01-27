import { UserModel } from "@modules/core/user";
import { z } from "zod";

export const RegisterBasicBodySchema = z.object({
  email: UserModel.shape.email,
  password: z.string(),
});

export type RegisterBasicBody = z.infer<typeof RegisterBasicBodySchema>;
