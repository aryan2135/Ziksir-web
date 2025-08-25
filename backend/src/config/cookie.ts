// cookies.ts
import type { Response, CookieOptions } from "express";
import { env } from "../config/env";

const isProd = env.NODE_ENV === "production";
const isCrossSite = String(env.IS_CROSS_SITE).toLowerCase() === "true";

const baseCookie: CookieOptions = {
  httpOnly: true,
  path: "/",
  secure: isProd,
  sameSite: (isCrossSite ? "none" : "lax") as CookieOptions["sameSite"],
};

export function setAuthCookie(res: Response, token: string) {
  const name = isProd ? "__Host-session" : "authToken";
  res.cookie(name, token, {
    ...baseCookie,
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res: Response) {
  const name = isProd ? "__Host-session" : "authToken";
  res.clearCookie(name, {
    ...baseCookie,
  });
}
