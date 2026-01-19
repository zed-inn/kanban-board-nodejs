import pool from "@config/db";
import app from "../../app";
import io from "../../socket";

export const shutdown = async (signal: string) => {
  try {
    app.log.info(`${signal} received. Starting graceful shutdown...`);

    await io.close((err) => {
      if (err) app.log.error(err);
      else app.log.info("Socket closed.");
    });

    await pool.end();
    app.log.info("Postgres closed.");

    await app.close();
    app.log.info("Fastify application closed.");

    app.log.info("Shutdown successfull.");
    process.exit(0);
  } catch (err) {
    console.log("Some error occured :", err);
    process.exit(1);
  }
};
