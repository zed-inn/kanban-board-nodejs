import { ID } from "@config/constants/db-schema";
import { PER_PAGE } from "@config/constants/items-per-page";
import { createOffsetFn } from "@shared/utils/create-offset-fn";
import { Card } from "./card.model";
import { DatabaseConnServiceOptions } from "@shared/types/database-conn";
import { CardUpdateDbSchema, CardUpdateDto } from "./dtos/card-service.dto";
import db from "@config/db";
import { getMid } from "@shared/utils/get-mid";
import { CARD } from "./card.constants";
import { AppError } from "@shared/utils/app-error";

export class CardService {
  protected static offset = createOffsetFn(PER_PAGE.CARDS);

  static getByColumnId = async (columnId: ID, boardId: ID, page: number) => {
    const cards = await Card.query(
      "SELECT * FROM cards WHERE column_id = $1 AND board_id = $2 ORDER BY position ASC OFFSET $3 LIMIT $4;",
      [columnId, boardId, this.offset(page), PER_PAGE.CARDS],
    );
    return cards;
  };

  static getByPostitionInColumn = async (
    pos: number,
    columnId: ID,
    side: "AFTER" | "BEFORE" | null,
    options: DatabaseConnServiceOptions = {},
  ) => {
    const card = await Card.query(
      `SELECT * FROM cards WHERE position ${side ? (side === "AFTER" ? ">" : "<") : "="} $1 AND column_id = $2 ORDER BY position ASC LIMIT 1;`,
      [pos, columnId],
      options,
    );
    return card[0] ?? null;
  };

  static create = async (
    title: string,
    body: string | null,
    columnId: ID,
    boardId: ID,
  ) => {
    const client = await db.getClient();

    try {
      await client.beginTransaction();

      const _lastCol = await Card.query(
        "SELECT * FROM cards WHERE column_id = $1 AND board_id = $2 ORDER BY position DESC LIMIT 1;",
        [columnId, boardId],
      );
      const lastCol = _lastCol[0] ?? null;
      const lastPosition = lastCol?.position ?? -1 * CARD.POSITION.SPARSED_BY;

      const column = await Card.ops.create({
        title,
        body,
        columnId,
        boardId,
        position: lastPosition + CARD.POSITION.SPARSED_BY,
      });

      await client.commitTransaction();

      return column;
    } catch (error) {
      await client.rollbackTransaction();
      throw error;
    }
  };

  static updateById = async (
    data: CardUpdateDto,
    id: ID,
    columnId: ID,
    boardId: ID,
  ) => {
    const client = await db.getClient();

    try {
      await client.beginTransaction();

      let _data: Record<string, unknown> = { ...data };
      if (data.inPlaceOf && data.inPlaceOf !== id) {
        const newLocation = await this.getNewPosition(id, data.inPlaceOf, {
          client,
        });
        _data.columnId = newLocation.columnId;
        _data.position = newLocation.postion;
      }

      const values = CardUpdateDbSchema.parse(_data);
      if (!values) throw new Error("No values to update.");
      const column = await Card.ops.updateByFilters(
        values as any,
        { id, columnId, boardId },
        { client },
      );

      await client.commitTransaction();
      return column;
    } catch (error) {
      await client.rollbackTransaction();
      throw error;
    }
  };

  static deleteById = async (id: ID, columnId: ID, boardId: ID) => {
    return await Card.ops.deleteOne({ id, columnId, boardId });
  };

  static getNewPosition = async (
    id: ID,
    inPlaceOf: ID,
    options: DatabaseConnServiceOptions = {},
  ) => {
    const [_c1, _c2] = await Promise.all([
      Card.ops.getById(id, options),
      Card.ops.getById(inPlaceOf, options),
    ]);

    if (_c1.boardId !== _c2.boardId)
      throw new AppError("Columns must be of same board.", 400);

    const lr =
      _c1.position > _c2.position
        ? {
            left: await this.getByPostitionInColumn(
              _c2.position,
              _c2.columnId,
              "BEFORE",
              options,
            ),
            right: _c2,
          }
        : {
            left: _c2,
            right: await this.getByPostitionInColumn(
              _c2.position,
              _c2.columnId,
              "AFTER",
              options,
            ),
          };

    const newPos = getMid(
      lr.left?.position ?? _c2.position - 2 * CARD.POSITION.SPARSED_BY,
      lr.right?.position ?? _c2.position + 2 * CARD.POSITION.SPARSED_BY,
    );

    return { postion: newPos, columnId: _c2.columnId };
  };
}
