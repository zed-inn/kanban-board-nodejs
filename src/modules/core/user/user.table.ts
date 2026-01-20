import { DbTable } from "@shared/services/db-table.service";
import { z } from "zod";

const UserSqlSchema = `CREATE TABLE IF NOT EXISTS users (
                          id SERIAL NOT NULL,
                          email VARCHAR(255) NOT NULL,
                          password_hash VARCHAR(255) NOT NULL,
                          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                          PRIMARY KEY(id),
                          UNIQUE(id),
                          UNIQUE(email)
                      );`;

export const UserModel = z.object({
  id: z.int().nonnegative(),
  email: z.email(),
  passwordHash: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserAttributes = z.infer<typeof UserModel>;

export const User = new DbTable<UserAttributes>(UserSqlSchema, UserModel);
