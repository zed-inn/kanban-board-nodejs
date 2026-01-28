import { z } from "zod";
import { CardModel } from "../../card.model";
import { GlobalResponseSchema } from "@shared/schemas/global.schema";

export const UpdateCardBodySchema = CardModel.pick({ title: true, body: true })
  .extend({ inPlaceOf: CardModel.shape.id })
  .partial();

export type UpdateCardBody = z.infer<typeof UpdateCardBodySchema>;

export const UpdateCardParamsSchema = CardModel.pick({
  id: true,
  boardId: true,
  columnId: true,
});

export type UpdateCardParams = z.infer<typeof UpdateCardParamsSchema>;

export const UpdateCardResponseSchema = GlobalResponseSchema({
  card: CardModel,
});

export type UpdateCardResponse = z.infer<typeof UpdateCardResponseSchema>;
