import { ID } from "@config/constants/db-schema";
import app from "./app";
import { SocketData } from "@shared/types/socket";
import { GlobalResponse } from "@shared/schemas/global.schema";
import { IoServer } from "@shared/io/create-io-server";
import { authenticate } from "@shared/io/middlewares/authenticate";
import { isMemberOfBoard } from "@shared/io/middlewares/restrict-to";
import { SOCKET } from "@shared/io/io.constants";

const io = IoServer<SocketData>(app.server, {
  cors: { credentials: true },
});

io.use(authenticate);

io.on("connection", async (socket) => {
  // Middlewares
  socket.use(isMemberOfBoard(socket, [SOCKET.EVENTS["join-board"]]));

  console.log(`Socket connected: ${socket.id}`);

  // One socket only connects to one board, at one time
  socket.on(
    SOCKET.EVENTS["join-board"],
    (boardId: ID, callback: (response: GlobalResponse<{}>) => void) => {
      socket._cleanup(); // make socket leave all rooms
      socket.join(`board:${boardId}`); // make socket only join the current board

      callback({ message: "Board selected." });
    },
  );

  socket.on("disconnect", async () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

export default io;
