import { FastifyReply, FastifyRequest } from "fastify";
import { GetBoardsQuery, GetBoardsResponse } from "./schemas/get-boards.schema";
import { BoardService } from "../board.service";
import { AuthPayloadSchema } from "@shared/schemas/auth.schema";
import {
  CreateBoardBody,
  CreateBodyResponse,
} from "./schemas/create-board.schema";
import {
  UpdateBoardParams,
  UpdateBoardQuery,
  UpdateBoardResponse,
} from "./schemas/update-board.schema";
import { DeleteBoardParams } from "./schemas/delete-board.schema";

export class BoardHandler {
  static getBoards = async (
    req: FastifyRequest<{ Querystring: GetBoardsQuery }>,
    reply: FastifyReply,
  ): Promise<GetBoardsResponse> => {
    const q = req.query;
    const user = AuthPayloadSchema.parse(req.user);

    const boards = await BoardService.getByUserId(user.id, q.page);

    reply.status(200);
    return { message: "Boards fetched.", data: { boards } };
  };

  static createBoard = async (
    req: FastifyRequest<{ Body: CreateBoardBody }>,
    reply: FastifyReply,
  ): Promise<CreateBodyResponse> => {
    const b = req.body;
    const user = AuthPayloadSchema.parse(req.user);

    const board = await BoardService.create(b.name, user.id);

    reply.status(201);
    return { message: "Board created.", data: { board } };
  };

  static updateBoard = async (
    req: FastifyRequest<{
      Querystring: UpdateBoardQuery;
      Params: UpdateBoardParams;
    }>,
    reply: FastifyReply,
  ): Promise<UpdateBoardResponse> => {
    const p = req.params,
      q = req.query;
    const user = AuthPayloadSchema.parse(req.user);

    const board = await BoardService.updateById(q.name, p.id, user.id);

    reply.status(200);
    return { message: "Board updated.", data: { board } };
  };

  static deleteBoard = async (
    req: FastifyRequest<{ Params: DeleteBoardParams }>,
    reply: FastifyReply,
  ) => {
    const p = req.params;
    const user = AuthPayloadSchema.parse(req.user);

    await BoardService.deleteById(p.id, user.id);

    reply.status(204);
    return;
  };
}
