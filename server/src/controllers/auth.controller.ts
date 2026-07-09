import { Request, Response } from "express";
import crypto from "crypto";
import { userRepository } from "../repositories/user.repository";
import { AuthRequest, UserRole } from "../types/user.type";
import { AppError, sendCreated, sendSuccess } from "../utils/response.util";
import { createAuthTokens, verifyRefreshToken } from "../utils/token.util";
import { IUser } from "../models/user.model";

const buildTokenPayload = (user: {
  _id: { toString(): string };
  role: UserRole;
  email: string;
}) => ({
  userId: user._id.toString(),
  role: user.role,
  email: user.email,
});

export const register = async (
  req: Request,
  res: Response,
): Promise<Response> => {
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

  return sendSuccess(
    res,
    { user: user.toPublicJSON(), tokens },
    "Login successful",
  );
};

export const me = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  if (!req.currentUser) {
    throw new AppError("Authentication required", 401);
  }

  return sendSuccess(
    res,
    { user: req.currentUser.toPublicJSON() },
    "Profile fetched",
  );
};

export const refresh = async (
  req: Request,
  res: Response,
): Promise<Response> => {
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
    .filter((token: string) => token !== refreshToken)
    .concat(tokens.refreshToken)
    .slice(-5);
  await user.save();

  return sendSuccess(res, { tokens }, "Token refreshed");
};

// POST /auth/forgot-password
// Always responds with a generic success message regardless of whether the
// email exists, to avoid leaking which addresses are registered.
export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const user = await userRepository.findByEmail(req.body.email);
  let rawToken: string | undefined;

  if (user) {
    rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save({ validateBeforeSave: false });

    // TODO: wire up a real email provider (e.g. SES/SendGrid/Postmark) and
    // send `rawToken` via a link like `locapasa://reset-password?token=...`.
    // For now this is logged so the flow is testable end-to-end in dev.
    console.log(
      `[password reset] ${user.email} -> token=${rawToken} (expires in 15 min)`,
    );
  }

  return sendSuccess(
    res,
    // Only echo the token back outside production, so the app can be tested
    // without a real email service wired up yet.
    process.env.NODE_ENV !== "production" && rawToken
      ? { devResetToken: rawToken }
      : null,
    "If an account exists for that email, a reset link has been sent.",
  );
};

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { token, password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await userRepository.findByResetToken(hashedToken);

  if (!user) {
    throw new AppError("Reset link is invalid or has expired", 400);
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = []; // force re-login on all devices
  await user.save();

  return sendSuccess(
    res,
    null,
    "Password reset successfully. Please log in with your new password.",
  );
};

export const logout = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const refreshToken = req.body.refreshToken;

  if (typeof refreshToken === "string") {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await userRepository.findById(payload.userId, true);

      if (user) {
        user.refreshTokens = user.refreshTokens.filter(
          (token: string) => token !== refreshToken,
        );
        await user.save();
      }
    } catch (error) {
      // Token might be expired or invalid, still proceed with logout
      console.error("Error during logout token invalidation:", error);
    }
  }

  return sendSuccess(res, null, "Logged out");
};
