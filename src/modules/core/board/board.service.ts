import db from "@config/db";
import { Board } from "./board.model";
import { createOffsetFn } from "@shared/utils/create-offset-fn";
import { PER_PAGE } from "@config/constants/items-per-page";
import { MemberService } from "../member/member.service";
import { ID } from "@config/constants/db-schema";

export class BoardService {
  private static offset = createOffsetFn(PER_PAGE.BOARDS);

  static getByUserId = async (userId: ID, page: number) => {
    const boards = await Board.query(
      "SELECT boards.* FROM boards JOIN members ON members.board_id = boards.id WHERE members.member_id = $1 OFFSET $2 LIMIT $3 ORDER BY boards.updated_at DESC;",
      [userId, this.offset(page), PER_PAGE.BOARDS],
    );
    return boards;
  };

  static create = async (name: string, userId: ID) => {
    const client = await db.getClient();

    try {
      await client.beginTransaction();

      const board = await Board.ops.create({ name, userId }, { client });
      if (!board) throw new Error("Board couldn't be created.");

      const member = await MemberService.addMember(board.id, userId, {
        client,
      });
      if (!member) throw new Error("Board couldn't be created.");

      await client.commitTransaction();

      return board;
    } catch (error) {
      await client.rollbackTransaction();
    }

    return null;
  };

  static updateById = async (name: string, id: ID, userId: ID) => {
    return await Board.ops.updateByFilters({ name }, { id, userId });
  };

  static deleteById = async (id: ID, userId: ID) => {
    const client = await db.getClient();

    try {
      await client.beginTransaction();

      const _board = await Board.query(
        "DELETE FROM boards WHERE id = $1 AND user_id = $2 RETURNING *;",
        [id, userId],
        { client },
      );
      const board = _board[0] ?? null;
      if (!board) throw new Error("Board couldn't be deleted.");

      const member = await MemberService.exitMembership(board.id, userId);
      if (!member) throw new Error("Board couldn't be deleted.");

      await client.commitTransaction();

      return board;
    } catch (error) {
      await client.rollbackTransaction();
    }

    return null;
  };
}
