import { BoardModel } from "@modules/core/board/board.table";
import { DbTable } from "@shared/services/db-table.service";
import { z } from "zod";

const columnSqlSchema = `CREATE TABLE IF NOT EXISTS (
                            id SERIAL NOT NULL,
                            board_id INTEGER NOT NULL,
                            name VARCHAR(255) NOT NULL,
                            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                            PRIMARY KEY(id),
                            UNIQUE(id),
                            FOREIGN KEY(board_id) REFERENCES boards
                        );`;

export const ColumnModel = z.object({
  id: z.int().positive(),
  boardId: BoardModel.shape.id,
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ColumnAttributes = z.infer<typeof ColumnModel>;

export const Column = new DbTable<ColumnAttributes>(
  columnSqlSchema,
  ColumnModel,
);
