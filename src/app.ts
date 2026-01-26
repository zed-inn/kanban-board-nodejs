import fastify from "fastify";
import { env } from "@config/env";
import { AppRouter } from "@shared/plugins/app.route";
import fastifyCookie from "@fastify/cookie";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

const app = fastify({
  logger: env.NODE_ENV === "dev",
  trustProxy: env.NODE_ENV === "prod",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.decorateRequest("user", undefined);

app.register(fastifyCookie);
app.register(AppRouter);

export default app;
