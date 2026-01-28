import { z } from "zod";
import { GlobalResponseSchema } from "@shared/schemas/global.schema";
import { CardModel } from "../../card.model";

export const CreateCardBodySchema = CardModel.pick({ title: true, body: true });

export type CreateCardBody = z.infer<typeof CreateCardBodySchema>;

export const CreateCardParamsSchema = CardModel.pick({
  boardId: true,
  columnId: true,
});

export type CreateCardParams = z.infer<typeof CreateCardParamsSchema>;

export const CreateCardResponseSchema = GlobalResponseSchema({
  card: CardModel,
});

export type CreateCardResponse = z.infer<typeof CreateCardResponseSchema>;
