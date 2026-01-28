import { z } from "zod";
import { ColumnModel } from "../../column.model";

export const DeleteColumnParamsSchema = ColumnModel.pick({
  id: true,
  boardId: true,
});

export type DeleteColumnParams = z.infer<typeof DeleteColumnParamsSchema>;
