import { PER_PAGE } from "@config/constants/items-per-page";
import { createOffsetFn } from "@shared/utils/create-offset-fn";
import { Column } from "./column.model";
import db from "@config/db";
import {
  ColumnUpdateDbSchema,
  ColumnUpdateDto,
} from "./dtos/column-service.dto";
import { DatabaseConnServiceOptions } from "@shared/types/database-conn";
import { getMid } from "@shared/utils/get-mid";
import { ID } from "@config/constants/db-schema";
import { COLUMN } from "./column.constants";

export class ColumnService {
  protected static offset = createOffsetFn(PER_PAGE.COLUMNS);

  static getByBoardId = async (boardId: ID, page: number) => {
    const columns = await Column.query(
      "SELECT * FROM columns WHERE board_id = $1 OFFSET $2 LIMIT $3 ORDER BY position ASC;",
      [boardId, this.offset(page), PER_PAGE.COLUMNS],
    );
    return columns;
  };

  static getByPostition = async (
    pos: number,
    side: "AFTER" | "BEFORE" | null,
    options: DatabaseConnServiceOptions = {},
  ) => {
    const column = await Column.query(
      `SELECT * FROM columns WHERE position ${side ? (side === "AFTER" ? ">" : "<") : "="} $1 LIMIT 1 ORDER BY position ASC`,
      [pos],
      options,
    );
    return column[0] ?? null;
  };

  static create = async (name: string, boardId: ID) => {
    const client = await db.getClient();

    try {
      await client.beginTransaction();

      const _lastCol = await Column.query(
        "SELECT * FROM columns LIMIT 1 ORDER BY position DESC;",
      );
      const lastCol = _lastCol[0] ?? null;
      const lastPosition = lastCol?.position ?? 0;

      const column = await Column.ops.create({
        name,
        boardId,
        position: lastPosition + COLUMN.POSITION.SPARSED_BY,
      });

      await client.commitTransaction();

      return column;
    } catch (error) {
      await client.rollbackTransaction();
      throw error;
    }
  };

  static updateById = async (data: ColumnUpdateDto, id: ID, boardId: ID) => {
    const client = await db.getClient();

    try {
      await client.beginTransaction();

      let _data: Record<string, unknown> = { ...data };
      if (data.inPlaceOf && data.inPlaceOf !== id) {
        const [_c1, _c2] = await Promise.all([
          Column.ops.getById(id, { client }),
          Column.ops.getById(data.inPlaceOf, { client }),
        ]);

        const isLeft = _c1.position < _c2.position;
        const lr = {
          left: isLeft
            ? await this.getByPostition(_c2.position, "AFTER", { client })
            : _c2,
          right: isLeft
            ? _c2
            : await this.getByPostition(_c2.position, "BEFORE", { client }),
        };
        const newPos = getMid(
          lr.left?.position ?? null,
          lr.right?.position ?? null,
        );
        _data.position = newPos;
      }

      const values = ColumnUpdateDbSchema.parse(_data);
      if (!values) throw new Error("No values to update.");
      const column = await Column.ops.updateByFilters(
        values as any,
        { id, boardId },
        { client },
      );

      await client.commitTransaction();
      return column;
    } catch (error) {
      await client.rollbackTransaction();
      throw error;
    }
  };

  static deleteById = async (id: ID, boardId: string) => {
    return await Column.ops.deleteOne({ id, boardId });
  };
}
