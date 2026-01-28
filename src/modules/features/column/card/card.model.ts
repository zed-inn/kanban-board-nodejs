import { BoardModel } from "@modules/core/board/board.model";
import { z } from "zod";
import { ColumnModel } from "../column.model";
import { DbModel } from "@shared/services/model.service";
import { TABLE } from "@shared/utils/db-table-fields";

const cardSqlSchema = `CREATE TABLE IF NOT EXISTS cards (
                        ${TABLE.ID_PRIM_KEY},
                        board_id UUID NOT NULL,
                        column_id UUID NOT NULL,
                        title TEXT NOT NULL,
                        body TEXT DEFAULT null,
                        position NUMERIC UNIQUE NOT NULL DEFAULT 0,
                        ${TABLE.CREATED_AT},
                        ${TABLE.UPDATED_AT},
                        UNIQUE(column_id, position) DEFERRABLE INITIALLY DEFERRED,
                        ${TABLE.FOREIGN_KEY("board_id", "boards", "id")} ${TABLE.ON_DELETE.CASCADE},
                        ${TABLE.FOREIGN_KEY("column_id", "columns", "id")} ${TABLE.ON_DELETE.CASCADE}
                      );`;

export const CardModel = z.object({
  id: z.uuidv7(),
  boardId: BoardModel.shape.id,
  columnId: ColumnModel.shape.id,
  title: z.string(),
  body: z.string().nullable(),
  position: z.coerce.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CardAttributes = z.infer<typeof CardModel>;

export const Card = new DbModel<typeof CardModel>(cardSqlSchema, CardModel, {
  tableName: "cards",
});
