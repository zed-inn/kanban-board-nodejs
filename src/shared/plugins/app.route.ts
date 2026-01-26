import { ZodFastifyInstance } from "@shared/types/zod-fastify";
import { FastifyPluginOptions } from "fastify";

// { prefix : router }
const routes: Record<
  string,
  (
    router: ZodFastifyInstance,
    options: FastifyPluginOptions,
  ) => void | Promise<void>
> = {};

const router = async (
  app: ZodFastifyInstance,
  options: FastifyPluginOptions,
) => {
  for (const [prefix, route] of Object.entries(routes))
    app.register(route, { prefix });
};

export const AppRouter = router;
