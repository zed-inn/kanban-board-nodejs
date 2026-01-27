import { UserModel } from "@modules/core/user";
import { z } from "zod";

export const LoginBasicBodySchema = z.object({
  email: UserModel.shape.email,
  password: z.string(),
});

export type LoginBasicBody = z.infer<typeof LoginBasicBodySchema>;
