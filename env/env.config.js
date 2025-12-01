import dotenv from "dotenv";
dotenv.config();

const server = {
  host: process.env.HOST ?? "localhost",
  port: process.env.PORT ?? 3000,
  url: `http://${process.env.HOST ?? "localhost"}:${process.env.PORT ?? 3000}`,
  socket: {
    origin: process.env.SOCKET_ORIGIN ?? "*",
  },
};

/**
 * Application Environment
 */
export const env = { server };
