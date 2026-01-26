import { DatabaseConnServiceOptions } from "@shared/types/database-conn";
import { Member } from "./member.model";
import { ID } from "@config/constants/db-schema";

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
    boarId: ID,
    memberId: ID,
    options: DatabaseConnServiceOptions = {},
  ) => {
    const member = await Member.query(
      "DELETE FROM members WHERE board_id = $1 AND member_id = $2 RETURNING *;",
      [boarId, memberId],
      options,
    );
    return member[0] ?? null;
  };
}
