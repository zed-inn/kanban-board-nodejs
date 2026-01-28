import { FastifyReply, FastifyRequest } from "fastify";
import {
  GetCardsParams,
  GetCardsQuery,
  GetCardsResponse,
} from "./schemas/get-cards.schema";
import { CardService } from "../card.service";
import {
  CreateCardBody,
  CreateCardParams,
  CreateCardResponse,
} from "./schemas/create-card.schema";
import {
  UpdateCardBody,
  UpdateCardParams,
  UpdateCardResponse,
} from "./schemas/update-card.schema";
import { DeleteCardParams } from "./schemas/delete-card.schema";

export class CardHandler {
  static getCards = async (
    req: FastifyRequest<{ Querystring: GetCardsQuery; Params: GetCardsParams }>,
    reply: FastifyReply,
  ): Promise<GetCardsResponse> => {
    const q = req.query,
      p = req.params;

    const cards = await CardService.getByColumnId(
      p.columnId,
      p.boardId,
      q.page,
    );

    reply.status(200);
    return { message: "Cards fetched.", data: { cards } };
  };

  static createCard = async (
    req: FastifyRequest<{ Body: CreateCardBody; Params: CreateCardParams }>,
    reply: FastifyReply,
  ): Promise<CreateCardResponse> => {
    const b = req.body,
      p = req.params;

    const card = await CardService.create(
      b.title,
      b.body,
      p.columnId,
      p.boardId,
    );

    reply.status(201);
    return { message: "Card created.", data: { card } };
  };

  static updateCard = async (
    req: FastifyRequest<{ Body: UpdateCardBody; Params: UpdateCardParams }>,
    reply: FastifyReply,
  ): Promise<UpdateCardResponse> => {
    const b = req.body,
      p = req.params;

    const card = await CardService.updateById(b, p.id, p.columnId, p.boardId);

    reply.status(200);
    return { message: "Card updated.", data: { card } };
  };

  static deleteCard = async (
    req: FastifyRequest<{ Params: DeleteCardParams }>,
    reply: FastifyReply,
  ) => {
    const p = req.params;

    const card = await CardService.deleteById(p.id, p.columnId, p.boardId);

    reply.status(204);
    return;
  };
}
