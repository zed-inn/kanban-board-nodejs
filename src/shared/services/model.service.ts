import { ID } from "@config/constants/db-schema";
import db from "@config/db";
import { models } from "@shared/db/tables";
import { DatabaseConnServiceOptions } from "@shared/types/database-conn";
import { AppError } from "@shared/utils/app-error";
import { removeUndefined } from "@shared/utils/clean-object";
import {
  convertCamelToSnake,
  convertSnakeToCamel,
} from "@shared/utils/snake-to-camel-keys";
import { z } from "zod";

export type TableDetails = {
  tableName: string;
};

export class DbModel<T extends z.ZodObject> {
  private sqlSchema: string;
  public schema: T;
  public details: TableDetails;

  public ops = new DbModelOps<z.infer<T>>(this);
  public utils = new DbModelUtils();

  constructor(sqlSchema: string, schema: T, details: TableDetails) {
    this.sqlSchema = sqlSchema;
    this.schema = schema;
    this.details = details;

    models.addMethod(this.createTable);
  }

  private createTable = async () => {
    await db.query(this.sqlSchema);
  };

  async query(
    ...args: [
      ...Parameters<(typeof db)["query"]>,
      options?: DatabaseConnServiceOptions,
    ]
  ) {
    const [queryString, queryValues, options = null] = args;

    const res = await (options?.client ?? db).query(queryString, queryValues);
    return res.rows.map((r) =>
      this.schema.parse(convertSnakeToCamel(r)),
    ) as z.infer<T>[];
  }
}

export class DbModelOps<T extends z.infer<z.ZodObject>> {
  private model: InstanceType<typeof DbModel>;

  constructor(model: InstanceType<typeof DbModel>) {
    this.model = model;
  }

  get = async (
    _filters: Partial<T>,
    options: DatabaseConnServiceOptions = {},
  ) => {
    const filters = convertCamelToSnake(removeUndefined(_filters));

    const query = `SELECT * FROM ${this.model.details.tableName} WHERE ${DbModelUtils.createPlaceholdersWithKeysFrom(Object.keys(filters), 1).join(" AND ")};`;

    const objs = await this.model.query(
      query,
      [...Object.values(filters)],
      options,
    );
    return objs as T[];
  };

  getById = async (id: ID, options: DatabaseConnServiceOptions = {}) => {
    const query = `SELECT * FROM ${this.model.details.tableName} WHERE id = $1;`;

    const _obj = (await this.model.query(query, [id], options)) as T[];
    const obj = _obj[0];
    if (!obj) throw new AppError("Not found.", 400);
    return obj;
  };

  create = async (
    _data: Partial<T>,
    options: DatabaseConnServiceOptions = {},
  ) => {
    const data = convertCamelToSnake(removeUndefined(_data));

    const query = `INSERT INTO ${this.model.details.tableName}(${Object.keys(data).join(", ")}) VALUES(${DbModelUtils.createPlaceholdersFromTo(1, Object.values(data).length).join(", ")}) RETURNING *;`;

    const _obj = (await this.model.query(
      query,
      [...Object.values(data)],
      options,
    )) as T[];
    const obj = _obj[0];
    if (!obj) throw new AppError("Internal Server Error.", 500);
    return obj;
  };

  updateByFilters = async (
    _data: Partial<T>,
    _filters: Partial<T>,
    options: DatabaseConnServiceOptions = {},
  ) => {
    const data = convertCamelToSnake(removeUndefined(_data));
    const filters = convertCamelToSnake(removeUndefined(_filters));

    const query = `UPDATE ${this.model.details.tableName} SET ${DbModelUtils.createPlaceholdersWithKeysFrom(Object.keys(data), 1).join(", ")}${Object.keys(this.model.schema.shape).includes("updatedAt") ? ", updated_at = NOW()" : ""} WHERE ${DbModelUtils.createPlaceholdersWithKeysFrom(Object.keys(filters), Object.keys(data).length + 1).join(" AND ")} RETURNING *;`;

    const _obj = (await this.model.query(
      query,
      [...Object.values(data), ...Object.values(filters)],
      options,
    )) as T[];
    const obj = _obj[0];
    if (!obj) throw new AppError("Internal Server Error.", 500);
    return obj;
  };

  deleteByFilters = async (
    _filters: Partial<T>,
    options: DatabaseConnServiceOptions = {},
  ) => {
    const filters = convertCamelToSnake(removeUndefined(_filters));

    const query = `DELETE FROM ${this.model.details.tableName} WHERE ${DbModelUtils.createPlaceholdersWithKeysFrom(Object.keys(filters), 1).join(" AND ")} RETURNING *;`;

    const objs = (await this.model.query(
      query,
      [...Object.values(filters)],
      options,
    )) as T[];

    return objs;
  };

  deleteOne = async (...args: Parameters<typeof this.deleteByFilters>) => {
    const _objs = await this.deleteByFilters(...args);
    const obj = _objs[0];
    if (!obj) throw new AppError("Internal Server Error.", 500);
    return obj;
  };
}

export class DbModelUtils {
  wrapper = new DbModelWrapper();

  static createPlaceholdersFromTo = (from: number, to: number) => {
    const placeholders = [];
    for (let i = from; i <= to; i++) placeholders.push(`$${i}`);

    return placeholders;
  };

  static createPlaceholdersWithKeysFrom = (keys: string[], from: number) => {
    let i = from;
    const placeholders: string[] = [];
    for (const k of keys) placeholders.push(`${k} = $${i++}`);

    return placeholders;
  };
}

export class DbModelWrapper {
  getOne = (x: unknown[]) => x[0] ?? null;
}
