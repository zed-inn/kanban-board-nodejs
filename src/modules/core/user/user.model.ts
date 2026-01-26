import { zId } from "@config/constants/db-schema";
import { DbModel } from "@shared/services/model.service";
import { TABLE } from "@shared/utils/db-table-fields";
import { z } from "zod";

const UserSqlSchema = `CREATE TABLE IF NOT EXISTS users (
                        ${TABLE.ID_PRIM_KEY},
                        email VARCHAR(255) UNIQUE NOT NULL,
                        password_hash VARCHAR(255) NOT NULL,
                        ${TABLE.CREATED_AT},
                        ${TABLE.UPDATED_AT}
                      );`;

export const UserModel = z.object({
  id: zId,
  email: z.email(),
  passwordHash: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserAttributes = z.infer<typeof UserModel>;

export const User = new DbModel<typeof UserModel>(UserSqlSchema, UserModel, {
  tableName: "users",
});
