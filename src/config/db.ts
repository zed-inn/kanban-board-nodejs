import { Pool } from "pg";
import { env } from "./env";

const pool = new Pool({
  user: env.PG_USER,
  host: env.PG_HOST,
  password: env.PG_PASSWORD,
  database: env.PG_DATABASE,
  port: env.PG_PORT,
});

export default pool;
