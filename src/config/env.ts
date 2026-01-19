import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
  APP_HOST: z.string("Invalid Hostname").default("localhost"),
  APP_PORT: z.coerce.number("Invalid Port").int().positive().default(8000),
  PG_USER: z.string("Invalid Pg Username"),
  PG_HOST: z.string("Invalid Pg Host").default("localhost"),
  PG_DATABASE: z.string("Invalid Pg Database"),
  PG_PASSWORD: z.string("Invalid Pg Password"),
  PG_PORT: z.coerce.number("Invalid Pg Port").int().positive().default(5432),
});

export const env = EnvSchema.parse(process.env);
