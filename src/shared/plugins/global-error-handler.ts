import { FastifyReply, FastifyRequest } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { env } from "@config/env";
import app from "@/app";
import { AppError } from "@shared/utils/app-error";

export const GlobalErrorHandler = (
  error: any,
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: "Validation Error",
      errors: error.validation,
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Invalid Data",
      errors: error.issues,
    });
  }

  app.log.error(error);
  const statusCode = error.statusCode || 500;

  return reply.status(statusCode).send({
    message: statusCode === 500 ? "Internal Server Error" : error.message,
    ...(env.NODE_ENV === "dev" ? { stack: error.stack } : {}),
  });
};
