import { UserModel } from "@modules/core/user/user.table";
import { z } from "zod";
import { BoardModel } from "../board/board.table";
import { DbTable } from "@shared/services/db-table.service";

const userBoardSqlSchema = `CREATE TABLE IF NOT EXISTS users_boards_junction (
                                user_id INTEGER NOT NULL,
                                board_id INTEGER NOT NULL,
                                FOREIGN KEY(user_id) REFERENCES users,
                                FOREIGN KEY(board_id) REFERENCES boards,
                                UNIQUE(user_id, board_id)
                            );`;

export const UserBoardModel = z.object({
  userId: UserModel.shape.id,
  boardId: BoardModel.shape.id,
});

export type UserBoardAttributes = z.infer<typeof UserBoardModel>;

export const UserBoard = new DbTable<UserBoardAttributes>(
  userBoardSqlSchema,
  UserBoardModel,
);
