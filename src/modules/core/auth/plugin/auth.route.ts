import { ZodFastifyInstance } from "@shared/types/zod-fastify";
import { LoginRouter } from "../login/plugin/login.route";
import { RegisterRouter } from "../register/plugin/register.route";
import { AuthHandler } from "./auth.handler";
import { RestrictTo } from "@shared/hooks/restrict-to";

export const AuthRouter = async (router: ZodFastifyInstance) => {
  router.register(LoginRouter, { prefix: "/login" });

  router.register(RegisterRouter, { prefix: "/register" });

  router.get(
    "/logout",
    { preHandler: [RestrictTo.loggedInUser] },
    AuthHandler.logout,
  );
};
