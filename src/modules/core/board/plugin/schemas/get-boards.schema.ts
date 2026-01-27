import {
  GlobalResponseSchema,
  GlobalSchema,
} from "@shared/schemas/global.schema";
import { z } from "zod";
import { BoardModel } from "../../board.model";

export const GetBoardsQuerySchema = z.object({ page: GlobalSchema.shape.page });

export type GetBoardsQuery = z.infer<typeof GetBoardsQuerySchema>;

export const GetBoardsResponseSchema = GlobalResponseSchema({
  boards: z.array(BoardModel),
});

export type GetBoardsResponse = z.infer<typeof GetBoardsResponseSchema>;
