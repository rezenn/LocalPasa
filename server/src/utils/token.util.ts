import jwt from "jsonwebtoken";
import { config } from "../configs/env";
import {
  AccessTokenPayload,
  AuthTokens,
  RefreshTokenPayload,
  UserRole,
} from "../types/user.type";

export const createAuthTokens = (
  payload: { userId: string; role: UserRole; email: string },
  tokenFamily: string,
): AuthTokens => {
  const accessPayload: AccessTokenPayload = {
    userId: payload.userId,
    role: payload.role,
    email: payload.email,
    tokenFamily,
  };

  const refreshPayload: RefreshTokenPayload = {
    userId: payload.userId,
    tokenFamily,
  };

  const accessToken = jwt.sign(accessPayload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpire,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(refreshPayload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpire,
  } as jwt.SignOptions);

  return {
    accessToken,
    refreshToken,
    expiresIn: config.jwt.accessExpireMs,
  };
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, config.jwt.accessSecret) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload;
};
