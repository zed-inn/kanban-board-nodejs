import { zId } from "@config/constants/db-schema";
import { BoardModel } from "@modules/core/board/board.model";

import { DbModel } from "@shared/services/model.service";
import { TABLE } from "@shared/utils/db-table-fields";
import { z } from "zod";

const columnSqlSchema = `CREATE TABLE IF NOT EXISTS columns (
                          ${TABLE.ID_PRIM_KEY},
                          board_id UUID NOT NULL,
                          name VARCHAR(255) NOT NULL,
                          position NUMERIC UNIQUE NOT NULL DEFAULT 0,
                          ${TABLE.CREATED_AT},
                          ${TABLE.UPDATED_AT},
                          ${TABLE.FOREIGN_KEY("board_id", "boards", "id")} ${TABLE.ON_DELETE.CASCADE}
                        );`;

export const ColumnModel = z.object({
  id: zId,
  boardId: BoardModel.shape.id,
  name: z.string(),
  position: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ColumnAttributes = z.infer<typeof ColumnModel>;

export const Column = new DbModel<typeof ColumnModel>(
  columnSqlSchema,
  ColumnModel,
  { tableName: "columns" },
);
