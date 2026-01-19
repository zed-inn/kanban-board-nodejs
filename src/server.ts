import { env } from "@config/env";
import app from "./app";
import io from "./socket";
import { shutdown } from "@shared/services/shutdown.service";
import pool from "@config/db";

const startServer = async () => {
  try {
    io; // Execute io
    app.log.info("Socket enabled.");
    pool; // Know pool connected
    app.log.info("Postgres connected.");
    await app.listen({ port: env.APP_PORT, host: env.APP_HOST });
  } catch (err) {
    app.log.error(err);
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
