import { UserModel } from "@modules/core/user";
import { z } from "zod";
import { MemberModel } from "../../member.model";
import { GlobalResponseSchema } from "@shared/schemas/global.schema";

export const AddMemberBodySchema = z.object({
  email: UserModel.shape.email,
});

export type AddMemberBody = z.infer<typeof AddMemberBodySchema>;

export const AddMemberParamsSchema = MemberModel.pick({ boardId: true });

export type AddMemberParams = z.infer<typeof AddMemberParamsSchema>;

export const AddMemberResponseSchema = GlobalResponseSchema()

export type AddMemberResponse = z.infer<typeof AddMemberResponseSchema>