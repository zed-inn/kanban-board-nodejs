import app from "@/app";
import { MemberService } from "@modules/core/member";
import { AuthPayloadSchema } from "@shared/schemas/auth.schema";
import { SocketNextHandler } from "@shared/types/socket";
import { Event, Socket } from "socket.io";

export const isMemberOfBoard =
  (socket: Socket, events: string | string[]) =>
  async (event: Event, next: SocketNextHandler) => {
    const eventName = event[0];
    const boardId = event[1] as string;

    try {
      if (
        (Array.isArray(events) && events.includes(eventName)) ||
        events === eventName
      ) {
        const user = AuthPayloadSchema.parse(socket.data.user);

        const isMember = await MemberService.isMember(boardId, user.id);
        if (!isMember) next(new Error("You are not a member of this board."));
      }
      next();
    } catch (error) {
      app.log.error(error);
      next(new Error("Internal Server Error"));
    }
  };
