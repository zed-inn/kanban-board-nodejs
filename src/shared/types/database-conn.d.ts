import { PoolClient } from "pg";

export interface DatabaseConnServiceOptions {
  client?: PoolClient;
}
