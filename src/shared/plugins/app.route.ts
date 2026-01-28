import { AuthRouter } from "@modules/core/auth";
import { BoardRouter } from "@modules/core/board";
import { MemberRouter } from "@modules/core/member";
import { ColumnRouter } from "@modules/features/column";
import { ZodFastifyInstance } from "@shared/types/zod-fastify";
import { FastifyPluginOptions } from "fastify";

// { prefix : router }
const routes: Record<
  string,
  (router: ZodFastifyInstance, options?: FastifyPluginOptions) => Promise<void>
> = {
  "/auth": AuthRouter,
  "/boards": BoardRouter,
  "/boards/:boardId/member": MemberRouter,
  "/boards/:boardId/columns": ColumnRouter,
};

const router = async (app: ZodFastifyInstance) => {
  for (const [prefix, route] of Object.entries(routes))
    app.register(route, { prefix });
};

export const AppRouter = router;
