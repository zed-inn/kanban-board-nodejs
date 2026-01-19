import fastify from "fastify";
import { env } from "@config/env";
import { AppRouter } from "@shared/plugins/app.route";

const app = fastify({
  logger: env.NODE_ENV === "dev",
  trustProxy: env.NODE_ENV === "prod",
});

app.register(AppRouter);

export default app;
