import { z } from "zod";
import { BoardModel } from "../../board.model";
import { GlobalResponseSchema } from "@shared/schemas/global.schema";

export const CreateBoardBodySchema = BoardModel.pick({ name: true });

export type CreateBoardBody = z.infer<typeof CreateBoardBodySchema>;

export const CreateBodyResponseSchema = GlobalResponseSchema({
  board: BoardModel,
});

export type CreateBodyResponse = z.infer<typeof CreateBodyResponseSchema>;
