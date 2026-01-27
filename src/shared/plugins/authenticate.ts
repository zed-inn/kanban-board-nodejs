import { AuthTokenService } from "@modules/core/auth/auth.service";
import { AuthPayload } from "@shared/schemas/auth.schema";
import { cookieAccessToken, TOKEN } from "@shared/utils/set-tokens-in-cookie";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export const authenticate = fp(async (app: FastifyInstance) => {
  app.addHook(
    "preValidation",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const cks = req.cookies as Record<string, unknown>;
        const tokens = {
          access: cks[TOKEN.ACCESS] as string | undefined,
          refresh: cks[TOKEN.REFRESH] as string | undefined,
        };

        if (tokens.access) {
          const payload = AuthTokenService.validateToken("ACCESS")(
            tokens.access,
          );
          if (payload.valid) req.user = payload.data as AuthPayload;
          return;
        } else if (tokens.refresh) {
          // get user again, but as access and refresh are same,
          const payload = AuthTokenService.validateToken("REFRESH")(
            tokens.refresh,
          );
          if (payload.valid) {
            const ac = cookieAccessToken(payload.data as AuthPayload);
            reply.setCookie(ac.name, ac.value, ac.options);
            req.user = payload.data as AuthPayload; // same data, that's why
            return;
          }
        }
      } catch (error) {
        app.log.error(error);
      }
    },
  );
});
