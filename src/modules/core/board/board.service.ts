import db from "@config/db";
import { Board, BoardAttributes } from "./board.table";

export class BoardService {
  static getById = async (id: string) => {
    const _board = await Board.query("SELECT * FROM boards WHERE id = $1;", [
      id,
    ]);
    return _board.rows.at(0) ?? null;
  };

  static create = async (name: string, userId: string) => {
    const client = await db.getClient();

    try {
      await client.query("BEGIN;");

      const _board = await client.query(
        "INSERT INTO boards(name, user_id) VALUES($1, $2) RETURNING *;",
        [name, userId],
      );
      const board = (_board.rows as BoardAttributes[]).at(0) ?? null;
      if (!board) throw new Error("Board creation failed.");

      const _userBoard = await client.query(
        "INSERT INTO users_boards_junction(user_id, board_id) VALUES($1, $2) RETURNING *;",
        [userId, board.id],
      );
      const userBoard = _userBoard.rows.at(0) ?? null;
      if (!userBoard) throw new Error("Board creation failed.");

      await client.query("COMMIT;");
      return board;
    } catch (err) {
      console.log(err);
      await client.query("ROLLBACK;");
    } finally {
      client.release();
    }

    return null;
  };

  static updateNameById = async (id: string, name: string, userId: string) => {
    const _board = await Board.query(
      "UPDATE boards SET name = $1, updated_at = NOW() WHERE id = $2 AND userId = $3 RETURNING *;",
      [name, id, userId],
    );
    return _board.rows.at(0) ?? null;
  };

  static deleteById = async (id: string, userId: string) => {
    const _board = await Board.query(
      "DELETE FROM boards WHERE id = $1 AND userId = $2 RETURNING *;",
      [id, userId],
    );
    return _board.rows.at(0) ?? null;
  };
}
