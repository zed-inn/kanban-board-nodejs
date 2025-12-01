import server from "./socket.js";

export const shutdownApplication = async () => {
  server.closeAllConnections();
  server.close(() => {
    console.log("Server closed, stopped listening.");
  });
};
