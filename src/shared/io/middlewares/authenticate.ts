import { COOKIE } from "@config/constants/cookie";
import { AuthTokenService } from "@modules/core/auth/auth.service";
import { AuthPayloadSchema } from "@shared/schemas/auth.schema";
import { IoSocket, SocketData, SocketNextHandler } from "@shared/types/socket";
import fastifyCookie from "@fastify/cookie";

export const authenticate = (
  socket: IoSocket<SocketData>,
  next: SocketNextHandler,
) => {
  try {
    const cookies = socket.request.headers.cookie;
    if (!cookies) throw new Error();

    const token = fastifyCookie.parse(cookies)[COOKIE.ACCESS_TOKEN];
    const user = token ? AuthTokenService.validateToken("ACCESS")(token) : null;

    socket.data.user = AuthPayloadSchema.parse(user);
    next();
  } catch {
    next(new Error("Authentication Error."));
  }
};
