import { DbTable } from "@shared/services/db-table.service";
import { z } from "zod";
import { UserModel } from "../user/user.table";

const boardSqlSchema = `CREATE TABLE IF NOT EXISTS boards (
                            id SERIAL NOT NULL,
                            user_id INTEGER NOT NULL,
                            name VARCHAR(255) NOT NULL,
                            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                            PRIMARY KEY(id),
                            UNIQUE(id)
                        );`;

export const BoardModel = z.object({
  id: z.int().positive(),
  userId: UserModel.shape.id,
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BoardAttributes = z.infer<typeof BoardModel>;

export const Board = new DbTable<BoardAttributes>(boardSqlSchema, BoardModel);
