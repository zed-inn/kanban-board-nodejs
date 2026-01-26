import { z } from "zod";
import { ColumnModel } from "../column.model";

export const ColumnUpdateSchema = ColumnModel.pick({ name: true })
  .extend({ inPlaceOf: ColumnModel.shape.id })
  .partial();

export type ColumnUpdateDto = z.infer<typeof ColumnUpdateSchema>;

export const ColumnUpdateDbSchema = ColumnModel.pick({
  name: true,
  position: true,
}).partial();

export type ColumnUpdateDbDto = z.infer<typeof ColumnUpdateDbSchema>;
