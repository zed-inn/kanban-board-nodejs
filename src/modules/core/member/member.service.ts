import { DatabaseConnServiceOptions } from "@shared/types/database-conn";
import { Member } from "./member.model";
import { ID } from "@config/constants/db-schema";
import { AppError } from "@shared/utils/app-error";

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
    const _member = await Member.query(
      "DELETE FROM members WHERE board_id = $1 AND member_id = $2 RETURNING *;",
      [boarId, memberId],
      options,
    );
    const member = _member[0];
    if (!member) throw new AppError("Membership couldn't be ended.", 500);
    return member;
  };
}
