import { FastifyReply, FastifyRequest } from "fastify";
import { LoginBasicBody } from "./schemas/login-basic.schema";
import { LoginService } from "../login.service";
import { COOKIE, COOKIE_OPTIONS } from "@config/constants/cookie";

export class LoginHandler {
  static loginBasic = async (
    req: FastifyRequest<{ Body: LoginBasicBody }>,
    reply: FastifyReply,
  ) => {
    const b = req.body;

    const tokens = await LoginService.basic(b.email, b.password);
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
