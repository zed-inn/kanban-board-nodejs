import { ZodFastifyInstance } from "@shared/types/zod-fastify";
import {
  GetBoardsQuerySchema,
  GetBoardsResponseSchema,
} from "./schemas/get-boards.schema";
import { BoardHandler } from "./board.handler";
import { DeleteBoardParamsSchema } from "./schemas/delete-board.schema";
import {
  UpdateBoardBodySchema,
  UpdateBoardParamsSchema,
  UpdateBoardResponseSchema,
} from "./schemas/update-board.schema";
import {
  CreateBoardBodySchema,
  CreateBodyResponseSchema,
} from "./schemas/create-board.schema";
import { RestrictTo } from "@shared/hooks/restrict-to";

export const BoardRouter = async (router: ZodFastifyInstance) => {
  router.get(
    "/",
    {
      schema: {
        querystring: GetBoardsQuerySchema,
        response: { 200: GetBoardsResponseSchema },
      },
      preHandler: [RestrictTo.loggedInUser],
    },
    BoardHandler.getBoards,
  );

  router.post(
    "/",
    {
      schema: {
        body: CreateBoardBodySchema,
        response: { 201: CreateBodyResponseSchema },
      },
      preHandler: [RestrictTo.loggedInUser],
    },
    BoardHandler.createBoard,
  );

  router.patch(
    "/:id",
    {
      schema: {
        body: UpdateBoardBodySchema,
        params: UpdateBoardParamsSchema,
        response: { 200: UpdateBoardResponseSchema },
      },
      preHandler: [RestrictTo.loggedInUser, RestrictTo.memberOfBoard("id")],
    },
    BoardHandler.updateBoard,
  );

  router.delete(
    "/:id",
    {
      schema: { params: DeleteBoardParamsSchema },
      preHandler: [RestrictTo.loggedInUser, RestrictTo.memberOfBoard("id")],
    },
    BoardHandler.deleteBoard,
  );
};
