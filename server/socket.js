import { createServer } from "http";
import app from "./main.js";
import { Server } from "socket.io";
import { env } from "../env/env.config.js";
import { CardService } from "../services/CardService.js";
import { Service } from "../utils/services.js";

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: env.server.socket.origin,
    methods: ["GET", "POST"],
  },
});

// socket comms
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("create", async ({ groupName, title, content, order }) => {
    const result = await CardService.create(groupName, title, content, order);

    if (result.type === Service.CODE.OK) io.emit("saved", result.values);
    else socket.emit("error", result.reason, result.values);
  });

  socket.on("update", async ({ id, values }) => {
    const result = await CardService.update(id, values);

    if (result.type === Service.CODE.OK) io.emit("saved", result.values);
    else socket.emit("error", result.reason, result.values);
  });

  socket.on("delete", async ({ id }) => {
    const result = await CardService.delete(id);

    if (result.type === Service.CODE.OK) io.emit("deleted", result.values);
    else socket.emit("error", result.reason, result.values);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

export default server;
