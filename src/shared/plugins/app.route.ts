import { FastifyInstance, FastifyPluginOptions } from "fastify";

// { prefix : router }
const routes: Record<
  string,
  (
    router: FastifyInstance,
    options: FastifyPluginOptions,
  ) => void | Promise<void>
> = {};

const router = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  for (const [prefix, route] of Object.entries(routes))
    app.register(route, { prefix });
};

export const AppRouter = router;
