import { z } from "zod";
import { CardModel } from "../../card.model";

export const DeleteCardParamsSchema = CardModel.pick({
  id: true,
  boardId: true,
  columnId: true,
});

export type DeleteCardParams = z.infer<typeof DeleteCardParamsSchema>;
