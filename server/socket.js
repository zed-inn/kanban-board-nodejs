import { createServer } from "http";
import app from "./main.js";
import { Server } from "socket.io";
import { env } from "../env/env.config.js";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.server.socket.origin,
    methods: ["GET", "POST"],
  },
});

// socket comms
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

export default server;
