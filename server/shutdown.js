import { closePg } from "../db/pg.js";
import server, { io } from "./socket.js";

export const shutdownApplication = async () => {
  await closePg();

  await io.close();
  server.closeAllConnections();
  server.close(() => {
    console.log("Server closed, stopped listening.");
  });
};
