import { z } from "zod";
import { ColumnModel } from "../../column.model";
import { GlobalResponseSchema } from "@shared/schemas/global.schema";

export const CreateColumnBodySchema = ColumnModel.pick({ name: true });

export type CreateColumnBody = z.infer<typeof CreateColumnBodySchema>;

export const CreateColumnParamsSchema = ColumnModel.pick({ boardId: true });

export type CreateColumnParams = z.infer<typeof CreateColumnParamsSchema>;

export const CreateColumnResponseSchema = GlobalResponseSchema({
  column: ColumnModel,
});

export type CreateColumnResponse = z.infer<typeof CreateColumnResponseSchema>;
