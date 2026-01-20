import { USER } from "./user.constants";
import { User } from "./user.table";
import bcrypt from "bcryptjs";

export class UserService {
  static getById = async (id: string) => {
    const _user = await User.query("SELECT * FROM users WHERE id = $1", [id]);
    return _user.rows.at(0) ?? null;
  };

  static create = async (email: string, password: string) => {
    const passwordHash = await UserUtils.hashPassword(password);
    const _user = await User.query(
      "INSERT INTO users(email, password_hash) VALUES($1, $2) RETURNING *;",
      [email, passwordHash],
    );
    return _user.rows.at(0) ?? null;
  };

  static updatePasswordById = async (id: string, password: string) => {
    const passwordHash = await UserUtils.hashPassword(password);
    const _user = await User.query(
      "UPDATE users SET password_hash = $1, updated_At = NOW() WHERE id = $3 RETURNING *;",
      [passwordHash, id],
    );
    return _user.rows.at(0) ?? null;
  };

  static deleteById = async (id: string) => {
    const _user = await User.query(
      "DELETE FROM users WHERE id = $1 RETURNING *;",
      [id],
    );
    return _user.rows.at(0) ?? null;
  };
}

export class UserUtils {
  static hashPassword = async (password: string) => {
    const passwordHash = await bcrypt.hash(password, USER.PASSWORD_HASH.SALT);
    return passwordHash;
  };
}
