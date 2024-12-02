import { CookieOptions } from 'express';

const date = new Date();
date.setSeconds(Number(process.env.JWT_REFRESH_TOKEN_EXPIRE ?? 0));

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  expires: date,
};
