import { FastifyReply, FastifyRequest } from "fastify";
import {
  GetColumnsParams,
  GetColumnsQuery,
  GetColumnsResponse,
} from "./schemas/get-columns.schema";
import { ColumnService } from "../column.service";
import {
  CreateColumnBody,
  CreateColumnParams,
  CreateColumnResponse,
} from "./schemas/create-column.schema";
import {
  UpdateColumnBody,
  UpdateColumnParams,
  UpdateColumnResponse,
} from "./schemas/update-column.schema";
import { DeleteColumnParams } from "./schemas/delete-column.schema";
import io from "@/io";

export class ColumnHandler {
  static getColumns = async (
    req: FastifyRequest<{
      Querystring: GetColumnsQuery;
      Params: GetColumnsParams;
    }>,
    reply: FastifyReply,
  ): Promise<GetColumnsResponse> => {
    const p = req.params,
      q = req.query;

    const columns = await ColumnService.getByBoardId(p.boardId, q.page);

    reply.status(200);
    return { message: "Columns fetched.", data: { columns } };
  };

  static createColumn = async (
    req: FastifyRequest<{ Body: CreateColumnBody; Params: CreateColumnParams }>,
    reply: FastifyReply,
  ): Promise<CreateColumnResponse> => {
    const b = req.body,
      p = req.params;

    const column = await ColumnService.create(b.name, p.boardId);
    io.to(`board:${column.boardId}`).emit("column.create", column);

    reply.status(201);
    return { message: "Column created.", data: { column } };
  };

  static updateColumn = async (
    req: FastifyRequest<{ Body: UpdateColumnBody; Params: UpdateColumnParams }>,
    reply: FastifyReply,
  ): Promise<UpdateColumnResponse> => {
    const b = req.body,
      p = req.params;

    const column = await ColumnService.updateById(b, p.id, p.boardId);
    io.to(`board:${column.boardId}`).emit("column.update", column);

    reply.status(200);
    return { message: "Column updated.", data: { column } };
  };

  static deleteColumn = async (
    req: FastifyRequest<{ Params: DeleteColumnParams }>,
    reply: FastifyReply,
  ) => {
    const p = req.params;

    const column = await ColumnService.deleteById(p.id, p.boardId);
    io.to(`board:${column.boardId}`).emit("column.delete", column);

    reply.status(204);
    return;
  };
}
