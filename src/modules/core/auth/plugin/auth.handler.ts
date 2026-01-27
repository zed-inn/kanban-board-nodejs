import { COOKIE } from "@config/constants/cookie";
import { FastifyReply, FastifyRequest } from "fastify";

export class AuthHandler {
  static logout = async (req: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie(COOKIE.ACCESS_TOKEN);
    reply.clearCookie(COOKIE.REFRESH_TOKEN);

    reply.status(204);
    return;
  };
}
