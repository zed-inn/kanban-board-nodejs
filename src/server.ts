import { env } from "@config/env";
import { shutdown } from "@shared/services/shutdown.service";
import db from "@config/db";
import app from "./app";
import io from "./socket";
import { models } from "@shared/db/tables";

const startServer = async () => {
  try {
    io; // Execute io
    app.log.info("Socket enabled.");
    if (db.connected) {
      app.log.info("Postgres connected.");
      await models.runAll(() => console.log("Tables created."));
    }
    await app.listen({ port: env.APP_PORT, host: env.APP_HOST });
  } catch (err) {
    app.log.error(err);
    shutdown("ERROR");
    process.exit(1);
  }
};

startServer();

// Graceful shutdown server
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("SIGUSR2", async () => {
  await shutdown("SIGUSR2");
  process.kill(process.pid, "SIGUSR2");
});

process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err);
  shutdown("UNHANDLED_REJECTION");
});

process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err);
  process.exit(1);
});
