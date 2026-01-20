import { createOffsetFn } from "@shared/utils/create-offset-fn";
import { UserBoard } from "./user-board.table";
import { PER_PAGE } from "@config/constants/items-per-page";

export class UserBoardService {
  protected static offset = createOffsetFn(PER_PAGE.BOARDS);

  static getSingle = async (boardId: string, userId: string) => {
    const _userBoard = await UserBoard.query(
      "SELECT * FROM users_boards_junction WHERE board_id = $1 AND user_id = $2;",
      [boardId, userId],
    );
    return _userBoard.rows.at(0) ?? null;
  };

  static create = async (boardId: string, userId: string) => {
    const _userBoard = await UserBoard.query(
      "INSERT INTO users_boards_junction(board_id, user_id) VALUES($1, $2) RETURNING *;",
      [boardId, userId],
    );
    return _userBoard.rows.at(0) ?? null;
  };

  static delete = async (boardId: string, userId: string) => {
    const _userBoard = await UserBoard.query(
      "DELETE FROM users_boards_junction WHERE board_id = $1 AND user_id = $2 RETURNING *;",
      [boardId, userId],
    );
    return _userBoard.rows.at(0) ?? null;
  };
}
