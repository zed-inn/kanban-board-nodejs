import { ID } from "@config/constants/db-schema";
import { USER } from "./user.constants";
import bcrypt from "bcryptjs";
import { User } from "./user.model";

export class UserService {
  static getByEmail = async (email: string) => {
    const users = await User.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);
    return users[0] ?? null;
  };

  static create = async (email: string, password: string) => {
    const passwordHash = await UserUtils.hashPassword(password);
    return await User.ops.create({ email, passwordHash });
  };

  static updatePasswordById = async (id: ID, password: string) => {
    const passwordHash = await UserUtils.hashPassword(password);
    return await User.ops.updateByFilters({ passwordHash }, { id });
  };

  static updatePasswordByEmail = async (email: string, password: string) => {
    const passwordHash = await UserUtils.hashPassword(password);
    return await User.ops.updateByFilters({ passwordHash }, { email });
  };

  static deleteById = async (id: ID) => {
    const user = await User.query(
      "DELETE FROM users WHERE id = $1 RETURNING *;",
      [id],
    );
    return user[0] ?? null;
  };
}

export class UserUtils {
  static hashPassword = async (password: string) => {
    const passwordHash = await bcrypt.hash(password, USER.PASSWORD_HASH.SALT);
    return passwordHash;
  };

  static comparePassword = async (password: string, passwordHash: string) => {
    try {
      const match = await bcrypt.compare(password, passwordHash);
      return match;
    } catch {}
    return false;
  };
}
