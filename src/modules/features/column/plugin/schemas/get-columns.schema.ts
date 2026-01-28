import {
  GlobalResponseSchema,
  GlobalSchema,
} from "@shared/schemas/global.schema";
import { z } from "zod";
import { ColumnModel } from "../../column.model";

export const GetColumnsQuerySchema = z.object({
  page: GlobalSchema.shape.page,
});

export type GetColumnsQuery = z.infer<typeof GetColumnsQuerySchema>;

export const GetColumnsParamsSchema = ColumnModel.pick({ boardId: true });

export type GetColumnsParams = z.infer<typeof GetColumnsParamsSchema>;

export const GetColumnsResponseSchema = GlobalResponseSchema({
  columns: z.array(ColumnModel),
});

export type GetColumnsResponse = z.infer<typeof GetColumnsResponseSchema>;
