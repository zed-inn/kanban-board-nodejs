import fastify from "fastify";
import { env } from "@config/env";
import { AppRouter } from "@shared/plugins/app.route";

const app = fastify({ logger: true, trustProxy: env.NODE_ENV === "prod" });

app.register(AppRouter);

export default app;
