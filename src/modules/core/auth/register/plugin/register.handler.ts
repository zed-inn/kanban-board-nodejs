import { FastifyReply, FastifyRequest } from "fastify";
import { RegisterBasicBody } from "./schemas/register-basic.schema";
import { RegisterService } from "../register.service";
import { COOKIE, COOKIE_OPTIONS } from "@config/constants/cookie";

export class RegisterHandler {
  static registerBasic = async (
    req: FastifyRequest<{ Body: RegisterBasicBody }>,
    reply: FastifyReply,
  ) => {
    const b = req.body;

    const tokens = await RegisterService.basic(b.email, b.password);
    reply.setCookie(
      COOKIE.ACCESS_TOKEN,
      tokens.access,
      COOKIE_OPTIONS.ACCESS_TOKEN,
    );
    reply.setCookie(
      COOKIE.REFRESH_TOKEN,
      tokens.refresh,
      COOKIE_OPTIONS.REFRESH_TOKEN,
    );

    reply.status(200);
    return;
  };
}
