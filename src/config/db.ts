import { Pool } from "pg";
import { env } from "./env";

export class DatabaseConn {
  private pool: Pool;
  protected logger: Function = console.log;
  public connected: boolean = false;

  constructor(logger?: Function) {
    if (logger) this.logger = logger;
    this.pool = new Pool({
      user: env.PG_USER,
      host: env.PG_HOST,
      password: env.PG_PASSWORD,
      database: env.PG_DATABASE,
      port: env.PG_PORT,
    });

    try {
      this.query("SELECT 1+1;");
    } catch (err) {
      this.connected = true;
    }
  }

  query = async (query: string, values?: unknown[]) => {
    const startTime = Date.now();

    const res = await this.pool.query(query, values);

    const endTime = Date.now();
    const queryLog = { query, timeTaken: `${endTime - startTime} ms` };
    if (this.logger && env.NODE_ENV !== "prod") this.logger(queryLog);

    return res;
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
