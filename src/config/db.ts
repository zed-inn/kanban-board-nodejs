import { Pool } from "pg";
import { env } from "./env";

export class DatabaseConn {
  private pool: Pool;
  public connected: boolean = false;

  constructor() {
    this.pool = new Pool({
      user: env.PG_USER,
      host: env.PG_HOST,
      password: env.PG_PASSWORD,
      database: env.PG_DATABASE,
      port: env.PG_PORT,
    });
    this.connected = true;
  }

  query = async (query: string, values?: unknown[]) => {
    return await this.pool.query(query, values);
  };

  close = async (fn?: (err?: Error) => void) => {
    let err: Error | undefined;
    try {
      await this.pool.end();
    } catch (_err) {
      err = _err as Error;
    } finally {
      if (fn) fn(err);
    }
  };
}

const db = new DatabaseConn();

export default db;
