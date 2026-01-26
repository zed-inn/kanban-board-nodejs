import { z } from "zod";
import { CardModel } from "../card.model";

export const CardUpdateSchema = CardModel.pick({ title: true, body: true })
  .extend({ inPlaceOf: CardModel.shape.id })
  .partial();

export type CardUpdateDto = z.infer<typeof CardUpdateSchema>;

export const CardUpdateDbSchema = CardModel.pick({
  title: true,
  body: true,
  columnId: true,
  position: true,
}).partial();

export type CardUpdateDbDto = z.infer<typeof CardUpdateDbSchema>;
