import { z } from "zod";
import { ColumnModel } from "../../column.model";
import { GlobalResponseSchema } from "@shared/schemas/global.schema";

export const UpdateColumnBodySchema = z
  .object({
    name: ColumnModel.shape.name,
    inPlaceOf: ColumnModel.shape.id,
  })
  .partial();

export type UpdateColumnBody = z.infer<typeof UpdateColumnBodySchema>;

export const UpdateColumnParamsSchema = ColumnModel.pick({
  id: true,
  boardId: true,
});

export type UpdateColumnParams = z.infer<typeof UpdateColumnParamsSchema>;

export const UpdateColumnResponseSchema = GlobalResponseSchema({
  column: ColumnModel,
});

export type UpdateColumnResponse = z.infer<typeof UpdateColumnResponseSchema>;
