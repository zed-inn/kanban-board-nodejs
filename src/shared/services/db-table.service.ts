import { ZodObject } from "zod";
import db from "@config/db";
import { convertSnakeToCamel } from "@shared/utils/snake-to-camel-keys";
import { PoolClient } from "pg";

export class DbTable<T extends Record<string, unknown>> {
  private readonly sqlSchema: string;
  public readonly zodSchema: ZodObject;

  constructor(sqlSchema: string, zodSchema: ZodObject) {
    this.sqlSchema = sqlSchema;
    this.zodSchema = zodSchema;

    db.query(this.sqlSchema);
  }

  async query(
    ...args: [
      ...Parameters<(typeof db)["query"]>,
      options?: { client?: PoolClient },
    ]
  ) {
    const [queryString, queryValues, options = null] = args;
    try {
      const res = await (options?.client ?? db).query(queryString, queryValues);
      return {
        res,
        rows: res.rows.map((r) =>
          this.zodSchema.parse(convertSnakeToCamel(r)),
        ) as T[],
      };
    } catch (err) {
      throw err;
    }
  }
}
