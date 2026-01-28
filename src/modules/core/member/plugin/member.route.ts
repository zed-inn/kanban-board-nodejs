import { ZodFastifyInstance } from "@shared/types/zod-fastify";
import { MemberHandler } from "./member.handler";
import {
  AddMemberBodySchema,
  AddMemberParamsSchema,
  AddMemberResponseSchema,
} from "./schemas/add-member.schema";
import { ExitMembershipParamsSchema } from "./schemas/exit-membership.schema";
import { RestrictTo } from "@shared/middlewares/restrict-to";

export const MemberRouter = async (router: ZodFastifyInstance) => {
  router.post(
    "/",
    {
      schema: {
        body: AddMemberBodySchema,
        params: AddMemberParamsSchema,
        response: { 200: AddMemberResponseSchema },
      },
      preHandler: [
        RestrictTo.loggedInUser,
        RestrictTo.memberOfBoard("boardId"),
      ],
    },
    MemberHandler.addMember,
  );

  router.delete(
    "/",
    {
      schema: { params: ExitMembershipParamsSchema },
      preHandler: [
        RestrictTo.loggedInUser,
        RestrictTo.memberOfBoard("boardId"),
      ],
    },
    MemberHandler.exitMembership,
  );
};
