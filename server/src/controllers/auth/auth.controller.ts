import { Request, Response } from "express";
import crypto from "crypto";
import { userRepository } from "../../repositories/user.repository";
import { AuthRequest, UserRole } from "../../types/user.type";
import { AppError, sendCreated, sendSuccess } from "../../utils/response.util";
import { createAuthTokens, verifyRefreshToken } from "../../utils/token.util";

const buildTokenPayload = (user: {
  _id: { toString(): string };
  role: UserRole;
  email: string;
}) => ({
  userId: user._id.toString(),
  role: user.role,
  email: user.email,
});

export const register = async (req: Request, res: Response): Promise<Response> => {
  const exists = await userRepository.exists({ email: req.body.email });
  if (exists) {
    throw new AppError("Email is already registered", 409);
  }

  const user = await userRepository.create(req.body);
  const tokenFamily = crypto.randomUUID();
  const tokens = createAuthTokens(buildTokenPayload(user), tokenFamily);

  user.refreshTokens = [tokens.refreshToken];
  await user.save();

  return sendCreated(
    res,
    { user: user.toPublicJSON(), tokens },
    "Account created successfully",
  );
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const user = await userRepository.findByEmail(req.body.email, true);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.isLocked()) {
    throw new AppError("Account is temporarily locked. Try again later.", 423);
  }

  const passwordMatches = await user.comparePassword(req.body.password);
  if (!passwordMatches) {
    await user.incrementLoginAttempts();
    throw new AppError("Invalid email or password", 401);
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLogin = new Date();

  const tokenFamily = crypto.randomUUID();
  const tokens = createAuthTokens(buildTokenPayload(user), tokenFamily);
  user.refreshTokens = [...user.refreshTokens.slice(-4), tokens.refreshToken];
  await user.save();

  return sendSuccess(res, { user: user.toPublicJSON(), tokens }, "Login successful");
};

export const me = async (req: AuthRequest, res: Response): Promise<Response> => {
  if (!req.currentUser) {
    throw new AppError("Authentication required", 401);
  }

  return sendSuccess(res, { user: req.currentUser.toPublicJSON() }, "Profile fetched");
};

export const refresh = async (req: Request, res: Response): Promise<Response> => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken || typeof refreshToken !== "string") {
    throw new AppError("Refresh token is required", 400);
  }

  const payload = verifyRefreshToken(refreshToken);
  const user = await userRepository.findById(payload.userId, true);

  if (!user || !user.refreshTokens.includes(refreshToken)) {
    throw new AppError("Invalid refresh token", 401);
  }

  const tokens = createAuthTokens(buildTokenPayload(user), payload.tokenFamily);
  user.refreshTokens = user.refreshTokens
    .filter((token) => token !== refreshToken)
    .concat(tokens.refreshToken)
    .slice(-5);
  await user.save();

  return sendSuccess(res, { tokens }, "Token refreshed");
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
  const refreshToken = req.body.refreshToken;

  if (typeof refreshToken === "string") {
    const payload = verifyRefreshToken(refreshToken);
    const user = await userRepository.findById(payload.userId, true);

    if (user) {
      user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
      await user.save();
    }
  }

  return sendSuccess(res, null, "Logged out");
};
