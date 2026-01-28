import { DatabaseConnServiceOptions } from "@shared/types/database-conn";
import { Member } from "./member.model";
import { ID } from "@config/constants/db-schema";
import { AppError } from "@shared/utils/app-error";
import db from "@config/db";
import { Board } from "../board";

export class MemberService {
  static isMember = async (
    boardId: ID,
    memberId: ID,
    options: DatabaseConnServiceOptions = {},
  ) => {
    const member = await Member.query(
      "SELECT * FROM members WHERE member_id = $1 AND board_id = $2;",
      [memberId, boardId],
      options,
    );
    return member[0] ? true : false;
  };

  static addMember = async (
    boardId: ID,
    memberId: ID,
    options: DatabaseConnServiceOptions = {},
  ) => {
    return await Member.ops.create({ memberId, boardId }, options);
  };

  static exitMembership = async (
    boardId: ID,
    memberId: ID,
    options: DatabaseConnServiceOptions = {},
  ) => {
    const client = await db.getClient();

    try {
      await client.beginTransaction();

      const board = await Board.ops.getById(boardId, { client });
      if (board.userId === memberId)
        throw new AppError(
          "Membership couldn't be removed, you should delete the board itself.",
          406,
        );

      const _member = await Member.query(
        "DELETE FROM members WHERE board_id = $1 AND member_id = $2 RETURNING *;",
        [boardId, memberId],
        options,
      );
      const member = _member[0];
      if (!member) throw new AppError("Membership couldn't be ended.", 500);

      await client.commitTransaction();
      return member;
    } catch (error) {
      await client.rollbackTransaction();
      throw error;
    }
  };
}
