import { env } from "@config/env";
import { createEnum } from "@shared/utils/create-enum";
import jwt from "jsonwebtoken";

export class TokenService<
  T extends Record<string, unknown>,
  W extends Record<string, unknown>,
> {
  private readonly jwtMaxAgeMs = {
    accessToken: env.JWT_ACCESS_MAX_AGE_MINS * 60 * 1000,
    refreshToken: env.JWT_REFRESH_MAX_AGE_MINS * 60 * 1000,
  };

  private readonly types = createEnum(["ACCESS", "REFRESH"] as const);

  createToken =
    <K extends (typeof this.types._)[number]>(type: K) =>
    (obj: K extends "ACCESS" ? T : W): string => {
      const token = jwt.sign(obj, env.JWT_SECRET, {
        expiresIn:
          type === "ACCESS"
            ? this.jwtMaxAgeMs.accessToken
            : this.jwtMaxAgeMs.refreshToken,
      });
      return token;
    };

  validateToken =
    <K extends (typeof this.types._)[number]>(type: K) =>
    (token: string): null | (K extends "ACCESS" ? T : W) => {
      try {
        const data = jwt.verify(token, env.JWT_SECRET);
        return data as K extends "ACCESS" ? T : W;
      } catch {
        return null;
      }
    };
}
