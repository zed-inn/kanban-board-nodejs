import { MemberService } from "@modules/core/member";
import { AuthPayloadSchema } from "@shared/schemas/auth.schema";
import { AppError } from "@shared/utils/app-error";
import { FastifyRequest } from "fastify";

export class RestrictTo {
  static loggedInUser = async <T extends FastifyRequest>(req: T) => {
    if (!req.user) throw new AppError("Unauthorized.", 401);
  };

  static memberOfBoard =
    (key: string) =>
    async <T extends FastifyRequest>(req: T) => {
      const p = req.params as Record<string, unknown>;
      const user = AuthPayloadSchema.parse(req.user);

      const isMemeber = await MemberService.isMember(p[key] as string, user.id);
      if (!isMemeber)
        throw new AppError("You are not a member of this board.", 403);
    };
}
