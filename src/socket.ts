import { Server } from "socket.io";
import app from "./app";

const io = new Server(app.server, {});

io.on("connection", async (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("disconnect", async () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

export default io;
