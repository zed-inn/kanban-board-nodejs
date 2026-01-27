import { ZodFastifyInstance } from "@shared/types/zod-fastify";
import { LoginBasicBodySchema } from "./schemas/login-basic.schema";
import { LoginHandler } from "./login.handler";

export const LoginRouter = async (router: ZodFastifyInstance) => {
  router.post(
    "/",
    { schema: { body: LoginBasicBodySchema } },
    LoginHandler.loginBasic,
  );
};
