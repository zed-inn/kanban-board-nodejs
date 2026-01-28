import { ZodFastifyInstance } from "@shared/types/zod-fastify";
import { CardHandler } from "./card.handler";
import {
  GetCardsParamsSchema,
  GetCardsQuerySchema,
  GetCardsResponseSchema,
} from "./schemas/get-cards.schema";
import {
  CreateCardBodySchema,
  CreateCardParamsSchema,
  CreateCardResponseSchema,
} from "./schemas/create-card.schema";
import {
  UpdateCardBodySchema,
  UpdateCardParamsSchema,
  UpdateCardResponseSchema,
} from "./schemas/update-card.schema";
import { DeleteCardParamsSchema } from "./schemas/delete-card.schema";
import { RestrictTo } from "@shared/hooks/restrict-to";

export const CardRouter = async (router: ZodFastifyInstance) => {
  router.get(
    "/",
    {
      schema: {
        querystring: GetCardsQuerySchema,
        params: GetCardsParamsSchema,
        response: { 200: GetCardsResponseSchema },
      },
      preHandler: [
        RestrictTo.loggedInUser,
        RestrictTo.memberOfBoard("boardId"),
      ],
    },
    CardHandler.getCards,
  );

  router.post(
    "/",
    {
      schema: {
        body: CreateCardBodySchema,
        params: CreateCardParamsSchema,
        response: { 201: CreateCardResponseSchema },
      },
      preHandler: [
        RestrictTo.loggedInUser,
        RestrictTo.memberOfBoard("boardId"),
      ],
    },
    CardHandler.createCard,
  );

  router.patch(
    "/:id",
    {
      schema: {
        body: UpdateCardBodySchema,
        params: UpdateCardParamsSchema,
        response: { 200: UpdateCardResponseSchema },
      },
      preHandler: [
        RestrictTo.loggedInUser,
        RestrictTo.memberOfBoard("boardId"),
      ],
    },
    CardHandler.updateCard,
  );

  router.delete(
    "/:id",
    {
      schema: { params: DeleteCardParamsSchema },
      preHandler: [
        RestrictTo.loggedInUser,
        RestrictTo.memberOfBoard("boardId"),
      ],
    },
    CardHandler.deleteCard,
  );
};
