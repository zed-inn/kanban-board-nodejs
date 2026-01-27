import { z } from "zod";
import { BoardModel } from "../../board.model";
import { GlobalResponseSchema } from "@shared/schemas/global.schema";

export const UpdateBoardQuerySchema = BoardModel.pick({ name: true });

export type UpdateBoardQuery = z.infer<typeof UpdateBoardQuerySchema>;

export const UpdateBoardParamsSchema = BoardModel.pick({ id: true });

export type UpdateBoardParams = z.infer<typeof UpdateBoardParamsSchema>;

export const UpdateBoardResponseSchema = GlobalResponseSchema({
  board: BoardModel,
});

export type UpdateBoardResponse = z.infer<typeof UpdateBoardResponseSchema>;
