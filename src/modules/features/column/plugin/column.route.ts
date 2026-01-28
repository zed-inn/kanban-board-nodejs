import { ZodFastifyInstance } from "@shared/types/zod-fastify";
import {
  GetColumnsParamsSchema,
  GetColumnsQuerySchema,
  GetColumnsResponseSchema,
} from "./schemas/get-columns.schema";
import { ColumnHandler } from "./column.handler";
import {
  CreateColumnBodySchema,
  CreateColumnParamsSchema,
  CreateColumnResponseSchema,
} from "./schemas/create-column.schema";
import {
  UpdateColumnBodySchema,
  UpdateColumnParamsSchema,
  UpdateColumnResponseSchema,
} from "./schemas/update-column.schema";
import { DeleteColumnParamsSchema } from "./schemas/delete-column.schema";
import { CardRouter } from "../card";
import { RestrictTo } from "@shared/hooks/restrict-to";

export const ColumnRouter = async (router: ZodFastifyInstance) => {
  router.register(CardRouter, { prefix: "/:columnId/cards" });

  router.get(
    "/",
    {
      schema: {
        querystring: GetColumnsQuerySchema,
        params: GetColumnsParamsSchema,
        response: { 200: GetColumnsResponseSchema },
      },
      preHandler: [
        RestrictTo.loggedInUser,
        RestrictTo.memberOfBoard("boardId"),
      ],
    },
    ColumnHandler.getColumns,
  );

  router.post(
    "/",
    {
      schema: {
        body: CreateColumnBodySchema,
        params: CreateColumnParamsSchema,
        response: { 200: CreateColumnResponseSchema },
      },
      preHandler: [
        RestrictTo.loggedInUser,
        RestrictTo.memberOfBoard("boardId"),
      ],
    },
    ColumnHandler.createColumn,
  );

  router.patch(
    "/:id",
    {
      schema: {
        body: UpdateColumnBodySchema,
        params: UpdateColumnParamsSchema,
        response: { 200: UpdateColumnResponseSchema },
      },
      preHandler: [
        RestrictTo.loggedInUser,
        RestrictTo.memberOfBoard("boardId"),
      ],
    },
    ColumnHandler.updateColumn,
  );

  router.delete(
    "/:id",
    {
      schema: { params: DeleteColumnParamsSchema },
      preHandler: [
        RestrictTo.loggedInUser,
        RestrictTo.memberOfBoard("boardId"),
      ],
    },
    ColumnHandler.deleteColumn,
  );
};
