import {
  GlobalResponseSchema,
  GlobalSchema,
} from "@shared/schemas/global.schema";
import { z } from "zod";
import { CardModel } from "../../card.model";

export const GetCardsQuerySchema = z.object({ page: GlobalSchema.shape.page });

export type GetCardsQuery = z.infer<typeof GetCardsQuerySchema>;

export const GetCardsParamsSchema = CardModel.pick({
  boardId: true,
  columnId: true,
});

export type GetCardsParams = z.infer<typeof GetCardsParamsSchema>;

export const GetCardsResponseSchema = GlobalResponseSchema({
  cards: z.array(CardModel),
});

export type GetCardsResponse = z.infer<typeof GetCardsResponseSchema>;
