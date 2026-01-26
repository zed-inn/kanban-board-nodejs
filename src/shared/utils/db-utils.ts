import db from "@config/db";

export type QueryParams = Parameters<typeof db.query>;

export class DbUtils {
  static count = async (...args: QueryParams) => {
    const res = await db.query(...args);
    const countRes = res.rows[0].count as number;
    return typeof countRes === "number" ? countRes : 0;
  };
}
