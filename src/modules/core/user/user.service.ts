import { ID } from "@config/constants/db-schema";
import { USER } from "./user.constants";
import bcrypt from "bcryptjs";
import { User } from "./user.model";
import { AppError } from "@shared/utils/app-error";

export class UserService {
  static getByEmail = async (email: string) => {
    const users = await User.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);
    const user = users[0] ?? null;
    if (!user) throw new AppError("Not found.", 400);
    return user;
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
    return await User.ops.deleteOne({ id });
  };
}

export class UserUtils {
  static hashPassword = async (password: string) => {
    const passwordHash = await bcrypt.hash(password, USER.PASSWORD_HASH.SALT);
    return passwordHash;
  };

  static comparePassword = async (password: string, passwordHash: string) => {
    const match = await bcrypt.compare(password, passwordHash);
    return match;
  };
}
