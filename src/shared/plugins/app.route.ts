import fastify, { FastifyInstance, FastifyPluginOptions } from "fastify";

const router = async (app: FastifyInstance, options: FastifyPluginOptions) => {
  app.get("/", async (req, res) => {

    res.send("ok");
  });
};

export const AppRouter = router;
