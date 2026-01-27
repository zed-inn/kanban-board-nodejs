import { CookieSerializeOptions } from "@fastify/cookie";
import { z } from "zod";

export const COOKIE = {
  ACCESS_TOKEN: "access-token",
  REFRESH_TOKEN: "refresh-token",
} as const;

export const COOKIE_OPTIONS: {
  ACCESS_TOKEN: CookieSerializeOptions;
  REFRESH_TOKEN: CookieSerializeOptions;
} = {
  ACCESS_TOKEN: { httpOnly: true, secure: true, sameSite: true, signed: true },
  REFRESH_TOKEN: { httpOnly: true, secure: true, sameSite: true, signed: true },
} as const;

export const AuthCookieSchema = z.object({
  [COOKIE.ACCESS_TOKEN]: z.string(),
  [COOKIE.REFRESH_TOKEN]: z.string(),
});
export const AuthCookiePartialSchema = AuthCookieSchema.partial();

export type AuthCookie = z.infer<typeof AuthCookieSchema>;
export type AuthCookiePartial = z.infer<typeof AuthCookiePartialSchema>;
