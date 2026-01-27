import { ZodFastifyInstance } from "@shared/types/zod-fastify";
import { RegisterBasicBodySchema } from "./schemas/register-basic.schema";
import { RegisterHandler } from "./register.handler";

export const RegisterRouter = async (router: ZodFastifyInstance) => {
  router.post(
    "/",
    { schema: { body: RegisterBasicBodySchema } },
    RegisterHandler.registerBasic,
  );
};
