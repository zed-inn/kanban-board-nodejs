import { z } from "zod";
import { MemberModel } from "../../member.model";

export const ExitMembershipParamsSchema = MemberModel.pick({ boardId: true });

export type ExitMembershipParams = z.infer<typeof ExitMembershipParamsSchema>;
