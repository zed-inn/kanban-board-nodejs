import { ID } from "@config/constants/db-schema";
import { PER_PAGE } from "@config/constants/items-per-page";
import { createOffsetFn } from "@shared/utils/create-offset-fn";
import { Card } from "./card.model";
import { DatabaseConnServiceOptions } from "@shared/types/database-conn";
import { CardUpdateDbSchema, CardUpdateDto } from "./dtos/card-service.dto";
import db from "@config/db";
import { getMid } from "@shared/utils/get-mid";
import { CARD } from "./card.constants";

export class CardService {
  protected static offset = createOffsetFn(PER_PAGE.CARDS);

  static getByColumnId = async (columnId: ID, boardId: ID, page: number) => {
    const cards = await Card.query(
      "SELECT * FROM cards WHERE column_id = $1 AND board_id = $2 OFFSET $3 LIMIT $4 ORDER BY position ASC;",
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
      `SELECT * FROM cards WHERE position ${side ? (side === "AFTER" ? ">" : "<") : "="} $1 AND column_id = $2 LIMIT 1 ORDER BY position ASC`,
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
        "SELECT * FROM cards WHERE column_id = $1 AND board_id = $2 LIMIT 1 ORDER BY position DESC;",
        [columnId, boardId],
      );
      const lastCol = _lastCol[0] ?? null;
      const lastPosition = lastCol?.position ?? 0;

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
    }

    return null;
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
        const [_c1, _c2] = await Promise.all([
          Card.ops.getById(id, { client }),
          Card.ops.getById(data.inPlaceOf, { client }),
        ]);
        if (!_c1 || !_c2) throw new Error("Invalid Id/s");

        const isLeft = _c1.position < _c2.position;
        const lr = {
          left: isLeft
            ? await this.getByPostitionInColumn(
                _c2.position,
                _c2.columnId,
                "AFTER",
                {
                  client,
                },
              )
            : _c2,
          right: isLeft
            ? _c2
            : await this.getByPostitionInColumn(
                _c2.position,
                _c2.columnId,
                "BEFORE",
                {
                  client,
                },
              ),
        };
        const newPos = getMid(
          lr.left?.position ?? null,
          lr.right?.position ?? null,
        );
        _data.columnId = _c2.columnId;
        _data.position = newPos;
      }

      const values = CardUpdateDbSchema.parse(_data);
      if (!values) throw new Error("No values to update.");
      const column = await Card.ops.updateByFilters(
        values as any,
        { id, columnId, boardId },
        { client },
      );
      if (!column) throw new Error("Card couldn't be updated.");

      await client.commitTransaction();

      return column;
    } catch (error) {
      await client.rollbackTransaction();
    }

    return null;
  };

  deleteById = async (id: ID, columnId: ID, boardId: ID) => {
    const card = await Card.query(
      "DELETE FROM cards WHERE id = $1 AND column_id = $2 AND board_id = $3 RETURNING *;",
      [id, columnId, boardId],
    );
    return card[0] ?? null;
  };
}
