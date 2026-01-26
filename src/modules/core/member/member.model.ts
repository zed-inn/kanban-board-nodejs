import { UserModel } from "@modules/core/user/user.model";
import { z } from "zod";
import { BoardModel } from "../board/board.model";
import { DbModel } from "@shared/services/model.service";
import { TABLE } from "@shared/utils/db-table-fields";

const MemberSqlSchema = `CREATE TABLE IF NOT EXISTS members (
                          member_id UUID NOT NULL,
                          board_id UUID NOT NULL,
                          ${TABLE.CREATED_AT},
                          UNIQUE(member_id, board_id),
                          ${TABLE.FOREIGN_KEY("member_id", "users", "id")},
                          ${TABLE.FOREIGN_KEY("board_id", "boards", "id")}
                        );`;

export const MemberModel = z.object({
  memberId: UserModel.shape.id,
  boardId: BoardModel.shape.id,
  createdAt: z.date(),
});

export type MemberAttributes = z.infer<typeof MemberModel>;

export const Member = new DbModel<typeof MemberModel>(
  MemberSqlSchema,
  MemberModel,
  { tableName: "members" },
);
