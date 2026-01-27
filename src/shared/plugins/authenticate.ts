import {
  AuthCookiePartialSchema,
  COOKIE,
  COOKIE_OPTIONS,
} from "@config/constants/cookie";
import { AuthTokenService } from "@modules/core/auth/auth.service";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export const authenticate = fp(async (app: FastifyInstance) => {
  app.addHook(
    "preValidation",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { "access-token": _at, "refresh-token": _rt } =
          AuthCookiePartialSchema.parse(req.cookies);

        if (_at) {
          const payload = AuthTokenService.validateToken("ACCESS")(_at);
          if (payload) req.user = payload;
          return;
        } else if (_rt) {
          // get user again, but as access and refresh are same,
          const payload = AuthTokenService.validateToken("REFRESH")(_rt);
          if (payload) {
            reply.setCookie(
              COOKIE.ACCESS_TOKEN,
              AuthTokenService.createToken("ACCESS")(payload),
              COOKIE_OPTIONS.ACCESS_TOKEN,
            );
            req.user = payload; // same data, that's why no change
            return;
          }
        }
      } catch (error) {
        app.log.error(error);
      }
    },
  );
});
