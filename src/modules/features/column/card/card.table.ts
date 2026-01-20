import { BoardModel } from "@modules/core/board/board.table";
import { z } from "zod";
import { ColumnModel } from "../column.table";
import { DbTable } from "@shared/services/db-table.service";

const cardSqlSchema = `CREATE TABLE IF NOT EXISTS cards (
                            id SERIAL NOT NULL,
                            board_id INTEGER NOT NULL,
                            column_id INTEGER NOT NULL,
                            title TEXT NOT NULL,
                            body TEXT DEFAULT null,
                            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                            PRIMARY KEY(id),
                            FOREIGN KEY(board_id) REFERENCES boards,
                            FOREIGN KEY(column_id) REFERENCES columns
                        );`;

export const CardModel = z.object({
  id: z.int().positive(),
  boardId: BoardModel.shape.id,
  columnId: ColumnModel.shape.id,
  title: z.string(),
  body: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CardAttributes = z.infer<typeof CardModel>;

export const Card = new DbTable<CardAttributes>(cardSqlSchema, CardModel);
