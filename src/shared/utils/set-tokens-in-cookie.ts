import { CookieSerializeOptions } from "@fastify/cookie";
import { AuthTokenService } from "@modules/core/auth/auth.service";
import { AuthPayload } from "@shared/schemas/auth.schema";

export const TOKEN = { ACCESS: "access-token", REFRESH: "refresh-token" };

export const cookieAccessToken = (payload: AuthPayload) => {
  const cookieName = TOKEN.ACCESS;
  const options: CookieSerializeOptions = {
    httpOnly: true,
    secure: true,
    sameSite: true,
    signed: true,
  };
  return {
    name: cookieName,
    value: AuthTokenService.createToken("ACCESS")(payload),
    options,
  };
};

export const cookieRefreshToken = (payload: AuthPayload) => {
  const cookieName = TOKEN.REFRESH;
  const options: CookieSerializeOptions = {
    httpOnly: true,
    secure: true,
    sameSite: true,
    signed: true,
  };
  return {
    name: cookieName,
    value: AuthTokenService.createToken("REFRESH")(payload),
    options,
  };
};
