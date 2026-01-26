import { Pool, PoolClient, QueryResult } from "pg";
import { env } from "./env";

interface TPoolClient extends PoolClient {
  beginTransaction: () => Promise<void | QueryResult<any>>;
  commitTransaction: () => Promise<void | QueryResult<any>>;
  rollbackTransaction: () => Promise<void | QueryResult<any>>;
}

export class DatabaseConn {
  private pool: Pool;
  protected logger: Function = console.log;
  public connected: boolean = false;
  protected logEnabled: boolean = false;

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

    this.logEnabled = this.logger && env.NODE_ENV !== "prod";
  }

  query = async (query: string, values?: unknown[]) => {
    const startTime = this.logEnabled ? Date.now() : 0;

    const res = await this.pool.query(query, values);

    if (this.logEnabled) {
      const endTime = Date.now();
      const queryLog = {
        query: query.replace(/\s+/g, " "),
        timeTaken: `${endTime - startTime} ms`,
      };
      this.logger(queryLog);
    }

    return res;
  };

  getClient = async () => {
    const client = (await this.pool.connect()) as any;
    const _client = client as PoolClient;

    client.beginTransaction = () => _client.query("BEGIN;");
    client.commitTransaction = async () => {
      await _client.query("COMMIT;");
      _client.release();
    };
    client.rollbackTransaction = async () => {
      await _client.query("ROLLBACK;");
      _client.release();
    };

    return client as TPoolClient;
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
