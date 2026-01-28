import { FastifyReply, FastifyRequest } from "fastify";
import {
  AddMemberBody,
  AddMemberParams,
  AddMemberResponse,
} from "./schemas/add-member.schema";
import { ExitMembershipParams } from "./schemas/exit-membership.schema";
import { UserService } from "@modules/core/user";
import { MemberService } from "../member.service";
import { AuthPayloadSchema } from "@shared/schemas/auth.schema";

export class MemberHandler {
  static addMember = async (
    req: FastifyRequest<{ Body: AddMemberBody; Params: AddMemberParams }>,
    reply: FastifyReply,
  ): Promise<AddMemberResponse> => {
    const b = req.body,
      p = req.params;

    const userToJoin = await UserService.getByEmail(b.email);
    await MemberService.addMember(p.boardId, userToJoin.id);

    reply.status(200);
    return { message: "Member added." };
  };

  static exitMembership = async (
    req: FastifyRequest<{ Params: ExitMembershipParams }>,
    reply: FastifyReply,
  ) => {
    const p = req.params;
    const user = AuthPayloadSchema.parse(req.user);

    await MemberService.exitMembership(p.boardId, user.id);

    reply.status(204);
    return;
  };
}
