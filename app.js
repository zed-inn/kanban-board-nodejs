import { env } from "./env/env.config.js";
import { shutdownApplication } from "./server/shutdown.js";
import server from "./server/socket.js";

const { host, port, url } = env.server;

server.listen(port, host, () => {
  console.log(`Listening on ${url}`);

  // close application
  process.on("SIGINT", shutdownApplication);
});
