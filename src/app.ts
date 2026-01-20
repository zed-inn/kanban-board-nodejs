import fastify from "fastify";
import { env } from "@config/env";
import { AppRouter } from "@shared/plugins/app.route";
import fastifyCookie from "@fastify/cookie";

const app = fastify({
  logger: env.NODE_ENV === "dev",
  trustProxy: env.NODE_ENV === "prod",
});

app.decorateRequest("user", undefined);

app.register(fastifyCookie);
app.register(AppRouter);

export default app;
