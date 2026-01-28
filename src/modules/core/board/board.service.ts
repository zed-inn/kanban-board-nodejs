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
      "SELECT boards.* FROM boards JOIN members ON members.board_id = boards.id WHERE members.member_id = $1 ORDER BY boards.updated_at DESC OFFSET $2 LIMIT $3;",
      [userId, this.offset(page), PER_PAGE.BOARDS],
    );
    return boards;
  };

  static create = async (name: string, userId: ID) => {
    const client = await db.getClient();

    try {
      await client.beginTransaction();

      const board = await Board.ops.create({ name, userId }, { client });
      await MemberService.addMember(board.id, userId, { client });

      await client.commitTransaction();
      return board;
    } catch (error) {
      await client.rollbackTransaction();
      throw error;
    }
  };

  static updateById = async (name: string, id: ID, userId: ID) => {
    return await Board.ops.updateByFilters({ name }, { id, userId });
  };

  static deleteById = async (id: ID, userId: ID) => {
    const client = await db.getClient();

    try {
      await client.beginTransaction();

      const board = await Board.ops.deleteOne({ id, userId }, { client });
      await MemberService.exitMembership(board.id, userId);

      await client.commitTransaction();
      return board;
    } catch (error) {
      await client.rollbackTransaction();
      throw error;
    }
  };
}
