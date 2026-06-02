import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../configs/env";
import { AccessTokenPayload, AuthTokens, RefreshTokenPayload } from "../types/user.type";

export const signAccessToken = (
  payload: Omit<AccessTokenPayload, "tokenVersion">,
): string => {
  const options: SignOptions = { expiresIn: config.jwt.accessExpire as SignOptions["expiresIn"] };
  return jwt.sign({ ...payload, tokenVersion: 1 }, config.jwt.accessSecret, {
    ...options,
  });
};

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  const options: SignOptions = { expiresIn: config.jwt.refreshExpire as SignOptions["expiresIn"] };
  return jwt.sign(payload, config.jwt.refreshSecret, options);
};

export const createAuthTokens = (
  payload: Omit<AccessTokenPayload, "tokenVersion">,
  tokenFamily: string,
): AuthTokens => {
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken({ userId: payload.userId, tokenFamily }),
    expiresIn: config.jwt.accessExpireMs,
  };
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, config.jwt.accessSecret) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload;
};
