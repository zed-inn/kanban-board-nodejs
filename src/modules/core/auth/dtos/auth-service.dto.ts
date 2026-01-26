import { UserModel } from "@modules/core/user";
import { z } from "zod";

export const AccessTokenSchema = z.object({ id: UserModel.shape.id });

export type AccessTokenDto = z.infer<typeof AccessTokenSchema>;

export const RefreshTokenSchema = z.object({ id: UserModel.shape.id });

export type RefreshTokenDto = z.infer<typeof RefreshTokenSchema>;
