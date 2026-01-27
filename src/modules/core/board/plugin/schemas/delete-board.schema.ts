import { z } from "zod";
import { BoardModel } from "../../board.model";

export const DeleteBoardParamsSchema = BoardModel.pick({ id: true });

export type DeleteBoardParams = z.infer<typeof DeleteBoardParamsSchema>;
