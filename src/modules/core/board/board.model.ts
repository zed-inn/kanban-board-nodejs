import { z } from "zod";
import { UserModel } from "../user/user.model";
import { zId } from "@config/constants/db-schema";
import { DbModel } from "@shared/services/model.service";
import { TABLE } from "@shared/utils/db-table-fields";

const boardSqlSchema = `CREATE TABLE IF NOT EXISTS boards (
                          ${TABLE.ID_PRIM_KEY},
                          user_id UUID NOT NULL,
                          name VARCHAR(255) NOT NULL,
                          ${TABLE.CREATED_AT},
                          ${TABLE.UPDATED_AT},
                          ${TABLE.FOREIGN_KEY("user_id", "users", "id")} ${TABLE.ON_DELETE.CASCADE}
                        );`;

export const BoardModel = z.object({
  id: zId,
  userId: UserModel.shape.id,
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BoardAttributes = z.infer<typeof BoardModel>;

export const Board = new DbModel<typeof BoardModel>(
  boardSqlSchema,
  BoardModel,
  { tableName: "boards" },
);
